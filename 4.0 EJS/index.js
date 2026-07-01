import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");


app.get("/", (req, res) => {
    console.log(__dirname + "/views/index.ejs");
    const date = new Date ();
    const day = date.getDay();
    let mood = "";   
    console.log (day);
if (day === 0 || day === 6){
    mood = " Weekend, it's time to have fun!"
}else {
    mood = " Weekday, it's time to work hard!"
}
res.render("index.ejs", 
{ mood });
});

app.listen(port, () => {
    console.log(`Listening in port ${port}.`)
});
