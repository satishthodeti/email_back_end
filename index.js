require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const dbConnection = require("./db");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth")

//connection
dbConnection();

//middlewares
app.use(express.json());
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is connted on PORT: ${port}`));

