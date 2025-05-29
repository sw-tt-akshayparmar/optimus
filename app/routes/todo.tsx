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
        setList([...list, {title:'', descrition: curr}]);
        setCurr('');
      }}
      disabled={!curr}
      >Add</button>
      <ul>
        {list.map((item, index) => {
          return (
            <li key={index}>
              <div>{item.title}</div>
              <div>{item.descrition}</div>
              <button onClick={()=>{
                setList((prev)=>prev.filter((_,i)=>i!==index))
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
