// to run this type:  nodemon src/app.js
//other option
// like we do add something in package.json to make run easy just adding a dependency under tag debug: "dev": "nodemon src/app.js"
// if we do this then to run files just type : npm run dev
// if u want to also save and run hbs files through nodemon just do changes in nodemon src/app.js to "nodemon src/app.js -e js,hbs"
const crypto = require('crypto');
require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");

require("./src/db/conn");
const Register = require("./src/models/register");
const UserProfile = require("./src/models/userinfo");
const { json } = require("express");
const { log } = require("console");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser");
const auth = require("./src/middleware/auth");

const port = process.env.PORT || 3000;

// Import necessary modules and set up Express
// const Handlebars = require('handlebars'); // If using Node.js
// Import Handlebars if you're using a module system in your project

hbs.registerHelper('defaultIfUndefined', function(value, defaultValue) {
  return value || defaultValue;
});
const static_path = path.join(__dirname, "./public");
const template_path = path.join(__dirname, "./templates/views"); // we are changing the actual view path so tell this to express
const partial_path = path.join(__dirname, "./templates/partials"); // locate the location of partials files

//Middleware
app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));

app.set("view engine", "hbs");
app.set("views", template_path); // tell express views path is replaced by template_path
hbs.registerPartials(partial_path); // tell the location of partials files

// console.log(process.env.SECRET_KEY);




// Define a Handlebars helper to check for active links
hbs.registerHelper("isActive", (currentPath, linkPath) => {
  return currentPath === linkPath ? "active" : "";
});


app.get("/", (req, res) => {
  res.render("index",{ request: req });
});

// secret page which can only be access if login is there becoz we use auth
app.get("/secret", auth, (req, res) => {
  // console.log(`THis is cookie  ${ req.cookies.jwt}`);
  try {
    // Here, you can fetch user data from your database
    const userData= {
      Username: req.user.Username,
      Email: req.user.Email
      
    };
    // console.log(userData.Username)

    res.render("secret", { userData , request: req});
  } catch (error) {
    res.status(500).send("Something went wrong.");
  }
 
});


// recipe
app.get("/recipe", auth, (req, res) => {
  // console.log(`THis is cookie  ${ req.cookies.jwt}`);
  
    try{
  
      const token3 = crypto.randomBytes(32).toString('hex'); // Modify this to match your token generation logic

      // Redirect the user to the recipe website with the token as a query parameter
      res.redirect(`https://fine-pear-jellyfish-gear.cyclic.cloud/?token=${token3}`);   
      // for above file code refer git repo -> https://github.com/chetankumar9903/Kitchen-Magic-Recipes-Blog
   

   
  } catch (error) {
    res.status(500).send("Something went wrong.");
  }
 
});








//logout work
app.get("/logout", auth, async (req, res) => {
  try {
    // console.log(req.user); // give all data of that user

// for single logout
// this is used to remove token from database also
// this delete token of current device login only and if some other device also login then for that i does not do logout
// basically it logout only current device not all which are login to this site

    // req.user.tokens = req.user.tokens.filter((currElement) => {
    //     return currElement.token !== req.token;
    // })

//for logout from all devices

    req.user.tokens =[]  // empty array

// this is used to delete cookie from browser it does not delete token from database
    res.clearCookie("jwt"); // delete generated cookie

    console.log("logout successfully");
    await req.user.save();
    res.render("login" , {request: req}); //after logout go to login page
  } catch (error) {
    res.status(500).send("Please login First, then logout works..!!!");
  }
});

app.get("/register", (req, res) => {
  res.render("register",{ request: req });
});

app.get("/login", (req, res) => {
  res.render("login",{ request: req });
});

//create new user in our database

// Assuming you have an Express route to handle the form submission
app.post('/update-profile', async (req, res) => {
  try {
    const { username, age, phone, address } = req.body;

    // Check if the user already exists
    const user = await Register.findOne({ Username: username });

    if (!user) {
      return res.status(404).send("User not found. Enter correct Username");
    }

    // Check if the user already has a profile
    const existingProfile = await UserProfile.findOne({ username: username });

    if (existingProfile) {
      // Update the existing profile
      existingProfile.age = age;
      existingProfile.phone = phone;
      existingProfile.address = address;
      await existingProfile.save();
    } else {
      // Create a new user profile document
      const userProfile = new UserProfile({
        username: username,
        age,
        phone,
        address,
      });

      // Save the user profile to the database
      if(user){
      await userProfile.save();
      }
    }

    // Respond with success
    // return res.status(200).json({ success: true, message: 'Profile updated successfully' });
    const userData= {
      Username: user.Username,
      Email: user.Email,
    }
    res.render("secret", { userData})
  } catch (error) {
    // Handle errors
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});



app.post("/register", async (req, res) => {
  try {
    const password = req.body.Password;
    const cpassword = req.body.Confirmpassword;

    if (password === cpassword) {
      const registration = new Register({
        Username: req.body.Username,
        Email: req.body.Email,
        Password: req.body.Password,
        Confirmpassword: req.body.Confirmpassword,
      });

      // Save the user registration data to the database
      const registered = await registration.save();

      // Generate a token for the user
      const token = await registration.generateAuthToken();

      // Set the JWT token as a cookie
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 600000),
        httpOnly: true,
      });

      // Render the "index" view after successful registration
      // res.status(201).render("index");
      
      const userData= {
        Username: req.body.Username,
       
      }
      res.status(201).render("index", { userData , request: req});
    } else {
      res.send("Password does not match");
    }
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});


//login check

app.post("/login", async (req, res) => {
  try {
    const username = req.body.Username;
    const password = req.body.Password;

    const user = await Register.findOne({ Username: username }); //lastone upone username
    //    res.send(user);
    //    console.log(user );


    if (!user) {
      return res.status(404).send("Invalid login details");
    }

    // check at time login the user enter password is equal to database password (hashed one)
    const isMatch = await bcrypt.compare(password, user.Password); //(usereneterd password, password in database)

    if (!isMatch) {
      return res.status(404).send("Invalid login details");
    }

    const token = await user.generateAuthToken(); // func write in register.js mai
    // console.log(`the token part ${token}`);

    //cookies
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 600000),
      httpOnly: true,
      //secure:true
    });

    // get cookies
    // console.log(`THis is cookie  ${ req.cookies.jwt}`)  // this part is under .get secret

    // check at time login the user enter password is equal to database password

    // if(user.Password === password){
    //     res.status(201).render("index"); // on correct password to next page
    // }
    // else{
    //     res.status(404).send("invalid Login details");
    // }

    // Authentication successful, generate a secure random token
    // const token2 = crypto.randomBytes(32).toString('hex'); // Modify this to match your token generation logic
    // res.redirect(`https://fine-pear-jellyfish-gear.cyclic.cloud/?token=${token2}`);

    if (isMatch) {
    const userData= {
      Username: user.Username,
      Email: user.Email,
    }
    
     res.status(201).render("index",{ userData , request: req}); // on correct password to next page
    //  res.status(201).render("secret", { userData , request: req});
    } else {
      res.status(404).send("invalid  details");
    }
  } catch (error) {
    res.status(400).send("invalid Login details");
  }
});



app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
