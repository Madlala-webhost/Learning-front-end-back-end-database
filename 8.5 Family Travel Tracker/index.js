import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";

process.on("uncaughtException", (err) => console.error("UNCAUGHT EX:", err));
process.on("unhandledRejection", (err) => console.error("UNHANDLED REJ:", err));


const app = express();
app.set("view engine", "ejs")
const port = 3000;
env.config({ override: true });


const db = new pg.Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: Number(process.env.PORT),
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = []
let users = []
//get current user
//new user
app.post("/user", async (req, res) => {
if (req.body.add === "new") {
  res.render ("new.ejs")

} else{
    currentUserId = req.body.user;
  console.log("selected user:", currentUserId);
//const usersTable = await db.query("SELECT * FROM users");
//const users = usersTable.rows;

const result1 = await db.query("SELECT country_code FROM visited_countries WHERE user_id=$1",[currentUserId])
const codes = result1.rows.map(row => row.country_code); //pass on an array that is a string and not an object
console.log("These are the codes:", codes)
const result2 = await db.query("SELECT color FROM users WHERE id=$1",[currentUserId]);
const color = result2.rows[0].color; //extract color from table
console.log("This is the color:", color);
const totalCountries = codes.length;
res.render("index.ejs", {
users:users,
color: color,
countries: codes,
total:totalCountries,
error: "user error",
}
)
}

})
//new country and save into visited countries
app.post("/add", async (req, res) => {
  const countrySelected = req.body.country;
  const currentUserId = req.body.user_id;
  console.log(countrySelected);
  console.log("userId:", currentUserId);
  try {
    const country_CodeFinder = await db.query("SELECT country_code FROM countries WHERE country_name = $1", [countrySelected])

    if (country_CodeFinder.rows === 0) {
    return res.render ("index.ejs", {
      users: users,
      color: user.color,
      countries: [],
      error: "country not found"
    })

    } else {
      const code = country_CodeFinder.rows[0].country_code;
         const saveCountry = await db.query("INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)", [code, currentUserId])
    }
    } catch (err) {
    console.error("Error adding country:", err);
    res.send("Error handling request");
  }
    })


app.get("/", async (req , res) => {
  const result = await db.query("SELECT * FROM users");
  users = result.rows;
  console.log(users);
  const selectedUser = req.body.user;
  console.log(selectedUser);

  //let currentUser = users.find((user) => user.id ===currentUserId)
//select from a joined postgres table
  const visitedCountries = await db.query("SELECT country_code FROM visited_countries JOIN users ON users.id = $1", [selectedUser])
  const codes = visitedCountries.rows.country_code;
  const totalCountries = visitedCountries.rows.length;
  
  res.render("index.ejs", {
    users: users,
    color: users.color,
    countries: codes,
    total: totalCountries,
    error: "Could not find user"
  })
})
//new family member
app.post("/new", async(req, res) => {
  const newMember = req.body.name;
  const colorChoice = req.body.color;
  console.log(newMember);
  console.log(colorChoice);
  try {
   
    const result = await db.query("INSERT INTO users (name, color) VALUES ($1, $2)", [newMember, colorChoice])
  } catch (err) {
    console.error("Error adding new member:", err);
    res.send("Error handling request");
  }

} 
)

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
