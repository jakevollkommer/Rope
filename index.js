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
    res.header('Access-Control-Allow-Origin', 'chrome-extension://bmiochekbaeflmkiokmaclfmpaknbelk');
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
var ref = admin.database().ref('userStories')

// Add users to a story
// Story id, the updated list of users that have access to the story
app.post('/add', function(req, res, next) {
    console.log(req.body);

    emails = req.body['emails'];
    //console.log(emails);
    story = req.body['storyID']
    //console.log(story);
    return res.json({}).status(200);
    for (email in emails){
        console.log(email)
        admin.auth().getUserByEmail(email)
          .then(function(userRecord) {
            // See the tables above for the contents of userRecord
            console.log("Successfully fetched user data:", userRecord.toJSON());
            uid = userRecord.uid
            ref.uid.push(story)
          })
          .catch(function(error) {
            console.log("Error fetching user data:", error);
          });
    }

});

app.listen(3000);
console.log('listening on 3000');
