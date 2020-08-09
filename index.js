require('dotenv').config();
const express = require("express");
const { dump } = require('dumper.js');
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
    dump(req.body);
    res.status(200).send("OK");
});


app.listen(app.get('port'), function () {
    console.log("Listening in port %d", app.get('port'));
});