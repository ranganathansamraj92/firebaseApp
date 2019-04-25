import * as functions from 'firebase-functions';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as apipaths from "./api/apipaths";

const app = express(); 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }));



app.use("/v1", apipaths.apiRouter);
exports.api = functions.https.onRequest(app);


exports.usersTriggers = apipaths.usersTriggers.f;
exports.locTrig = apipaths.usersTriggers.locationTrigggers;
exports.registerIdToken = apipaths.usersApis.registerApis.registerTokenTrigger;




