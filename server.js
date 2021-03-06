const express = require('express');
const bodyParser = require('body-parser');
// const MongoClient = require('mongodb').MongoClient;
const mongodb = require('./db/connect');
const contactsRoutes = require('./routes/contacts');
const docsRoutes = require('./routes/docs');

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json())
    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
    })
    .use('/contacts', contactsRoutes)
    .use('/api-docs', docsRoutes);

mongodb.initDb((err, mongodb) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port);
        console.log(`Connected to DB and listening on port ${port}`);
    }
});
