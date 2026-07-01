import express from "express";
const app = express();
const port = 3500;

app.get("/", (req, res) => {
    res.send("<h1>Hello, World</h1>");
})
app.get("/contact", (req, res) => {
    res.send("<h1>call me on-072 457 4450</h1>");
})

app.get("/about", (req, res) => {
    res.send("<h1>I am learning how to code</h1><p>My name is Njabulo Madlala and I am excited to know back-end</p>");
})

app.listen(3500, () => {
    console.log(`Server running on port ${port}.`);
})