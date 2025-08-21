export class H6502 {
  A: number = 0;
  X: number = 0;
  Y: number = 0;
  PC: number = 0;
  SP: number = 0xff;
  IR: number = 0;
  cycles: number = 0;

  flags: {
    N: boolean;
    V: boolean;
    D: boolean;
    I: boolean;
    Z: boolean;
    C: boolean;
    B: boolean;
    U: boolean;
  } = {
    N: false,
    V: false,
    D: false,
    I: false,
    Z: false,
    C: false,
    B: false,
    U: true,
  };
  constructor(public memory: Memory) {
    this.memory = memory;
  }
  reset(): void {
    this.A = 0;
    this.X = 0;
    this.Y = 0;
    this.PC = (this.memory.read(0xfffc) | (this.memory.read(0xfffd) << 8)) & 0xffff;
    this.SP = 0xff;
    this.cycles = 0;

    // Reset flags
    this.flags.N = false;
    this.flags.V = false;
    this.flags.D = false;
    this.flags.I = false;
    this.flags.Z = false;
    this.flags.C = false;
    this.flags.B = false;
  }

  //addressing modes
  //immediate
  imm() {
    return this.PC++;
  }
  //zero page
  zp() {
    const addr = this.memory.read(this.PC++);
    return addr & 0xff;
  }
  //zero page X
  zpx() {
    const addr = (this.memory.read(this.PC++) + this.X) & 0xff;
    return addr;
  }
  //zero page Y
  zpy() {
    const addr = (this.memory.read(this.PC++) + this.Y) & 0xff;
    return addr;
  }
  //absolute
  abs() {
    const low = this.memory.read(this.PC++);
    const high = this.memory.read(this.PC++);
    return (high << 8) | low;
  }

  //absolute X
  absX() {
    const addr = this.abs();
    return (addr + this.X) & 0xffff;
  }

  //absolute Y
  absY() {
    const addr = this.abs();
    return (addr + this.Y) & 0xffff;
  }

  //indirect
  ind() {
    const low = this.memory.read(this.PC++);
    const high = this.memory.read(this.PC++);
    const addr = (high << 8) | low;
    if (low === 0xff) {
      return (this.memory.read(addr & 0xff00) << 8) | this.memory.read(addr);
    } else {
      return (this.memory.read(addr + 1) << 8) | this.memory.read(addr);
    }
  }

  //indirect X
  indX() {
    const zpAddr = this.zp();
    const low = this.memory.read(zpAddr);
    const high = this.memory.read((zpAddr + 1) & 0xff);
    return (high << 8) | low;
  }

  //indirect Y
  indY() {
    const zpAddr = this.zp();
    const low = this.memory.read(zpAddr);
    const high = this.memory.read((zpAddr + 1) & 0xff);
    const addr = (high << 8) | low;
    return (addr + this.Y) & 0xffff;
  }
  //relative
  rel() {
    const offset = this.memory.read(this.PC++);
    const addr = this.PC + offset;
    return addr & 0xffff;
  }
  //stack
  stack() {
    const addr = 0x100 + this.SP;
    this.SP = (this.SP - 1) & 0xff;
    return addr;
  }
  //stack push
  push(value: number): void {
    if (this.SP < 0) {
      throw new Error("Stack overflow");
    }
    this.memory.write(this.stack(), value & 0xff);
  }
  //stack pull
  pull(): number {
    if (this.SP > 0xff) {
      throw new Error("Stack underflow");
    }
    const value = this.memory.read(this.stack());
    this.SP = (this.SP + 1) & 0xff;
    return value;
  }

  read(address: number) {
    return this.memory.read(address);
  }

  write(address: number, data: number) {
    this.memory.write(address, data & 0xff);
  }

  //ADC
  ADC() {
    const addr = this.imm();
    const value = this.read(addr);
    const carry = this.flags.C ? 1 : 0;
    const result = this.A + value + carry;
    this.flags.C = result > 0xff;
    this.flags.Z = (result & 0xff) === 0;
    this.flags.N = (result & 0x80) !== 0;
    this.flags.V = ((this.A ^ value) & 0x80) === ((this.A ^ result) & 0x80);
    this.A = result & 0xff;
    this.cycles += 2;
  }

  //AND
  AND() {
    const addr = this.imm();
    const value = this.read(addr);
    this.A &= value;
    this.flags.Z = this.A === 0;
    this.flags.N = (this.A & 0x80) !== 0;
    this.cycles += 2;
  }
  //ASL
  ASL() {
    const addr = this.imm();
    let value = this.read(addr);
    this.flags.C = (value & 0x80) !== 0;
    value = (value << 1) & 0xff;
    this.flags.Z = value === 0;
    this.flags.N = (value & 0x80) !== 0;
    this.write(addr, value);
    this.cycles += 2;
  }
}

export class Memory {
  data: Uint8Array;
  constructor(public size: number) {
    this.data = new Uint8Array(size);
  }

  read(address: number): number {
    if (address < 0 || address >= this.size) {
      throw new Error("Memory read out of bounds");
    }
    return this.data[address];
  }
  write(address: number, value: number): void {
    if (address < 0 || address >= this.size) {
      throw new Error("Memory write out of bounds");
    }
    if (value < 0 || value > 255) {
      throw new Error("Value must be between 0 and 255");
    }
    this.data[address] = value;
  }
  clear(): void {
    this.data.fill(0);
  }
  load(data: Uint8Array, startAddress: number = 0): void {
    if (startAddress < 0 || startAddress + data.length > this.size) {
      throw new Error("Data load out of bounds");
    }
    this.data.set(data, startAddress);
  }
}
