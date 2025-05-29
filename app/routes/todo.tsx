import { useState } from "react";

export default function Todo() {
  const [list, setList] = useState<{ title: string; descrition: string }[]>([]);
  const [curr, setCurr] = useState<string>('');
  return (
    <div>
      <div className="title">Todo List</div>
      <input type="text" value={curr} onChange={(e)=>{
        setCurr(e.target.value)
      }}/>
      <button onClick={()=>{
        list.push({title:'', descrition: curr});
        setList([...list]);
        setCurr('');
      }}>Add</button>
      <ul>
        {list.map((item, index) => {
          return (
            <li key={index}>
              <div>{item.title}</div>
              <div>{item.descrition}</div>
              <button onClick={()=>{
                list.splice(index, 1);
                setList([...list])
              }} >
                Remove
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
