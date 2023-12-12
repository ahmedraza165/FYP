const User = require("../models/user");
const bcrypt = require("bcrypt");
/**
 * It takes a password, generates a salt, and then hashes the password with the salt
 * @param password - The password to hash.
 * @returns A promise that will resolve to a hash of the password.
 */
const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        reject(err);
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
};

const comparePassword = (password, hashed) => {
  return bcrypt.compare(password, hashed);
};

module.exports = { hashPassword, comparePassword};
