const express = require('express');
const app = express();
const port = 3000;
require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
const db_uri = `mongodb://${process.env.DBUSER}:${process.env.DBPASS}@ds157853.mlab.com:57853/geekwise-social-club`;
mongoose.connect(db_uri, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to database was successful! Start the server....');
    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
});
app.use(express.json());


const User = require('./modules/user.schema');


app.use('/js', express.static(path.join(__dirname + '/../js')));
app.use('/css', express.static(path.join(__dirname + '/../css')));

app.use( (req, res, next) => {
    console.log(req.method, req.originalUrl);
    next();
})

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/../html/login-page.html')));
app.get('/profile', (req, res) => res.sendFile(path.join(__dirname + '/../html/profile.html')));
app.get('/edit-profile', (req, res) => res.sendFile(path.join(__dirname + '/../html/edit-profile.html')));
app.post('/api-sign-up', (req, res) => {

    const userInfo = {
        username: req.body.username,
        email: req.body.email,
        validIds: [req.body.username, req.body.email],
    }
    const user = new User(userInfo);
    user.encryptedPassword = user.generateHash(req.body.password);
    console.log('api-sign', req.body);
    user.save(function (errorSave) {
        User.find({
            'validIds': { $in: [req.body.username, req.body.email] }
        }).then( (users) => {


            if (users) {
                let message = '';
                users.forEach((indexedUser) => {
                    console.log(user, indexedUser);
                    if (String(indexedUser._id) !== String(user._id)) {
                        if (user.email === indexedUser.email) {
                            const inUseEmail = ' Email is in use.';
                            if(!message.includes(inUseEmail))
                            message += inUseEmail;
                        }
                        if (user.username === indexedUser.username) {
                            const inUseUsername = ' Username is in use.';
                            if(!message.includes(inUseUsername))
                                message += inUseUsername;
                        }
                    } else {
                        console.log('is user')
                    }
                });

                if (message) {
                    user.remove();
                    return res.json({
                        message,
                        success: false,
                    })
                }
                return res.json({
                    message: 'Successfully added a new user',
                    success: true,
                    user,
                });
            } else {
                return res.json( {
                    message: 'no users',
                    users,
                });
            }
        }).catch( errorFind => {
            if (errorFind) {
                console.log(errorFind);
                return res.json({
                    message: 'error',
                    error: errorFind,
                });
            }
        })
    });


});

app.post('/api-login', (req, res) => {

    console.log('body', req.body);


    User.find({
        'validIds': { $in: [req.body.username, req.body.email] }
    }).then( users => {
        if (!users || !users.length) {
            return res.json({
                message: "User not found.",
                success: false,
            });
        }

        console.log(users);

        if (users[0].validPassword(req.body.password)) {
            return res.json({
                message: "That is the correct password!",
                success: true,
                user: users[0],
            });
        } else {
            return res.json({
                message: "That is the incorrect password. Try again",
                success: false,
            });
        }
    })


});


app.post('/api-get-profile', (req, res) => {
    console.log('validId', req.body)
    User.find({
        'validIds': { $in: [req.body.validId] }
    }, ['email', 'username', '-_id']).then( users => {
        if (!users || !users.length) {
            return res.json({
                message: "User not found.",
                success: false,
            });
        }
        return res.json({
            message: "found user.",
            success: true,
            user: users[0],
        });
    })


});
