const express = require('express');
const bodyParser = require('body-parser');

// create express app
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to AdeM Bulk SMS App"});
});

const couponsRoutes = require('./routes/coupons.routes.js');
const smsRoutes = require('./routes/sms.routes.js');
//const invoicesRoutes = require('./app/routes/invoices.routes.js');
//const readingsRoutes = require('./app/routes/readings.routes.js');
//const promotionsRoutes = require('./app/routes/promotions.routes.js');

// using as middleware
app.use('/coupons', couponsRoutes);
app.use('/sms', smsRoutes);
//app.use('/invoices', invoicesRoutes);
//app.use('/readings', readingsRoutes);
//app.use('/promotions', promotionsRoutes);

// listen for requests
app.listen(4000, () => {
    console.log("Server is listening on port 4000");
});