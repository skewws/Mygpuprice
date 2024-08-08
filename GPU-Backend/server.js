const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const fileContentRoutes = require("./routes/fileContent");
const commentRoutes = require("./routes/comment");
const sellerRoutes = require("./routes/sellers");
const fileRoutes = require("./routes/files");

dotenv.config();

const app = express();

connectDB();
app.use(express.json());
app.use(cors());

app.use("/", authRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/", fileRoutes);
app.use("/fileContent", fileContentRoutes);
app.use("/comment", commentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
