const express = require("express");
const path = require("path");
const api = require("./routes/index");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));
app.use("/api", api);

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
