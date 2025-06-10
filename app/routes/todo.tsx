import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./todo.css";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  pinned: boolean;
  archived: boolean;
  tags: string[];
  category: string;
  subtasks: Todo[];
};

type Project = {
  id: string;
  name: string;
  todos: Todo[];
};

function createTodo(title = ""): Todo {
  return {
    id: Math.random().toString(36).slice(2),
    title,
    completed: false,
    pinned: false,
    archived: false,
    tags: [],
    category: "",
    subtasks: [],
  };
}

function createProject(name = "Default List"): Project {
  return {
    id: Math.random().toString(36).slice(2),
    name,
    todos: [],
  };
}

function InputPopup({
  open,
  title,
  placeholder,
  onSubmit,
  onClose,
}: {
  open: boolean;
  title: string;
  placeholder?: string;
  onSubmit: (val: string) => void;
  onClose: () => void;
}) {
  const [val, setVal] = useState("");
  if (!open) return null;
  return (
    <div className="popup-backdrop">
      <div className="popup-box">
        <div className="popup-title">{title}</div>
        <input
          className="popup-input"
          autoFocus
          placeholder={placeholder}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && val.trim()) {
              onSubmit(val.trim());
              setVal("");
            }
            if (e.key === "Escape") onClose();
          }}
        />
        <div className="popup-actions">
          <button
            className="popup-btn"
            onClick={() => {
              if (val.trim()) {
                onSubmit(val.trim());
                setVal("");
              }
            }}
            disabled={!val.trim()}
          >
            OK
          </button>
          <button className="popup-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Todo() {
  const [projects, setProjects] = useState<Project[]>([createProject("Personal")]);
  const [activeProject, setActiveProject] = useState(projects[0].id);
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showArchived, setShowArchived] = useState(false);
  const [popup, setPopup] = useState<null | { type: "list" | "task" | "subtask"; todoId?: string }>(null);

  // Helper to get current project
  const project = projects.find((p) => p.id === activeProject) || projects[0];

  // Add project/list
  function addProject(name: string) {
    const newProj = createProject(name);
    setProjects((prev) => [...prev, newProj]);
    setActiveProject(newProj.id);
  }

  // Add todo
  function addTodo(title: string) {
    if (!title.trim()) return;
    const newTodo = createTodo(title.trim());
    setProjects((prev) =>
      prev.map((p) =>
        p.id === project.id ? { ...p, todos: [newTodo, ...p.todos] } : p
      )
    );
  }

  // Edit todo
  function editTodo(todoId: string, newTitle: string) {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === project.id
          ? {
              ...p,
              todos: p.todos.map((t) =>
                t.id === todoId ? { ...t, title: newTitle } : t
              ),
            }
          : p
      )
    );
  }

  // Delete todo
  function deleteTodo(todoId: string) {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === project.id
          ? { ...p, todos: p.todos.filter((t) => t.id !== todoId) }
          : p
      )
    );
    setSelected((prev) => {
      const copy = new Set(prev);
      copy.delete(todoId);
      return copy;
    });
  }

  // Toggle complete
  function toggleComplete(todoId: string) {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === project.id
          ? {
              ...p,
              todos: p.todos.map((t) =>
                t.id === todoId ? { ...t, completed: !t.completed } : t
              ),
            }
          : p
      )
    );
  }

  // Pin/star
  function togglePin(todoId: string) {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === project.id
          ? {
              ...p,
              todos: p.todos.map((t) =>
                t.id === todoId ? { ...t, pinned: !t.pinned } : t
              ),
            }
          : p
      )
    );
  }

  // Archive
  function archiveTodo(todoId: string) {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === project.id
          ? {
              ...p,
              todos: p.todos.map((t) =>
                t.id === todoId ? { ...t, archived: true } : t
              ),
            }
          : p
      )
    );
    setSelected((prev) => {
      const copy = new Set(prev);
      copy.delete(todoId);
      return copy;
    });
  }

  // Bulk actions
  function bulkAction(action: "complete" | "delete" | "archive") {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === project.id
          ? {
              ...p,
              todos: p.todos.map((t) =>
                selected.has(t.id)
                  ? action === "complete"
                    ? { ...t, completed: true }
                    : action === "archive"
                    ? { ...t, archived: true }
                    : t
                  : t
              ).filter((t) => (action === "delete" ? !selected.has(t.id) : true)),
            }
          : p
      )
    );
    setSelected(new Set());
  }

  // Drag & drop reorder
  function onDragEnd(result: any) {
    if (!result.destination) return;
    const items = Array.from(project.todos);
    const [removed] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, removed);
    setProjects((prev) =>
      prev.map((p) =>
        p.id === project.id ? { ...p, todos: items } : p
      )
    );
  }

  function setCategory(id: string, value: string): void {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === project.id
          ? {
              ...p,
              todos: p.todos.map((t) =>
                t.id === id ? { ...t, category: value } : t
              ),
            }
          : p
      )
    );
  }

  function addSubtask(todoId: string, val: string) {
    if (!val.trim()) return;
    setProjects((prev) =>
      prev.map((p) =>
        p.id === project.id
          ? {
              ...p,
              todos: p.todos.map((t) =>
                t.id === todoId
                  ? {
                      ...t,
                      subtasks: [
                        ...t.subtasks,
                        createTodo(val.trim()),
                      ],
                    }
                  : t
              ),
            }
          : p
      )
    );
  }

  // UI
  return (
    <div className="todo-container" style={{ maxWidth: 700 }}>
      <InputPopup
        open={!!popup}
        title={
          popup?.type === "list"
            ? "New List"
            : popup?.type === "task"
            ? "New Task"
            : "New Subtask"
        }
        placeholder={
          popup?.type === "list"
            ? "List name"
            : popup?.type === "task"
            ? "Task title"
            : "Subtask title"
        }
        onSubmit={(val) => {
          if (popup?.type === "list") addProject(val);
          if (popup?.type === "task") addTodo(val);
          if (popup?.type === "subtask" && popup.todoId) addSubtask(popup.todoId, val);
          setPopup(null);
        }}
        onClose={() => setPopup(null)}
      />
      <div className="todo-title">Swiss Army Todo App</div>
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <select
          value={activeProject}
          onChange={(e) => setActiveProject(e.target.value)}
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <button className="todo-add-btn" onClick={() => setPopup({ type: "list" })}>
          + New List
        </button>
        <button
          className="todo-add-btn"
          onClick={() => setShowArchived((v) => !v)}
        >
          {showArchived ? "Show Active" : "Show Archived"}
        </button>
      </div>
      <div className="todo-input-row">
        <input
          className="todo-input"
          type="text"
          placeholder="Enter a task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && setPopup({ type: "task" })}
        />
        <button className="todo-add-btn" onClick={() => setPopup({ type: "task" })} disabled={!input}>
          Add
        </button>
      </div>
      {selected.size > 0 && (
        <div style={{ marginBottom: 12 }}>
          <button onClick={() => bulkAction("complete")}>Complete Selected</button>
          <button onClick={() => bulkAction("archive")}>Archive Selected</button>
          <button onClick={() => bulkAction("delete")}>Delete Selected</button>
        </div>
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="todo-list">
          {(provided:any) => (
            <ul
              className="todo-list"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {project.todos
                .filter((t) => showArchived ? t.archived : !t.archived)
                .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
                .map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={item.id}
                    index={index}
                  >
                    {(provided:any) => (
                      <li
                        className="todo-item"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          background: item.pinned
                            ? "#fefcbf"
                            : item.completed
                            ? "#e0e7ef"
                            : "#f8fafc",
                          borderLeft: item.archived
                            ? "4px solid #64748b"
                            : item.pinned
                            ? "4px solid #facc15"
                            : item.completed
                            ? "4px solid #38a169"
                            : "4px solid #2563eb",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selected.has(item.id)}
                          onChange={() => {
                            setSelected((prev) => {
                              const copy = new Set(prev);
                              if (copy.has(item.id)) copy.delete(item.id);
                              else copy.add(item.id);
                              return copy;
                            });
                          }}
                          style={{ marginRight: 8 }}
                        />
                        <input
                          style={{
                            border: "none",
                            background: "transparent",
                            fontWeight: item.pinned ? 700 : 400,
                            textDecoration: item.completed ? "line-through" : "",
                            fontSize: "1.08rem",
                            flex: 1,
                          }}
                          value={item.title}
                          onChange={(e) =>
                            editTodo(item.id, e.target.value)
                          }
                        />
                        <button
                          title={item.pinned ? "Unpin" : "Pin"}
                          onClick={() => togglePin(item.id)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "1.2rem",
                            color: item.pinned ? "#facc15" : "#a0aec0",
                          }}
                        >
                          ★
                        </button>
                        <button
                          title="Complete"
                          onClick={() => toggleComplete(item.id)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "1.2rem",
                            color: item.completed ? "#38a169" : "#a0aec0",
                          }}
                        >
                          ✔
                        </button>
                        <button
                          title="Archive"
                          onClick={() => archiveTodo(item.id)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "1.2rem",
                            color: "#64748b",
                          }}
                        >
                          🗄
                        </button>
                        <button
                          title="Delete"
                          onClick={() => deleteTodo(item.id)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "1.2rem",
                            color: "#ef4444",
                          }}
                        >
                          ✕
                        </button>
                        {/* Tags */}
                        <div style={{ marginLeft: 8 }}>
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              style={{
                                background: "#e0e7ef",
                                color: "#2563eb",
                                borderRadius: 4,
                                padding: "2px 6px",
                                fontSize: "0.85em",
                                marginRight: 2,
                              }}
                            >
                              #{tag}
                            </span>
                          ))}
                          <button
                            style={{
                              background: "none",
                              border: "none",
                              color: "#2563eb",
                              fontSize: "1em",
                              cursor: "pointer",
                              marginLeft: 2,
                            }}
                            title="Add tag"
                            onClick={() => {
                              setPopup({ type: "task" }); // You can add a custom tag popup if desired
                            }}
                          >
                            ＋
                          </button>
                        </div>
                        {/* Category */}
                        <select
                          value={item.category}
                          onChange={(e) =>
                            setCategory(item.id, e.target.value)
                          }
                          style={{
                            marginLeft: 8,
                            fontSize: "0.95em",
                            borderRadius: 4,
                            border: "1px solid #cbd5e1",
                          }}
                        >
                          <option value="">No Category</option>
                          <option value="work">Work</option>
                          <option value="personal">Personal</option>
                          <option value="urgent">Urgent</option>
                        </select>
                        {/* Subtasks */}
                        <div style={{ marginTop: 8, width: "100%" }}>
                          <strong style={{ fontSize: "0.95em" }}>Subtasks:</strong>
                          <ul style={{ paddingLeft: 18 }}>
                            {item.subtasks.map((sub) => (
                              <li key={sub.id} style={{ fontSize: "0.95em" }}>
                                <input
                                  type="checkbox"
                                  checked={sub.completed}
                                  onChange={() =>
                                    toggleComplete(sub.id)
                                  }
                                  style={{ marginRight: 4 }}
                                />
                                {sub.title}
                              </li>
                            ))}
                          </ul>
                          <button
                            style={{
                              background: "none",
                              border: "none",
                              color: "#2563eb",
                              fontSize: "0.95em",
                              cursor: "pointer",
                            }}
                            onClick={() => setPopup({ type: "subtask", todoId: item.id })}
                          >
                            + Add Subtask
                          </button>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      {project.todos.filter((t) => showArchived ? t.archived : !t.archived).length === 0 && (
        <div className="todo-empty">No tasks yet. Add your first task!</div>
      )}
    </div>
  );
}
