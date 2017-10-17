var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var userSchema = Schema(
    {
        name: {type: String, required: true, max:100},
        email: {type: String, required: true, unique: true, max:100},
        password: {type: String, required: true},
        lat: {type: Number},
        lng: {type: Number}
    }
);
mongoose.model('User', userSchema);