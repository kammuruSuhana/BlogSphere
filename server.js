const express = require("express");

const cors = require("cors");

const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

const authRoutes =
require("./routes/authRoutes");

const postRoutes =
require("./routes/postRoutes");

const commentRoutes =
require("./routes/commentRoutes");

app.use("/api/auth", authRoutes);

app.use("/api/posts", postRoutes);

app.use("/api/comments", commentRoutes);

const PORT = 5000;

app.listen(PORT,()=>{

    console.log(
        `Server Running on Port ${PORT}`
    );

});