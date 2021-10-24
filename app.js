require("dotenv").config();
require("./db/database").connect();
const express = require("express");
const auth = require("./middleware/authentication");
const User = require("./model/user");
var { check , validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");



const app = express();

app.use(express.json());


app.post("/registration",
 [
   check('Email')
  .notEmpty().isEmail().
   withMessage('Email Field Should not be Empty'),
   check('Mobile_Number')
  .notEmpty()
  .withMessage("Email Field Should not be Empty")
  .isLength({min:10}),
   check('First_name')
  .notEmpty()
  .withMessage('Name Field Should not be Empty'),
  check('Last_name')
  .notEmpty()
  .withMessage('Last_name Field Should not be Empty'),
  check('Last_name')
  .notEmpty()
  .withMessage('Last_name Field Should not be Empty'),
   check('Password')
  .isLength({ min: 9 ,max:13})
  .withMessage('Password Field Should should be max of particular Length')
], async(req, res) => {

    const error = validationResult(req);
    if(!error.isEmpty()){
        res.json(error);
    }
   try {
      const { First_name, Last_name, Email,Mobile_Number, Password,Confirm_Password } = req.body;
      
      if (!( Password && Confirm_Password)) {
        res.status(400).send("Password and Confirm Password Doesn't Match");
      }
      const oldUser = await User.findOne({ Email });
  
      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      }

      const mob = await User.findOne({ Mobile_Number });
  
      if (mob) {
        return res.status(409).send("Mobile Number Already Exist. Please Login");
      }

    
      const user = await User.create({
        First_name,
        Last_name,
        Mobile_Number,
        Email: Email.toLowerCase(), 
        Password
      });
  

      const token = jwt.sign(
        { Email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
  
      user.token = token;
      res.status(201).json(user);
    } 
    catch (err) {
      console.log(err);
    }
  
  });

  app.post("/login", 
  [
    check('Mobile_Number')
   .notEmpty()
   .withMessage("Email Field Should not be Empty")
   .isLength({min:10}),
   check('Password')
  .isLength({ min: 9 ,max:13})
  .withMessage('Password Field Should should be max of particular Length')
  ],

  async (req, res) => {
    try {
      const { Mobile_Number, Password } = req.body;
  
      if (!(Mobile_Number && Password)) {
        res.status(400).send("All input is required");
      }
      const user = await User.findOne({ Mobile_Number });
  
      if (user && (Mobile_Number, Password)) {
        
        const token = jwt.sign(
          { Mobile_Number },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
  

        user.token = token;
  

      res.redirect('/profile?token='+token);
      }
      res.status(400).send("Invalid Credentials");
    } catch (err) {
      console.log(err);
    }
  });

  app.get("/profile", auth, (req, res) => {
    const token =  req.body.token || req.query.token || req.headers["x-token"];
    const { First_name, Last_name, Email,Mobile_Number} = req.body;
  res.status(200).send("Welcome: "+token+ "With Mobnum :"+Mobile_Number+"Email:"+Email+"First Name:"+First_name+"Last_name:"+Last_name);
});

module.exports = app;
