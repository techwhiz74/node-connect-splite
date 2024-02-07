const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const app = express();
const PORT = 3000;
const formidable = require("formidable");
const fs = require("fs");

// Connect to the existing SQLite database
const db = new sqlite3.Database("aa.sqlite3");

app.use(bodyParser.json());

app.use(cors());

app.post("/save", (req, res) => {
  const form = new formidable.IncomingForm();
  
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).send("Error parsing form data");
    } else {

      const file = files.file;
      const comment = fields['comment'][0];

      var value = "";

      fs.readFile(file[0].filepath, (err, data) => {
        if (err) {
          return res.status(500).send("Error reading file");
        }

        value = Buffer.from(data).toString("base64");

        const insertQuery = db.prepare("INSERT INTO url (value, comment) VALUES (?, ?)");

        insertQuery.run(value, comment);

        insertQuery.finalize(function(err) {
          if (err) {
            return res.status(500).json({ error: "Error saving strings to the database." });
          }
          
          return res.status(200).json({ message: "Strings saved successfully." });
        });
      });
    }
  });
});

app.get("/get", (req, res) => {
  const query = "SELECT * FROM url";
  db.all(query, (err, rows) => {
    if (err) {
      console.error(err.message);
      return;
    }

    // Process the fetched data
    rows.forEach((row) => {
      // console.log(row); // You can access each row object here
    });

    res.json({ data: rows });
  });
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});