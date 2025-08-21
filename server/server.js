const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Todo = require("./models/Todo");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());

// Allow local dev + production frontend
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
    })
);

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB error:", err));

// =======================
// API ROUTES
// =======================

// GET all todos
app.get("/api/todos", async (req, res) => {
    try {
        const todos = await Todo.find().sort({ createdAt: -1 });
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// POST create todo
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

// PUT update todo
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

// DELETE todo
app.delete("/api/todos/:id", async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if (!todo) return res.status(404).json({ error: "Todo not found" });
        res.json({ message: "Deleted", deletedId: req.params.id });
    } catch (e) {
        res.status(500).json({ error: "Server error" });
    }
});

// =======================
// SERVE FRONTEND (production)
// =======================

// =======================
// START SERVER
// =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
