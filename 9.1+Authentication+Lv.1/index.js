import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import env from "dotenv";

env.config({ override: true });

const app = express();
const port = 3000;
const saltRounds = 10;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const dbConfig = {
  user: process.env.PGUSER || process.env.DB_USER || process.env.USER,
  host: process.env.PGHOST || process.env.DB_HOST || process.env.HOST,
  database:
    process.env.PGDATABASE || process.env.DB_NAME || process.env.DATABASE,
  password:
    process.env.PGPASSWORD || process.env.DB_PASSWORD || process.env.PASSWORD,
  port: Number(process.env.PGPORT || process.env.DB_PORT || 5432),
};

if (
  !dbConfig.user ||
  !dbConfig.host ||
  !dbConfig.database ||
  !dbConfig.password
) {
  throw new Error(
    "Missing database environment variables. Set PGUSER/PGHOST/PGDATABASE/PGPASSWORD (or DB_USER/DB_HOST/DB_NAME/DB_PASSWORD).\n",
  );
}

const db = new pg.Client({
  user: dbConfig.user,
  host: dbConfig.host,
  database: dbConfig.database,
  password: dbConfig.password,
  port: dbConfig.port,
});

await db.connect();

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const newPassword = req.body.password;
  //check if user already exists
  try {
    const result = await db.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    if (result.rowCount > 0) {
      return res.status(401).send("User already exists");
    } else {
      //password hashing
      bcrypt.hash(newPassword, saltRounds, async (err, hash) => {
        if (err) {
          console.log("Error hashing password", err);
        } else {
          await db.query("INSERT INTO users (email, password) VALUES ($1,$2)", [
            email,
            hash,
          ]);
          console.log(`new user: ${email} has been added`);
          res.send("User registration successful");
        }
      });
      //add as a new user
    }
  } catch (err) {
    console.error("Error registering new user:", err);
    res.send("Error handling request");
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const userPassword = req.body.password;
  try {
    const result = await db.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    console.log(`User searched: ${result.rows}`);

    if (result.rowCount > 0) {
      const user = result.rows[0];
      const storedHashedPassword = user.password;
      bcrypt.compare(userPassword, storedHashedPassword, (err, result) => {
        if (err) {
          console.log("Error comparing passwords:", err);
        } else {
          if (result) {
            res.render("secrets.ejs");
          } else {
            res.send("Incorrect Password");
          }
        }
      });
    } else {
      return res.status(401).send("User does not exists");
    }
  } catch (err) {
    console.error("Error logging user:", err);
    res.send("Error handling request");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
