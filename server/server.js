const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Todo = require("./models/Todo");

const app = express();
app.use(cors());
app.use(express.json());

// Local MongoDB (change DB name if you want)
mongoose
    .connect("mongodb://127.0.0.1:27017/todoDB")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB error", err));

// GET all
app.get("/api/todos", async (req, res) => {
    try {
        const todos = await Todo.find().sort({ createdAt: -1 });
        res.json(todos);
    } catch (e) {
        res.status(500).json({ error: "Server error" });
    }
});

// POST create
app.post("/api/todos", async (req, res) => {
    const { text, email } = req.body;
    if (!text || !email)
        return res.status(400).json({ error: "text and email required" });
    try {
        const todo = await Todo.create({ text, email });
        res.status(201).json(todo);
    } catch (e) {
        res.status(500).json({ error: "Server error" });
    }
});

// PUT update
app.put("/api/todos/:id", async (req, res) => {
    const { text, email } = req.body;
    try {
        const todo = await Todo.findByIdAndUpdate(
            req.params.id,
            { text, email },
            { new: true }
        );
        if (!todo) return res.status(404).json({ error: "Todo not found" });
        res.json(todo);
    } catch (e) {
        res.status(500).json({ error: "Server error" });
    }
});

// DELETE
app.delete("/api/todos/:id", async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if (!todo) return res.status(404).json({ error: "Todo not found" });
        res.json({ message: "Deleted", deletedId: req.params.id });
    } catch (e) {
        res.status(500).json({ error: "Server error" });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
