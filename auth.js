/**
 * @description Login route
 * @name POST /login
 * @function
 * @example
 * // Request data format
 * {
 *  "username": "",
 *  "password": ""
 * }
 * @example
 * // Response data format
 * {
 *  user: {
 *    "_id": "",
 *    "username": "",
 *    "password": "",
 *      "email": "",
 *    "Birthday": "" ,
 *    "FavoriteMovies": []
 *  },
 *  token: ""
 * }
 * @param {authentication} - Basic HTTP authentication (Username, Password)
 * @param {Object} router - Express router object
 */


const jwtSecret = 'your_jwt_secret';
const jwt = require('jsonwebtoken'),
passport = require('passport');
require('./passport');

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username,
        expiresIn: '7d',
        algorithm: 'HS256'
 });
}


module.exports = (router) => {
    router.post('/login', (req,res) => {
        passport.authenticate('local', {session:false},
        (error,user,info) => {
            if (error || !user) {
                return res.status(400).json({
                    message:'Something is not right',
                });
            }
            req.login(user, {session:false},(error) => {
                if(error) {
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({user, token});
                        });
        })(req, res);
    });
}

