const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
const UserSchema = new Schema(
    {
        username: {type: String, required: true},
        email: {type: String, required: true},
        validIds : [{type: String }],
        encryptedPassword: {type: String, required: true},
    });


UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9))
}
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.encryptedPassword);
}

UserSchema.methods.getSecure = function(list) {
    const clone = {};
    list.forEach(key => {
        clone[key] = this[key];
    });
    return clone;
}
module.exports = mongoose.model('User', UserSchema);
