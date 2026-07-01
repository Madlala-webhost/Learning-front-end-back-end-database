import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
app.set("view engine", "ejs");
app.set("views")

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs", {letterCount: null }
  )
});

app.post("/submit", (req, res) => {
 const firstName = req.body.fName;
 const lastName = req.body.lName;
 const fullName = `${firstName}${lastName}`
 
 console.log (fullName);
 const letterCount = fullName.length;
 console.log(letterCount);
 res.render("index.ejs", {letterCount});
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
