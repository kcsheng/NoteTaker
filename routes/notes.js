const uuid = require("../helpers/uuid");
const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const express = require("express");
const notes = express.Router();

notes.get("/", (req, res) => {
  readFile("./db/db.json")
    .then((data) => {
      const dbNotes = JSON.parse(data);
      res.status(200).json(dbNotes);
    })
    .catch((err) => console.error(err));
  console.info(`${req.method} request received to get all notes`);
});

notes.post("/", (req, res) => {
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

notes.delete("/:id", (req, res) => {
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

module.exports = notes;
