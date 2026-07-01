import express from "express";
import bodyParser from "body-parser";
import env from "dotenv";
import pg from "pg";

const app = express();
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


// ===============================
// GET HOME PAGE
// ===============================
app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM visited_countries");
    const visited = result.rows;

    const countryCodes = visited.map(c => c.country_code);

    res.render("index.ejs", {
      countries: countryCodes,
      total: visited.length
    });

  } catch (err) {
    console.error("Error loading visited countries:", err);
    res.send("Database error");
  }
});


// ===============================
// POST /add (add a new country)
// ===============================
app.post("/add", async (req, res) => {
  const typedCountry = req.body.country.trim();

  try {
    // 1. Check if the typed country exists in the countries table
    const countryResult = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || LOWER($1) || '%'",
      [typedCountry]
    );

    if (countryResult.rows.length === 0) {
      // Country not found
      const visited = await db.query("SELECT * FROM visited_countries");
      const codes = visited.rows.map(c => c.country_code);

      return res.render("index.ejs", {
        countries: codes,
        total: visited.rows.length,
        error: "Country not found. Check spelling."
      });
    }

    const code = countryResult.rows[0].country_code;

    // 2. Check if already visited
    const visitedCheck = await db.query(
      "SELECT * FROM visited_countries WHERE country_code = $1",
      [code]
    );

    if (visitedCheck.rows.length > 0) {
      const visited = await db.query("SELECT * FROM visited_countries");
      const codes = visited.rows.map(c => c.country_code);

      return res.render("index.ejs", {
        countries: codes,
        total: visited.rows.length,
        error: "You already added this country."
      });
    }

    // 3. Insert into visited_countries
    await db.query(
      "INSERT INTO visited_countries (country_code) VALUES ($1)",
      [code]
    );

    // 4. Reload page with updated list
    const updatedList = await db.query("SELECT * FROM visited_countries");
    const updatedCodes = updatedList.rows.map(c => c.country_code);

    res.render("index.ejs", {
      countries: updatedCodes,
      total: updatedList.rows.length
    });

  } catch (err) {
    console.error("Error adding country:", err);
    res.send("Error handling request");
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
