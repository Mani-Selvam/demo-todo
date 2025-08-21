import React, { useEffect, useState } from "react";

export default function App() {
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState("");
    const [email, setEmail] = useState("");
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(false); // dark mode state

    // READ
    useEffect(() => {
        setLoading(true);
        fetch(`${process.env.REACT_APP_API_URL || ""}/api/todos`)
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) setTodos(data);
                else setTodos([]);
                setLoading(false);
            })
            .catch(() => {
                setTodos([]);
                setLoading(false);
            });
    }, []);

    // CREATE
    async function addTodo(e) {
        e.preventDefault();
        if (!text || !email) return;
        const res = await fetch(
            `${process.env.REACT_APP_API_URL || ""}/api/todos`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, email }),
            }
        );
        if (!res.ok) return alert("Add failed");
        const newTodo = await res.json();
        setTodos([newTodo, ...todos]);
        setText("");
        setEmail("");
    }

    // START EDIT
    function startEdit(todo) {
        setEditId(todo._id);
        setText(todo.text);
        setEmail(todo.email);
    }

    // UPDATE
    async function updateTodo(e) {
        e.preventDefault();
        const res = await fetch(
            `${process.env.REACT_APP_API_URL || ""}/api/todos/${editId}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, email }),
            }
        );
        if (!res.ok) return alert("Update failed");
        const updated = await res.json();
        setTodos(todos.map((t) => (t._id === editId ? updated : t)));
        setEditId(null);
        setText("");
        setEmail("");
    }

    // DELETE
    async function deleteTodo(id) {
        if (!window.confirm("Delete this todo?")) return;
        const res = await fetch(
            `${process.env.REACT_APP_API_URL || ""}/api/todos/${id}`,
            { method: "DELETE" }
        );
        if (!res.ok) return alert("Delete failed");
        setTodos(todos.filter((t) => t._id !== id));
    }

    return (
        <div
            style={{
                ...styles.container,
                background: darkMode ? "#121212" : "#f0f2f5",
                color: darkMode ? "#fff" : "#000",
            }}>
            <div style={styles.topBar}>
                <h1 style={styles.title}>✅ Todo App</h1>
                <button
                    style={{
                        ...styles.toggleBtn,
                        background: darkMode ? "#fff" : "#333",
                        color: darkMode ? "#333" : "#fff",
                    }}
                    onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? "Light Mode" : "Dark Mode"}
                </button>
            </div>

            <form onSubmit={editId ? updateTodo : addTodo} style={styles.form}>
                <input
                    style={{
                        ...styles.input,
                        background: darkMode ? "#1e1e1e" : "#fff",
                        color: darkMode ? "#fff" : "#000",
                        border: darkMode ? "1px solid #444" : "1px solid #ddd",
                    }}
                    placeholder="Enter task"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <input
                    style={{
                        ...styles.input,
                        background: darkMode ? "#1e1e1e" : "#fff",
                        color: darkMode ? "#fff" : "#000",
                        border: darkMode ? "1px solid #444" : "1px solid #ddd",
                    }}
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button
                    style={{
                        ...styles.primaryBtn,
                        background: darkMode ? "#bb86fc" : "#1976d2",
                    }}
                    type="submit">
                    {editId ? "Update" : "Add"}
                </button>
                {editId && (
                    <button
                        type="button"
                        style={styles.secondaryBtn}
                        onClick={() => {
                            setEditId(null);
                            setText("");
                            setEmail("");
                        }}>
                        Cancel
                    </button>
                )}
            </form>

            {loading ? (
                <div style={styles.loading}>Loading todos...</div>
            ) : (
                <ul style={styles.list}>
                    {todos.map((t) => (
                        <li
                            key={t._id}
                            style={{
                                ...styles.item,
                                background: darkMode ? "#1e1e1e" : "#fff",
                                border: darkMode
                                    ? "1px solid #333"
                                    : "1px solid #eee",
                                color: darkMode ? "#fff" : "#000",
                            }}
                            className="fade">
                            <div>
                                <div style={styles.itemText}>{t.text}</div>
                                <div style={styles.itemSub}>{t.email}</div>
                            </div>
                            <div style={styles.actions}>
                                <button
                                    style={{
                                        ...styles.smallBtn,
                                        background: darkMode
                                            ? "#03dac6"
                                            : "#4caf50",
                                    }}
                                    onClick={() => startEdit(t)}>
                                    ✔️
                                </button>
                                <button
                                    style={{
                                        ...styles.dangerBtn,
                                        background: darkMode
                                            ? "#cf6679"
                                            : "#f44336",
                                    }}
                                    onClick={() => deleteTodo(t._id)}>
                                    ❌
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

// ---------- Styles ----------
const styles = {
    container: {
        maxWidth: 600,
        margin: "40px auto",
        padding: "0 20px",
        fontFamily: "Inter, sans-serif",
        minHeight: "100vh",
    },
    topBar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        flexWrap: "wrap",
    },
    toggleBtn: {
        padding: "8px 16px",
        borderRadius: 8,
        border: "none",
        cursor: "pointer",
        fontWeight: 600,
        transition: "all 0.3s ease",
    },
    title: { textAlign: "center", marginBottom: 20 },
    form: {
        display: "flex",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 20,
        justifyContent: "center",
    },
    input: {
        flex: 1,
        minWidth: 140,
        padding: "12px 16px",
        borderRadius: 8,
        fontSize: 15,
    },
    primaryBtn: {
        padding: "12px 18px",
        color: "#fff",
        border: 0,
        borderRadius: 8,
        cursor: "pointer",
        transition: "all 0.3s ease",
    },
    secondaryBtn: {
        padding: "12px 18px",
        background: "#888",
        color: "#fff",
        border: 0,
        borderRadius: 8,
        cursor: "pointer",
        transition: "all 0.3s ease",
    },
    list: { listStyle: "none", padding: 0, margin: 0 },
    item: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        padding: "16px 20px",
        borderRadius: 14,
        marginBottom: 16,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        transition: "all 0.3s ease",
        cursor: "pointer",
    },
    itemText: {
        fontWeight: 600,
        fontSize: 16,
        marginBottom: 4,
        wordBreak: "break-word",
    },
    itemSub: {
        color: "#666",
        fontSize: 13,
        wordBreak: "break-word",
    },
    actions: {
        display: "flex",
        gap: 10,
        marginTop: 8,
        flexWrap: "wrap",
    },
    smallBtn: {
        padding: "6px 12px",
        color: "#fff",
        border: 0,
        borderRadius: 8,
        cursor: "pointer",
        transition: "all 0.2s ease",
        fontSize: 14,
    },
    dangerBtn: {
        padding: "6px 12px",
        color: "#fff",
        border: 0,
        borderRadius: 8,
        cursor: "pointer",
        transition: "all 0.2s ease",
        fontSize: 14,
    },
    loading: {
        textAlign: "center",
        fontSize: 16,
        marginTop: 40,
    },
};
