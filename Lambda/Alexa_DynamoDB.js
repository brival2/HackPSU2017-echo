
const AWSregion = '';  
const APP_ID = ""; // App Id from Alexa Skill console
var studentList=[	'postId'];

function randomPhrase(array) {
    return(array[Math.floor(Math.random()*array.length)]);
}


const Alexa = require('alexa-sdk');
const AWS = require('aws-sdk');

AWS.config.update({
    region: AWSregion
});

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);

    alexa.appId = event.context.System.application.applicationId === 'applicationId' ? 'applicationId' : APP_ID;

    alexa.registerHandlers(handlers);
    alexa.execute();
};



const handlers = {
    'LaunchRequest': function () {
        this.response.speak('welcome to echo my notes. select a classmates notes you want to listen to.').listen('try again');
        this.emit(':responseReady');
    },
    'Unhandled': function() {
        this.emit(':ask', 'Sorry I didnt understand that. Say help for assistance.');
    },

    'MyIntent': function () {

        const friendName = this.event.request.intent.slots.friendname.value;
        console.log('Friend : ' + friendName);
        var stdID = randomPhrase(studentList);
        console.log(stdID);
        console.log(stdID.toString());
        var params = {
          TableName: 'posts',
          Key: {
              'id':{
                  S: stdID.toString()
              }
          }
        };
        
        function readDynamoItem(params, callback) {

            var AWS = require('aws-sdk');
            AWS.config.update({region: AWSregion});

            var docClient = new AWS.DynamoDB();

            console.log('reading item from DynamoDB table');

            docClient.getItem(params, (err, data) => {
                if (err) {
                    console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    console.log("GetItem succeeded:", JSON.stringify(data, null, 2));

                    callback(data.Item.text.S);
                }
            });
        }


        readDynamoItem(params, myResult=>{
            var say = '';

            say = myResult;

            say = friendName + 'notes are: ' + myResult;
           this.response.speak(say);
            this.emit(':responseReady');

        });

    },
    'AMAZON.HelpIntent': function () {
        this.response.speak('sorry that person does not share a class with you').listen('try again');
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak('Goodbye!');
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak('Goodbye!');
        this.emit(':responseReady');
    }
};