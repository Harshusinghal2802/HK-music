const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const dns = require("dns");

dotenv.config();

// ✅ DNS FIRST
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = require("./config/db");

// ✅ THEN CONNECT DB
connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/songs", require("./routes/songRoutes"));
app.use("/api/playlists", require("./routes/playlistRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

app.get("/", (req, res) => {
  res.send("HK Music API is running...");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});

const PORT = process.env.PORT || 5000
;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
