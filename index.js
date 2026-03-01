const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

// view engine
app.set("view engine", "ejs");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ensure files folder exists
const filesDir = path.join(__dirname, "files");
if (!fs.existsSync(filesDir)) {
  fs.mkdirSync(filesDir);
}

// routes
app.get("/", (req, res) => {
  fs.readdir(filesDir, (err, files) => {
    res.render("index", { files: files || [] });
  });
});

app.get("/edit/:filename", function (req, res) {
  res.render("edit", { filename: req.params.filename });
});

app.post("/edit", function (req, res) {
  fs.rename(
    `./files/${req.body.previeus}`,
    `./files/${req.body.new}`,
    function (err) {
      console.log(req.body.Previeus);
      console.log(req.body.newname);
      res.redirect("/");
    }
  );
});

app.get("/file/:filename", function (req, res) {
  fs.readFile(
    `./files/${req.params.filename}`,
    "utf-8",
    function (err, filedata) {
      console.log(filedata);
      res.render("show", {
        filename: req.params.filename,
        filedata: filedata,
      });
    }
  );
});

app.post("/create", (req, res) => {
  const title = req.body.title?.trim();
  const details = req.body.details;

  if (!title || !details) {
    return res.send("Title and details are required");
  }

  fs.writeFile(`${filesDir}/${title}.txt`, details, (err) => {
    if (err) {
      console.error(err);
      return res.send("Error creating file");
    }
    res.redirect("/");
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
