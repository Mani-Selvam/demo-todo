// Load environment variables first
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const Todo = require("./models/Todo");

const app = express();

// Middleware
app.use(express.json());
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "*",
    })
);

// Connect to MongoDB with error handling
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    });

// =======================
// API ROUTES
// =======================
app.get("/health", (req, res) => {
    res.json({ status: "ok", time: new Date() });
});

// GET all todos
app.get("/api/todos", async (req, res) => {
    try {
        const todos = await Todo.find().sort({ createdAt: -1 });
        res.json(todos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// POST create todo
app.post("/api/todos", async (req, res) => {
    const { text, email } = req.body;
    if (!text || !email) {
        return res.status(400).json({ error: "text and email required" });
    }

    try {
        const todo = await Todo.create({ text, email });
        res.status(201).json(todo);
    } catch (err) {
        console.error(err);
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
        if (!todo) {
            return res.status(404).json({ error: "Todo not found" });
        }
        res.json(todo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// DELETE todo
app.delete("/api/todos/:id", async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if (!todo) {
            return res.status(404).json({ error: "Todo not found" });
        }
        res.json({ message: "Deleted", deletedId: req.params.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Serve React in production
if (process.env.NODE_ENV === "production") {
    // Serve static files from React build
    app.use(express.static(path.join(__dirname, "../client/build")));

    // Catch-all route to serve index.html
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../client/build/index.html"));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
