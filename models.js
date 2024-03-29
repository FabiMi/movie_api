const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String
    },
    Actors: [String],
    ImagePath: String,
    Featured: Boolean,
    Trailerpath: String

}
);

let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    Fav_Movie: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
    
});
userSchema.statics.hashPassword = (password) => {return bcrypt.hashSync(password, 10);
};
userSchema.methods.validatePassword = function(password)
{return bcrypt.compareSync(password, this.Password);
};

let genreSchema = mongoose.Schema({
    Name: String,
    Description: String
});

let directorSchema =  mongoose.Schema({
    Name: String,
    Bio: String
})


let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);
let Genre = mongoose.model('Genre', genreSchema);
let Director = mongoose.model('Director', directorSchema);

module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Genre = Genre;
module.exports.Director = Director;



