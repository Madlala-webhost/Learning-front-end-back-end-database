/* 
1. Use the inquirer npm package to get user input.*/
import {input} from "@inquirer/prompts";
import qr from "qr-image";
import fs from "fs";
const answer = await input({message:`Please enter URL`});
console.log("URL captured");

/*2. Use the qr-image npm package to turn the user entered URL into a QR code image.*/
const qr_svg = qr.image(answer,{type:'svg'});
qr_svg.pipe(fs.createWriteStream('qr_code.svg'));
const svg_string = qr.imageSync(answer,{type:'svg'});


/*3. Create a txt file to save the user input using the native fs node module.
*/

fs.writeFile("URL1.text",answer,(err) =>{
    if (err) throw err;
    console.log ("The URL has been saved!");
});