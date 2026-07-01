import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import session from "express-session"
import passport from "passport"
import { Strategy } from "passport-local"
import env from "dotenv";
env.config({ override: true });

const app = express();
const port = 3000;
const saltRounds = 10;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({
  secret: "TOPSECTRETWORD",
  resave: false,//we do not want to save the session the session on the database, we will save it on our server
  saveUninitialized: true, //store uninitialised sessions into the server
  cookie: {
    maxAge: 60000 * 60 //how long before the session expires in (milliseconds) etc 1000 ms = 1 sec. currently set to 1 hour
  }
}));

//make sure the passport module goes after the session initialization(see above)!!!
app.use(passport.initialize());
app.use(passport.session());
   
const db = new pg.Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: Number(process.env.PORT),
});
db.connect();

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.get("/secrets", (req, res) => {
  console.log(req.user) //prints out the user that gained access to the secrets page
  if(req.isAuthenticated()){
    return res.render("secrets.ejs");
  } else {
    res.redirect("/login") //you redirect to routes not ejs
  }
})

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
    } else {
      //hashing the password and saving it in the database
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          console.log("Hashed Password:", hash);
          await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
            [email, hash]
          );
          const user = result.rows[0]
          req.login(user, (err) => {
            console.log(err)
            res.redirect("/secrets")
          })
          //res.render("secrets.ejs");
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", passport.authenticate("local", { //basically you are using the local strategy to authenticate this particular request
successRedirect: "/secrets",
failureRedirect: "/login",
}));
 //const email = req.body.username;
 // const loginPassword = req.body.password; (commented out from app.post login route)
passport.use(
  new Strategy(async function verify(username, password, cb) { //we can move the login try catch block to here so the user can be verified. uses the ejs name attribute (username and password)!!!! to find match instead of req.body.username/password. cb means call back
try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      username, //changed email to username
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedHashedPassword = user.password;
      bcrypt.compare(password, storedHashedPassword, (err, result) => { //changed login Password to password
        if (err) {
          //console.error("Error comparing passwords:", err);
          return cb (err)
        } else {
          if (result) {
            return cb (null, user);
           // res.render("secrets.ejs");
          } else {
            return cb(null, false); 
           // res.send("Incorrect Password");
          }
        }
      });
    } else {
      return cb ("User not found")
     // res.send("User not found");
    }
  } catch (err) {
    return cb (err)
   // console.log(err);
  }
}))

passport.serializeUser((user, cb) =>{ //method serializes user information before savinf it.
  cb(null, user);
});

passport.deserializeUser((user, cb) =>{ //method deserializes user information that is saved
  cb(null, user);
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
