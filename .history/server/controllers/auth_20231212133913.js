const { User } = require("../models/user");
const { hashPassword, comparePassword } = require("../utils/auth");
const jwt = require("jsonwebtoken");
const  Form  = require('../models/packages');
const { nanoid } = require("nanoid");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const CLIENT_URL = "http://localhost:3001";

const verifyEmail = async (req, res) => {
  const { emailVerificationToken } = req.params;
  try {
    const user = await User.findOneAndUpdate(
      { emailVerificationToken },
      { isVerified: true, emailVerificationToken: null }
    );
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    user.isVerified = true;
    console.log(user.isVerified);
    res.json({ message: 'Account activated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const regName = /^[a-zA-Z]+$/;
    //validation
    if (!name) {
      return res.status(400).send("name is required");
    }

    if (!name.match(regName)) {
      return res.status(400).send("name is not valid");
    }
    if (!email) {
      return res.status(400).send("email is required");
    }

    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email.match(mailFormat)) {
      return res.status(400).send("email is not valid");
    }
    // if (!email.includes(".com")) {
    //   return res.status(400).send("email is not valid");
    // }

    if (!password || password.length < 6) {
      return res
        .status(400)
        .send(
          "Password is required and password must be at least 6 characters"
        );
    }

    const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (!password.match(passRegex)) {
      return res
        .status(400)
        .send(
          "Password is not valid Enter a capital letter also along with minimum 6 characters"
        );
    }

    let userExist = await User.findOne({ email }).exec();
    if (userExist) {
      return res.status(400).send("email is already taken");
    }

    const hashedPassword = await hashPassword(password);
    console.log("reached here2");
    const user = new User({ name, email, password: hashedPassword });
    const token = crypto.randomBytes(64).toString("hex");
    user.emailVerificationToken = token;
    await user.save();
    console.log("user saved", user);
      // send verification email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "saadiqbalch@gmail.com",
          pass: "rsqc otih ptcz guuy",
        },
        tls: {
          rejectUnauthorized: false,
        },
        pool: true,
        poolTimeout: 600000 * 1000,
      });
  
      const mailOptions = {
        from: "saadiqbalch@gmail.com",
        to: user.email,
        subject: "Verify your email",
        html: `
          <h1>Welcome to the best tour experience site, Travel Ease</h1>
          <p>Please click the link below to verify your email:</p>
          <a href="${CLIENT_URL}/VerifyEmail?emailVerificationToken=${user.emailVerificationToken}">Verify Your Email.</a>
        `,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
  return res.json({ ok: true });
} catch (err) {
  console.log(err);
  return res.status(400).send("Error. Please try again");
}
};

const login = async (req, res) => {
  try {
    const { email, password  } = req.body;

    const user = await User.findOne({ email }).exec();

    if (!user) {
      return res.status(400).send("No user found");
    }
    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(400).send("Wrong password");
    }

    if(!user.isVerified)
    {
      return res.status(400).send("User Not Verified");
    }
    if (match) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      user.password = undefined;
      res.cookie("token", token, {
        httpOnly: true,
        // secure:true
      });

      res.json(user);
    }
  } catch (err) {
    return res.status(400).send("Error. Please try again");
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ message: "Successfully logged out" });
  } catch (err) {
    console.log(err);
  }
};

export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id).select("-password").exec();
    console.log("CURRENT_USER", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
   
    const shortCode = nanoid(6).toUpperCase();
    const user = await User.findOneAndUpdate(
      { email },
      { passwordResetCode: shortCode }
    );
    if (!user) {
      return res.status(404).send("Email not found");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "saadiqbalch@gmail.com",
        pass:  "rsqc otih ptcz guuy", // Replace with your email password
      },
      tls: {
        rejectUnauthorized: false,
      },
      pool: true,
      poolTimeout: 600000 * 1000,
    });

    const mailOptions = {
      from: "saadiqbalch@gmail.com", // Replace with your email
      to: email,
      subject: "Reset Password",
      html: `
        <h1>Reset your password</h1>
        <p>Your secret code is:</p>
        <p>${shortCode}</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).send("Error sending email");
      } else {
        console.log("Email sent: " + info.response);
        return res.json({ ok: true });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error. Please try again");
  }
};
// Reset password
const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
   

    const hashedPassword = await hashPassword(newPassword);

    const user = await User.findOneAndUpdate(
      { email, passwordResetCode: code },
      {
        password: hashedPassword,
        $unset: { passwordResetCode: 1 },
      }
    );

    // Check if user exists and if the password reset code matches
    if (!user) {
      return res.status(400).send("Invalid email or code");
    }

    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.status(400).send("Error! Try Again");
  }
};



const createnewpackage = async (req, res) => {
  try {
    const { place, days, price, description,deadline , totalCount} = req.body;

    if (!place || !days || !price || !description ) {
      return res.status(400).json({ error: "Please provide all required data." });
    }

    const image = req.file; 

    const newForm = new Form({
      instructor: req.auth._id,
      place,
      days,
      price,
      description,
      image: { data: image.buffer, contentType: image.mimetype }, // Save image data
      deadline,
      totalCount
    });
    
    await newForm.save(); // Add the await keyword here to wait for the save operation to complete

    // Return a success response
    return res.status(200).json({ message: 'Form submitted successfully!' });
  } catch (error) {
    // Handle any errors that occur during form submission
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while submitting the form.' });
  }
};


module.exports = {
  register,
  login,
  logout,
  currentUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  createnewpackage,
};