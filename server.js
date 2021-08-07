const express = require("express");
const path = require("path");
const uuid = require("./helpers/uuid");
const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// app.get("/", (req, res) => res.send("Homepage"));
app.get("/api/notes", (req, res) => {
  // const notes = require("./db/db.json");
  // res.status(200).json(notes);
  readFile("./db/db.json")
    .then((data) => {
      const dbNotes = JSON.parse(data);
      res.status(200).json(dbNotes);
    })
    .catch((err) => console.error(err));
  console.info(`${req.method} request received to get all notes`);
});

app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to add a task`);
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title,
      text,
      noteID: uuid(),
    };

    readFile("./db/db.json")
      .then((data) => {
        const dbNotes = JSON.parse(data);
        dbNotes.push(newNote);
        return dbNotes;
      })
      .then((dbNotes) => {
        writeFile("./db/db.json", JSON.stringify(dbNotes, 0, 4));
      })
      .catch((err) => console.error(err));
    const response = {
      status: "success",
      body: newNote,
    };
    res.status(200).json(response);
  } else {
    res.status(404).send("Please supply both title and text!");
  }
});

// app.get("/api/notes/:taskID");

app.delete("/api/notes/:id", (req, res) => {
  console.info(`${req.method} request received to delete a note.`);
  const { id } = req.params;
  if (id) {
    readFile("./db/db.json")
      .then((data) => {
        const dbNotes = JSON.parse(data);
        const newDbNotes = dbNotes.filter((note) => {
          return note.noteID !== id;
        });
        return newDbNotes;
      })
      .then((newDbNotes) => {
        writeFile("./db/db.json", JSON.stringify(newDbNotes, 0, 4));
      })
      .catch((err) => console.error(err));
    const response = {
      status: "success",
    };
    res.status(200).json(response);
  } else {
    res.status(404).send(`The ID of ${id} is not found!`);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
