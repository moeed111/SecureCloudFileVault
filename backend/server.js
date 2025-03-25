const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/file", require("./routes/file"));

const PORT = process.env.PORT || 5000;

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
