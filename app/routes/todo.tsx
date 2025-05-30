import { useState } from "react";
import "./todo.css";

export default function Todo() {
  const [list, setList] = useState<{ title: string; descrition: string }[]>([]);
  const [curr, setCurr] = useState<string>('');
  return (
    <div className="todo-container">
      <div className="todo-title">Todo List</div>
      <div className="todo-input-row">
        <input
          className="todo-input"
          type="text"
          placeholder="Enter a task..."
          value={curr}
          onChange={(e) => setCurr(e.target.value)}
        />
        <button
          className="todo-add-btn"
          onClick={() => {
            setList([...list, { title: '', descrition: curr }]);
            setCurr('');
          }}
          disabled={!curr}
        >
          Add
        </button>
      </div>
      <ul className="todo-list">
        {list.map((item, index) => (
          <li className="todo-item" key={index}>
            <div className="todo-desc">{item.descrition}</div>
            <button
              className="todo-remove-btn"
              onClick={() => setList((prev) => prev.filter((_, i) => i !== index))}
              title="Remove"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
      {list.length === 0 && <div className="todo-empty">No tasks yet. Add your first task!</div>}
    </div>
  );
}
