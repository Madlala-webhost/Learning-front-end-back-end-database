const fs = require("fs"); //Here we are importing the file system module which is a native module in Node.js. This module allows us to work with the file system on our computer, enabling us to read from and write to files.

fs.writeFile("message.txt","Hello, My name is Njabulo!",(err) =>{
    if (err) throw err;
    console.log ("The file has been saved!");
});

fs.readFile("./message.txt", "utf8",(err, data) =>{
    if(err) throw err;
    console.log(data);
});