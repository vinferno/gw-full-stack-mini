const express = require('express');
const app = express();
const port = 3000;
require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
const db_uri = `mongodb://${process.env.DBUSER}:${process.env.DBPASS}@${process.env.DBNAME}`;
mongoose.connect(db_uri, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to database was successful! Start the server....');
    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
});
app.use(express.json());


const User = require('./modules/user.schema');
const Chat = require('./modules/chat.schema');


app.use('/js', express.static(path.join(__dirname + '/../js')));
app.use('/css', express.static(path.join(__dirname + '/../css')));

app.use((req, res, next) => {
    console.log(req.method, req.originalUrl);
    next();
})

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/../html/login-page.html')));
app.get('/profile', (req, res) => res.sendFile(path.join(__dirname + '/../html/profile.html')));
app.get('/edit-profile', (req, res) => res.sendFile(path.join(__dirname + '/../html/edit-profile.html')));
app.get('/users', (req, res) => res.sendFile(path.join(__dirname + '/../html/users-page.html')));
app.get('/chat', (req, res) => res.sendFile(path.join(__dirname + '/../html/chat-page.html')));
app.post('/api-sign-up', (req, res) => {

    const userInfo = {
        username: req.body.username,
        email: req.body.email,
        validIds: [req.body.username, req.body.email],
        friends: [],
    }
    const user = new User(userInfo);
    user.encryptedPassword = user.generateHash(req.body.password);
    console.log('api-sign', req.body);
    user.save(function (errorSave) {
        User.find({
            'validIds': {$in: [req.body.username, req.body.email]}
        }).then((users) => {


            if (users) {
                let message = '';
                users.forEach((indexedUser) => {
                    console.log(user, indexedUser);
                    if (String(indexedUser._id) !== String(user._id)) {
                        if (user.email === indexedUser.email) {
                            const inUseEmail = ' Email is in use.';
                            if (!message.includes(inUseEmail))
                                message += inUseEmail;
                        }
                        if (user.username === indexedUser.username) {
                            const inUseUsername = ' Username is in use.';
                            if (!message.includes(inUseUsername))
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
                return res.json({
                    message: 'no users',
                    users,
                });
            }
        }).catch(errorFind => {
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
        'validIds': {$in: [req.body.username, req.body.email]}
    }).then(users => {
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
        'validIds': {$in: [req.body.validId]}
    }).then(users => {
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

app.post('/api-edit-profile-submit', (req, res) => {
    console.log('req.body');
    console.log(req.body);
    console.log(res);
    User.findOneAndUpdate({
        'validIds': {$in: [req.body.username, req.body.email]}
    }, req.body, {
        returnNewDocument: true,
        new: true,
    })
        .then(result => {
            console.log(result);
            res.status(201).json({
                user: result,
                message: "found user.",
                success: true,
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
                message: "Error",
                success: false,
            });
        })


});

app.get('/api-get-users', (req, res) => {
    console.log('req.body');
    console.log(req.body);
    console.log(res);
    User.find({}).then(result => {
        console.log(result);
        res.status(201).json({
            users: result,
            message: "found users.",
            success: true,
        });
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
                message: "Error",
                success: false,
            });
        });
});


app.post('/api-add-friend', (req, res) => {
    console.log('req.body');
    console.log(req.body);
    User.find({
        'validIds': {$in: [req.body.myValidId]}
    }).then(users => {
        if (!users || !users.length) {
            return res.json({
                message: "User not found.",
                success: false,
            });
        }
        User.find({
            'validIds': {$in: [req.body.friendValidId]}
        }).then(friends => {
            if (!friends || !friends.length) {
                return res.json({
                    message: "Friend not found.",
                    success: false,
                });
            }
            users[0].friends.push(friends[0]._id)
            users[0].save();
            return res.json({
                message: "added friend",
                success: true,
                friend: friends[0],
            });
        });
    });
});

app.post('/api-get-friends', (req, res) => {
    console.log('req.body');
    console.log(req.body);
    User.find({
        'validIds': {$in: [req.body.validId]}
    }).populate('friends').then(users => {
        if (!users || !users.length) {
            return res.json({
                message: "User not found.",
                success: false,
            });
        }
        return res.json({
            message: "Friends found",
            success: true,
            users: users[0].friends,
        });
    });
});

app.post('/api-get-isFriend', (req, res) => {
    User.find({
        'validIds': {$in: [req.body.myValidId]},
        'friends': {$in: [ mongoose.Types.ObjectId(req.body.validId)]},
    }).then(users => {
        if (!users || !users.length) {
            return res.json({
                message: "User not found.",
                success: false,
            });
        }
        return res.json({
            message: "Friends found",
            success: true,
            isFriends: !!(users.length)
        });
    });
});

app.post('/api-get-conversation', (req, res) => {
    console.log(req.body);
    const findMine = User.find({
        'validIds': {$in: [req.body.myValidId]}
    });
    const findYours = User.find({
        'validIds': {$in: [req.body.validId]}
    });
    Promise.all([
        findMine,
        findYours,
    ]).then( results => {
        const mine = results[0][0];
        const yours = results[1][0];
        Chat.find({
            'participants': {$all: [mine._id, yours._id]}
        }).populate('sender').then(chats => {
            if (!chats) {
                return res.json({
                    message: "Chats not found.",
                    success: false,
                });
            }
            return res.json({
                message: "Chats found",
                success: true,
                chats,
            });
        });
    })

});

app.post('/api-add-chat', (req, res) => {

    const findMine = User.find({
        'validIds': {$in: [req.body.myValidId]}
    });
    const findYours = User.find({
        'validIds': {$in: [req.body.validId]}
    });
    Promise.all([
        findMine,
        findYours,
    ]
    ).then( result => {
        console.log('result.all', result);
        const mine = result[0][0];
        const yours = result[1][0];
        if (mine && yours) {
            const chat = new Chat({
                message: req.body.message,
                sender: mine._id,
                participants: [mine._id, yours._id],
            });
            chat.save(function (error) {
                if (error) {
                    return res.json({
                        message: "chat not saved",
                        success: false,
                        mine,
                        yours,
                    });
                } else {
                    return res.json({
                        message: "chat saved",
                        success: true,
                        mine,
                        yours,
                    });
                }

            });
        }else {
            return result.json({
                message: "users not found",
                success: false,
                mine,
                yours,
            });
        }
    })
});
