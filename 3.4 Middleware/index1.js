import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
const __dirname = dirname(fileURLToPath(import.meta.url)); // Get the directory name of the current module

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended:true}));
//serve HTML form//
app.get("/", (req, res) => {
  console.log(__dirname + "/public/index.html"); // Log the path to the HTML file
  //send the html file//
  res.sendFile(__dirname + "/public/index.html");
});
//Handle form submission//
app.post("/submit", (req, res) => {
  //log the details//
  console.log(req.body);
  //send a response//
  res.send("Form recieved!");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
