require('dotenv').config();
const express = require('express');
const { dump } = require('dumper.js');
const axios = require('axios');
const app = express();
app.use(express.json());
app.set('port', process.env.PORT);
app.set("token", process.env.TOKEN);

app.get('/', function (req, res) {
    const { params, query, headers } = req;
    res.send({ params, query, headers });
});
app.get("/callback", function (req, res) {
    const { access_token, oaId } = req.query;
    // const token = app.get("token");
    app.set("token", access_token);
    res.status(200).send(access_token);
})

app.get("/webhook", function (req, res) {
    res.status(200).send("OK");
});
app.post("/webhook", function (req, res) {
    const event = req.body;
    hookProcess(event);
    res.status(200).send("OK");
});
function hookProcess(event) {
    dump(event);
    switch (event.event_name) {
        case "user_send_text":
            textProcess(event);
            break;
        default:
            break;
    }
}
function textProcess(event) {
    const senderId = event.sender.id;
    const messageText = event.message.text;
    console.log(`User ${senderId} send text "${messageText}"`);
    axios({
        method: "POST",
        url: "https://openapi.zalo.me/v2.0/oa/message",
        params: {
            access_token: app.get("token")
        },
        data: {
            recipient: {
                user_id: senderId
            },
            message: {
                text: messageText
            }
        }
    })
        .then(e => console.log(e.data))
}
app.listen(app.get('port'), function () {
    console.log("Listening in port %d", app.get('port'));
});