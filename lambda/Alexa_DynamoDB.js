
// There are three sections, Text Strings, Skill Code, and Helper Function(s).
// You can copy and paste the entire file contents as the code for a new Lambda function,
//  or copy & paste section #3, the helper function, to the bottom of your existing Lambda code.


// 1. Text strings =====================================================================================================
//    Modify these strings and messages to change the behavior of your Lambda function

const AWSregion = '';  
const APP_ID = "";
var studentList=[	'postId'];

function randomPhrase(array) {
    return(array[Math.floor(Math.random()*array.length)]);
}


// params[S] = variable;
// 2. Skill Code =======================================================================================================

const Alexa = require('alexa-sdk');
const AWS = require('aws-sdk');

AWS.config.update({
    region: AWSregion
});

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);

    alexa.appId = event.context.System.application.applicationId === 'applicationId' ? 'applicationId' : APP_ID;
    // alexa.dynamoDBTableName = 'YourTableName'; // creates new table for session.attributes

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
        var eyedee = randomPhrase(studentList);
        console.log(eyedee);
        console.log(eyedee.toString());
        var params = {
          TableName: 'posts',
          Key: {
              'id':{
                  S: eyedee.toString()
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

                    callback(data.Item.text.S);  // this particular row has an attribute called message
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

//    END of Intent Handlers {} ========================================================================================
// 3. Helper Function  =================================================================================================


