

const { expressjwt: jwt } = require("express-jwt");
const { User } = require("../models/user");

const multer = require('multer');

// Define the storage for uploaded files
const storage = multer.memoryStorage(); // Store files in memory as buffers

// Define the file filter function to accept only specific file types
const fileFilter = (req, file, cb) => {
  // Define the allowed file types (e.g., images)
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    // Accept the file
    cb(null, true);
  } else {
    // Reject the file (passing an error message)
    cb(new Error('Invalid file type. Only JPEG, PNG, and GIF images are allowed.'), false);
  }
};

// Create the Multer instance with the defined storage and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // Limit file size to 5 MB (adjust as needed)
  },
});

/* A middleware that checks if the user is signed in. */
const requireSignin = jwt({
  getToken: (req, res) => req.cookies.token,
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

/**
 * If the user is not an instructor, send a 403 status code. Otherwise, continue with the next
 * middleware
 * @param req - The request object.
 * @param res - the response object
 * @param next - This is a function that is called when the middleware is complete.
 * @returns A function that checks if the user is an instructor.
 */

const verifyEmail = async (req, res , next)=>{
  try{
    const user = await User.findOne({email : req.body.email})
    if(user.isVerified){
      next()
    }
    else{
      console.log("Please check your email to verify your account")
    }
  }
  catch(err){
    console.log(err);
  }
}
module.exports = { requireSignin, verifyEmail, upload};
