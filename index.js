/*
 * Rope server
 */

var admin = require('firebase-admin');
var serviceAccount = require('./admin.json');
var express = require('express');
var app = express();
var cors = require('cors');
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
var storiesRef = ref.child('userStories')

// Add users to a story
// Story id, the updated list of users that have access to the story
app.post('/add', function(req, res, next) {
    emails = req.body['emails'];
    story = req.body['storyId'];
	console.log(req.body);
    for (var email of emails) {
        admin.auth().getUserByEmail(email)
            .then(function(userRecord) {
                // userRecord contains the user object from Firebase
                uid = userRecord.uid;
                userRef = admin.database().ref('userStories/' + uid);
                var children = {};
                // Find out if the user has any stories already in the database
                userRef.once("value")
                    .then(function(snapshot) {
                        var exists = false;
                        snapshot.forEach(function(child) {
                            children[child.key] = child.val();
                            // this story is already shared with the user, do nothing
                            if (child.val() == story) {
                                exists = true
                                return;
                            };
                        });
                        if (exists) { return; };
                        var numChildren = snapshot.numChildren();
                        // add the new story to the user's stories
                        children[numChildren] = story;
                        // update Firebase so the user now has that story ID
                        storiesRef.child(uid).set(children,console.log("added story to user"));
                    })
            })
            .catch(function(error) {
                console.log("Error fetching user data:", error);
            });
    }
    return res.json({}).status(200);
});

app.listen(3000);
console.log('listening on 3000');
