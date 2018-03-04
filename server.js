const express = require('express');
const app = express();

const accountSid = 'ACec4220252e994bf2a11627c3fb22f615'
const authToken = '817c4842854bfbd0c36774c6a88cc35a'
const MessagingResponse = require('twilio').twiml.MessagingResponse;

var request = require('request');

var bodyParser = require('body-parser');

var crypto = require('crypto');

var PRIVATE_KEY = "5f644381d4d0ea3ae569dc9f99b908586ef65c38";
var API_KEY = "f3bd9a20ac1cab3ed3ebb9e0f35d92f5";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/sms', (req, res) => {
  var character = encodeURI(req.body.Body);
  // Start our TwiML response.
    console.log(character);
    var ts = new Date().getTime();
    var hash = crypto.createHash('md5').update(ts + PRIVATE_KEY + API_KEY).digest('hex');
    var url = "https://gateway.marvel.com:443/v1/public/characters?name="+character+"&limit=10&orderBy=name&"+"apikey="+API_KEY+"&ts="+ts+"&hash="+hash;
    request(url,{ json: true }, function(error, response , body){
        const twiml = new MessagingResponse();
        var des = "";
        if(!error){
            des = body.data.results[0].description;
            if(!des)
                des = "No description";
        }else{
            des = error;
        }
        const msg = twiml.message(des);
        res.writeHead(200, {'Content-Type': 'text/xml'});
        res.end(twiml.toString());
    });
});
    
app.listen(3000, function(){
    console.log("Courses API running on 8300");
});