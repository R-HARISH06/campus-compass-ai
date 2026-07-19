const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, ".env") });

const db = require("./config/db");
const eventRoutes = require("./routes/eventroutes");
const app = express();
const clubRoutes = require("./routes/clubsRoutes");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const timetableRoutes = require("./routes/timetableRoutes");
const cafeRoutes = require("./routes/cafeRoutes");

// Allow all origins for the hackathon deployment to prevent Vercel CORS blocking
app.use(cors());
app.use(express.json({ limit: "100kb" }));
app.use("/api/events",        eventRoutes);
app.use("/api/clubs",         clubRoutes);
app.use("/api/auth",          authRoutes);
app.use("/api/ai",            aiRoutes);
app.use("/api/admin",         require("./routes/adminRoutes"));
app.use("/api/faculty",       facultyRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/timetable",     timetableRoutes);
app.use("/api/cafe",          cafeRoutes);

app.get("/api/setup-db", async (req, res) => {
    try {
        const fs = require('fs');
        const path = require('path');
        const sql = fs.readFileSync(path.join(__dirname, 'config', 'railway_schema.sql'), 'utf8');
        // Simple split for basic queries
        const queries = sql.split(';').map(q => q.trim()).filter(Boolean);
        for (let q of queries) {
            await db.query(q);
        }
        res.send("Database Tables and Seed Data Created Successfully!");
    } catch (err) {
        console.error(err);
        res.status(500).send("SQL Error: " + err.message);
    }
});

app.get("/api/health", async (req, res) => {
    try {
        await db.query("SELECT 1 AS ok");
        res.status(200).json({
            status: "ok",
            database: "connected",
            authentication: process.env.JWT_SECRET ? "configured" : "missing"
        });
    } catch (error) {
        console.error("Health check database error:", error.message);
        res.status(503).json({
            status: "degraded",
            database: "unavailable",
            authentication: process.env.JWT_SECRET ? "configured" : "missing"
        });
    }
});

app.get("/", (req, res) => {
    res.send("Campus Compass AI Backend is Running!");
});

app.use((req, res) => {
    res.status(404).json({ message: "Route not found." });
});

app.use((error, req, res, next) => {
    console.error("Unhandled server error:", error);
    res.status(error.status || 500).json({ message: "Unexpected server error." });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});