const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const commentRoutes = require("./routes/commentRoutes");

const app = express();
const PORT = 5030;

connectDB();

app.use(cors());
app.use(bodyParser.json());

app.use("/comments", commentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
