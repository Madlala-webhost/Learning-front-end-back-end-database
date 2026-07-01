//To see how the final website should work, run "node solution.js".
import express from "express";
import { dirname} from "path";
import {fileURLToPath} from "url";
import bodyParser from "body-parser";
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
const password = "ILoveProgramming";

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", (req, res) => {
    console.log(__dirname + "/public/index.html");
    res.sendFile(__dirname + "/public/index.html");
});

app.post("/check", (req, res) =>{
    console.log(req.body);
    const inputPassword = req.body.password;
    if(inputPassword === password) {
    console.log(__dirname + "/public/secret.html");
     res.sendFile(__dirname + "/public/secret.html");
}else{
    console.log(__dirname + "/public/index.html");
    res.sendFile(__dirname + "/public/index.html");
};
});




app.listen(port, () =>{
    console.log(`Listening from port ${port}.`);
});
//Make sure you have installed all the dependencies with "npm i".
//The password is ILoveProgramming
