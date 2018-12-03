/*
 * Rope server
 */

var admin = require('firebase-admin');
var serviceAccount = require('./admin.json');
var express = require('express');
var app = express();
var cors = require('cors');

var each = require('async-each');
/*
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
*/
/*
var whitelist = [

];
var corsOptions = {
    origin: function(origin, callback){
        var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    },
    credentials: true
};
app.use(cors(corsOptions));

*/
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    //intercepts OPTIONS method
    if ('OPTIONS' === req.method) {
        //respond with 200
        res.send(200);
    }
    else {
        //move on
        next();
    }
});

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded());

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://rope-b4dbf.firebaseio.com"
});
var ref = admin.database().ref()
var userStoriesRef = ref.child('userStories');
var storiesRef = ref.child('stories');

app.post('/emails', function(req, res, next) {
    var userIDs = req.body['userIDs'];
    console.log(req.body);
    each(userIDs, function(uid, next) {
        admin.auth().getUser(uid)
            .then(function(userRecord) {
                next(null, userRecord.email)
            })
            .catch(function(error) {
                console.log("Error fetching user data:", error);
                next(error);
            });
    }, function(error, transformedArray) {
        console.log(error);
        return res.json(transformedArray);
    });
});

// Add users to a story
// Story id, the updated list of users that have access to the story
app.post('/add', function(req, res, next) {
    var emails = req.body['emails'];
    var story = req.body['storyId'];
    var users = [];
    var usersRef = storiesRef.child(story).child('users');

    function processEmail(email, next) {
        admin.auth().getUserByEmail(email)
            .then(function(userRecord) {
                // userRecord contains the user object from Firebase
                var uid = userRecord.uid;
                if (users.indexOf(uid) == -1) {
                    users.push(uid)
                }

                var userRef = userStoriesRef.child(uid);
                // Find out if the user has any stories already in the database
                userRef.once("value", function(snapshot) {
                    var stories = snapshot.val()
                    if (!stories) {
                        var data = { };
                        data[uid] = [story];
                        userStoriesRef.update(data);
                    } else if (stories.indexOf(story) == -1) {
                        stories.push(uid);
                        userRef.set(stories);
                    }
                    next();
                });
            })
            .catch(function(error) {
                console.log("Error fetching user data:", error);
                next(error);
            });
    }
    usersRef.once('value', function(snapshot) {
        snapshot.forEach(function (snapshot) {
            var usr = snapshot.val();
            if (users.indexOf(usr) != -1) {
                users.push(usr);
            }
        });

        each(emails, processEmail, function(error) {
            if (error) console.log(error);
            usersRef.set(users);

        });
    });
    return res.json({}).status(200);
});

app.listen(3000);
console.log('listening on 3000');
