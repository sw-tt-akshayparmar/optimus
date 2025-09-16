export class H6502 {
  A: number = 0;
  X: number = 0;
  Y: number = 0;
  PC: number = 0;
  SP: number = 0xff;
  IR: number = 0;
  cycles: number = 0;
  instruction: (() => void) | null = null;

  isa: { [key: number]: () => void } = {
    0x69: this.ADC,
    0x29: this.AND,
    0x0a: this.ASL,
    0x24: this.BIT,
    0xc9: this.CMP,
    0xe0: this.CPX,
    0xc0: this.CPY,
    0xc6: this.DEC,
    0x49: this.EOR,
    0xe6: this.INC,
    0x4c: this.JMP,
    0x20: this.JSR,
    0xa9: this.LDA,
    0xa2: this.LDX,
    0xa0: this.LDY,
    0x4a: this.LSR,
    0x09: this.ORA,
    0x48: this.PHA,
    0x08: this.PHP,
    0x68: this.PLA,
    0x28: this.PLP,
    0x2a: this.ROL,
    0x6a: this.ROR,
    0x40: this.RTI,
    0x60: this.RTS,
    0xe9: this.SBC,
    0x38: this.SEC,
    0xf8: this.SED,
    0x78: this.SEI,
    0xaa: this.TAX,
    0xa8: this.TAY,
    0xba: this.TSX,
    0x8a: this.TXA,
    0x9a: this.TXS,
    0x98: this.TYA,
    0xea: this.NOP,
    0x00: this.BRK,
  };

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
    this.reset();
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

  fertch(): number {
    this.IR = this.memory.read(this.PC++);
    this.cycles++;
    return this.IR;
  }
  // decodes the instruction
  decode(): void {
    this.instruction = this.isa[this.IR];
    if (!this.instruction) {
      this.instruction = this.illegal.bind(this);
    }
  }
  // executes the instruction
  execute(): void {
    if (this.instruction) {
      this.instruction();
      this.instruction = null;
    } else {
      throw new Error(`No instruction found for opcode: ${this.IR.toString(16).toUpperCase()}`);
    }
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
      throw new Error('Stack overflow');
    }
    this.memory.write(this.stack(), value & 0xff);
  }
  //stack pull
  pull(): number {
    if (this.SP > 0xff) {
      throw new Error('Stack underflow');
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

  //BIT
  BIT() {
    const addr = this.imm();
    const value = this.read(addr);
    this.flags.Z = (this.A & value) === 0;
    this.flags.N = (value & 0x80) !== 0;
    this.flags.V = (value & 0x40) !== 0;
    this.cycles += 2;
  }
  //CMP
  CMP() {
    const addr = this.imm();
    const value = this.read(addr);
    this.flags.C = this.A >= value;
    this.flags.Z = (this.A & 0xff) === (value & 0xff);
    this.flags.N = (this.A & 0x80) !== 0;
    this.cycles += 2;
  }
  //CPX
  CPX() {
    const addr = this.imm();
    const value = this.read(addr);
    this.flags.C = this.X >= value;
    this.flags.Z = (this.X & 0xff) === (value & 0xff);
    this.flags.N = (this.X & 0x80) !== 0;
    this.cycles += 2;
  }
  //CPY
  CPY() {
    const addr = this.imm();
    const value = this.read(addr);
    this.flags.C = this.Y >= value;
    this.flags.Z = (this.Y & 0xff) === (value & 0xff);
    this.flags.N = (this.Y & 0x80) !== 0;
    this.cycles += 2;
  }
  //DEC
  DEC() {
    const addr = this.imm();
    let value = this.read(addr);
    value = (value - 1) & 0xff;
    this.flags.Z = value === 0;
    this.flags.N = (value & 0x80) !== 0;
    this.write(addr, value);
    this.cycles += 2;
  }
  //EOR
  EOR() {
    const addr = this.imm();
    const value = this.read(addr);
    this.A ^= value;
    this.flags.Z = this.A === 0;
    this.flags.N = (this.A & 0x80) !== 0;
    this.cycles += 2;
  }
  //INC
  INC() {
    const addr = this.imm();
    let value = this.read(addr);
    value = (value + 1) & 0xff;
    this.flags.Z = value === 0;
    this.flags.N = (value & 0x80) !== 0;
    this.write(addr, value);
    this.cycles += 2;
  }
  //JMP
  JMP() {
    const addr = this.abs();
    this.PC = addr & 0xffff;
    this.cycles += 3;
  }
  //JSR
  JSR() {
    const addr = this.abs();
    this.push((this.PC >> 8) & 0xff);
    this.push(this.PC & 0xff);
    this.PC = addr & 0xffff;
    this.cycles += 6;
  }
  //LDA
  LDA() {
    const addr = this.imm();
    const value = this.read(addr);
    this.A = value & 0xff;
    this.flags.Z = this.A === 0;
    this.flags.N = (this.A & 0x80) !== 0;
    this.cycles += 2;
  }
  //LDX
  LDX() {
    const addr = this.imm();
    const value = this.read(addr);
    this.X = value & 0xff;
    this.flags.Z = this.X === 0;
    this.flags.N = (this.X & 0x80) !== 0;
    this.cycles += 2;
  }
  //LDY
  LDY() {
    const addr = this.imm();
    const value = this.read(addr);
    this.Y = value & 0xff;
    this.flags.Z = this.Y === 0;
    this.flags.N = (this.Y & 0x80) !== 0;
    this.cycles += 2;
  }
  //LSR
  LSR() {
    const addr = this.imm();
    let value = this.read(addr);
    this.flags.C = (value & 0x01) !== 0;
    value = (value >> 1) & 0xff;
    this.flags.Z = value === 0;
    this.flags.N = (value & 0x80) !== 0;
    this.write(addr, value);
    this.cycles += 2;
  }

  //ORA
  ORA() {
    const addr = this.imm();
    const value = this.read(addr);
    this.A |= value;
    this.flags.Z = this.A === 0;
    this.flags.N = (this.A & 0x80) !== 0;
    this.cycles += 2;
  }
  //PHA
  PHA() {
    this.push(this.A);
    this.cycles += 3;
  }
  //PHP
  PHP() {
    let status = 0;
    if (this.flags.N) status |= 0x80;
    if (this.flags.V) status |= 0x40;
    if (this.flags.U) status |= 0x20;
    if (this.flags.B) status |= 0x10;
    if (this.flags.D) status |= 0x08;
    if (this.flags.I) status |= 0x04;
    if (this.flags.Z) status |= 0x02;
    if (this.flags.C) status |= 0x01;
    this.push(status);
    this.cycles += 3;
  }
  //PLA
  PLA() {
    this.A = this.pull();
    this.flags.Z = this.A === 0;
    this.flags.N = (this.A & 0x80) !== 0;
    this.cycles += 4;
  }
  //PLP
  PLP() {
    const status = this.pull();
    this.flags.N = (status & 0x80) !== 0;
    this.flags.V = (status & 0x40) !== 0;
    this.flags.U = (status & 0x20) !== 0;
    this.flags.B = (status & 0x10) !== 0;
    this.flags.D = (status & 0x08) !== 0;
    this.flags.I = (status & 0x04) !== 0;
    this.flags.Z = (status & 0x02) !== 0;
    this.flags.C = (status & 0x01) !== 0;
    this.cycles += 4;
  }
  //ROL
  ROL() {
    const addr = this.imm();
    let value = this.read(addr);
    const carry = this.flags.C ? 1 : 0;
    this.flags.C = (value & 0x80) !== 0;
    value = ((value << 1) | carry) & 0xff;
    this.flags.Z = value === 0;
    this.flags.N = (value & 0x80) !== 0;
    this.write(addr, value);
    this.cycles += 2;
  }
  //ROR
  ROR() {
    const addr = this.imm();
    let value = this.read(addr);
    const carry = this.flags.C ? 1 : 0;
    this.flags.C = (value & 0x01) !== 0;
    value = ((value >> 1) | (carry << 7)) & 0xff;
    this.flags.Z = value === 0;
    this.flags.N = (value & 0x80) !== 0;
    this.write(addr, value);
    this.cycles += 2;
  }
  //RTI
  RTI() {
    this.PC = (this.pull() | (this.pull() << 8)) & 0xffff;
    this.flags.N = (this.A & 0x80) !== 0;
    this.flags.V = (this.A & 0x40) !== 0;
    this.flags.U = (this.A & 0x20) !== 0;
    this.flags.B = (this.A & 0x10) !== 0;
    this.flags.D = (this.A & 0x08) !== 0;
    this.flags.I = (this.A & 0x04) !== 0;
    this.flags.Z = (this.A & 0x02) !== 0;
    this.flags.C = (this.A & 0x01) !== 0;
    this.cycles += 6;
  }
  //RTS
  RTS() {
    this.PC = (this.pull() | (this.pull() << 8)) & 0xffff;
    this.PC = (this.PC + 1) & 0xffff;
    this.cycles += 6;
  }

  //SBC
  SBC() {
    const addr = this.imm();
    const value = this.read(addr);
    const carry = this.flags.C ? 1 : 0;
    const result = this.A - value - (1 - carry);
    this.flags.C = result >= 0;
    this.flags.Z = (result & 0xff) === 0;
    this.flags.N = (result & 0x80) !== 0;
    this.flags.V = ((this.A ^ value) & 0x80) !== ((this.A ^ result) & 0x80);
    this.A = result & 0xff;
    this.cycles += 2;
  }

  //SEC
  SEC() {
    this.flags.C = true;
    this.cycles += 2;
  }
  //SED
  SED() {
    this.flags.D = true;
    this.cycles += 2;
  }
  //SEI
  SEI() {
    this.flags.I = true;
    this.cycles += 2;
  }

  //TAX
  TAX() {
    this.X = this.A;
    this.flags.Z = this.X === 0;
    this.flags.N = (this.X & 0x80) !== 0;
    this.cycles += 2;
  }
  //TAY
  TAY() {
    this.Y = this.A;
    this.flags.Z = this.Y === 0;
    this.flags.N = (this.Y & 0x80) !== 0;
    this.cycles += 2;
  }
  //TSX
  TSX() {
    this.X = this.SP;
    this.flags.Z = this.X === 0;
    this.flags.N = (this.X & 0x80) !== 0;
    this.cycles += 2;
  }
  //TXA
  TXA() {
    this.A = this.X;
    this.flags.Z = this.A === 0;
    this.flags.N = (this.A & 0x80) !== 0;
    this.cycles += 2;
  }

  //TXS
  TXS() {
    this.SP = this.X;
    this.cycles += 2;
  }
  //TYA
  TYA() {
    this.A = this.Y;
    this.flags.Z = this.A === 0;
    this.flags.N = (this.A & 0x80) !== 0;
    this.cycles += 2;
  }
  //NOP
  NOP() {
    this.cycles += 2;
  }
  //BRK
  BRK() {
    this.push((this.PC >> 8) & 0xff);
    this.push(this.PC & 0xff);
    let status = 0;
    if (this.flags.N) status |= 0x80;
    if (this.flags.V) status |= 0x40;
    if (this.flags.U) status |= 0x20;
    if (this.flags.B) status |= 0x10;
    if (this.flags.D) status |= 0x08;
    if (this.flags.I) status |= 0x04;
    if (this.flags.Z) status |= 0x02;
    if (this.flags.C) status |= 0x01;
    this.push(status);
    this.flags.B = true;
    this.PC = (this.memory.read(0xfffe) | (this.memory.read(0xffff) << 8)) & 0xffff;
    this.flags.I = true;
    this.cycles += 7;
  }

  // handle illegal opcodes
  illegal() {
    throw new Error(`Illegal opcode: ${this.IR.toString(16).toUpperCase()}`);
  }
}

export class Memory {
  data: Uint8Array;
  constructor(public size: number) {
    this.data = new Uint8Array(size);
  }

  read(address: number): number {
    if (address < 0 || address >= this.size) {
      throw new Error('Memory read out of bounds');
    }
    return this.data[address];
  }
  write(address: number, value: number): void {
    if (address < 0 || address >= this.size) {
      throw new Error('Memory write out of bounds');
    }
    if (value < 0 || value > 255) {
      throw new Error('Value must be between 0 and 255');
    }
    this.data[address] = value;
  }
  clear(): void {
    this.data.fill(0);
  }
  load(data: Uint8Array, startAddress: number = 0): void {
    if (startAddress < 0 || startAddress + data.length > this.size) {
      throw new Error('Data load out of bounds');
    }
    this.data.set(data, startAddress);
  }
}
