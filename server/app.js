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

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        const error = new Error("Origin is not allowed by CORS");
        error.status = 403;
        return callback(error);
    }
}));
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