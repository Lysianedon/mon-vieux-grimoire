//-------------- EXPRESS ---------------//
const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// ---- CREATE A USER ----//
// router.post('/',joiUserPartialValidation, checkIfUserExists, async (req,res) => {
//     //Check if user already exists:
//     const email = req.body.email, userExists = req.userExists;
//     let newUser = req.body;

//     if (userExists) {
//         return res.status(400).json({error: true, message: "Email already exists"})
//     }

//     //Hashing password:
//     let userPassword = newUser.password;
//     userPassword = await bcrypt.hash(userPassword, 10)
//     newUser.password = userPassword

//     try {
//         newUser = await User.create(newUser);
//     } catch (error) {
//         return res.status(400).json({ message: "An error happened.", error})
//     }

//     //Adding user's infos in cookie:
//     const token = jwt.sign({ id: newUser._id }, secret, { expiresIn: "30d" })
//     // *! 3.2 - Store token in a cookie called "jwt" and send it to client in response with a message of successful login
//     return res
//       .cookie("jwt", token, { httpOnly: false, secure: false })
//       .status(201)
//       .json({ success: true, message: "User successfully created and logged in", newUser })
// })

// ---- LOGIN USER ----//
// router.post("/login", async (req, res) => {
//     const { email, password } = req.body;
//     //* 1- Check user's email
//     let user;
//     try {
//       user = await User.findOne({ email });
//     } catch (error) {
//       console.log(error);
//       return res.json({ message: "A problem happened." });
//     }
  
//     if (!user) {
//       return res.status(401).json({
//         message: "Incorrect email or password",
//         error: true,
//       });
//     }
//     //* 2 - Check user's password and compare it to hash in database
  
//     const isPasswordValid = await bcrypt.compare(password, user.password);
  
//     if (!isPasswordValid) {
//       return res.status(401).json({
//         message: "Incorrect email or password",
//         error: true,
//       });
//     }
  
//     //* 3 - Authentification
//     // *! 3.1 - Generate a token with jsonwebtoken
//     const token = jwt.sign({ id: user._id }, secret, { expiresIn: "30d" }); 
//     // *! 3.2 - Store token in a cookie called "jwt" and send it to client in response with a message of successful login
//     return res
//       .cookie("jwt", token, { httpOnly: false, secure: false })
//       .status(200)
//       .json({ success: true, message: "You logged in successfully", user });
//   });



module.exports = router;