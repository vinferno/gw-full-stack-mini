const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
const UserSchema = new Schema(
    {
        username: {type: String, required: true},
        name: {type: String},
        about: {type: String},
        email: {type: String, required: true},
        validIds : [{type: String }],
        encryptedPassword: {type: String, required: true},
        friends: [{ type : mongoose.Schema.Types.ObjectId, ref: 'User' }],
    });


UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9))
}
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.encryptedPassword);
}
module.exports = mongoose.model('User', UserSchema);
