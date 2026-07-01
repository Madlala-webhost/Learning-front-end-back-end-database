import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended:true}));
//serve HTML form//
app.get("/", (req, res) => {
  console.log(__dirname + "/public/index.html");
  //send the html file//
  res.sendFile(__dirname + "/public/index.html");
});
//Handle form submission//
app.post("/submit", (req, res) => {
  //log the details//
  console.log(req.body);
  //send a response//
  const bandName = req.body.street + req.body.pet;
  res.send(`<h1>Your band name is ${bandName}.</h1>`);
});



app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
