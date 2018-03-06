const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const logger = require('./Logger');


const path = require('path');
const port = process.env.PORT || 3001;

const dbName = process.env.MONGODB_NAME; //prod
// const dbName = 'tstorydb'; //dev
var app = express();
var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGODB_URI;
// var url = "mongodb://heroku_p2tgc0fn:ao412v43bh8tmpi2us46oceifk@ds153978.mlab.com:53978/heroku_p2tgc0fn"; //prod
// var url = "mongodb://localhost:27017/"; //dev

// Loading coming soon static assets
app.use(express.static(path.join(__dirname, 'public')));

//defining HTML string with list of active products for global use
app.use(function(req, res, next) {
  getAllProducts(function(err, data) {
    var menuHTML = ``;
    if (data.length > 0) {
      menuHTML = `<ul>`;
      menuHTML += `<li><strong>` + data[0].Category + `</strong></li>`;
      if (data.length == 1)
        menuHTMl += `</ul>`;
      else {
        for(var itrData = 0; itrData < data.length; itrData ++) {
          menuHTML += `<li><a href="/product/` + data[itrData].SKU + `">` + data[itrData].Description + `</a></li>`;
          if (itrData == data.length - 1 || data[itrData].Category != data[itrData + 1].Category) {
            menuHTML += `</ul>`;
          }
        }
      }
    }
    res.productMenu = menuHTML;
    next();
  });
});

//get all products from db ordered by Category and Description
var getAllProducts = function(callback) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
logger.logError('Unable to connect to the mongoDB server. Error:' + err.message);
}else{
    var dbo = db.db(dbName);
    dbo.collection("SKU_Master").find({$query: {IsActive : 'Y'}, $orderby: {Category:1, Description:1}}).toArray( function(err, result) {
      if (err) throw err;
      if (result) {
        callback(null, result);
      }
      db.close();
    });
  }
  });
};

// body parsing for POST requests
var urlencodedParser = bodyParser.urlencoded({
  extended: false
})

hbs.registerPartials(__dirname + '/views/partials/');
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
})
app.set('view engine', 'hbs');

// Home page (Currenctly coming-soon)
app.get('/', (req, res) => {
  res.render('coming-soon/index.hbs');
});

// Home Page
app.get('/dev', (req, res) => {
  res.render('index.hbs', {
    pageTitle: 'thetstory | Succulents, Terrariums & Home Decor',
    productMenu: res.productMenu
  });
});

// About Us Page
app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'thetstory | Succulents, Terrariums & Home Decor',
    productMenu: res.productMenu
  });
});

// Home Page
app.get('/privacy-policy', (req, res) => {
  res.render('privacy-policy.hbs', {
    pageTitle: 'thetstory | Succulents, Terrariums & Home Decor',
    productMenu: res.productMenu
  });
});

// Contact Us Page
app.get('/contact', (req, res) => {
  res.render('contact.hbs', {
    pageTitle: 'thetstory | Succulents, Terrariums & Home Decor',
    productMenu: res.productMenu
  });
});
// Helper for Contact page
app.post('/contact', urlencodedParser, (req, res) => {
  logger.logInfo(req.body);

  var htmlBody = `
<p>You've got a contact request from the Contact page</p>
<h3>Contact Details</h3>
<ul>
  <li>Name: ${req.body.name}</li>
  <li>Phone: ${req.body.phone}</li>
  <li>Email: ${req.body.email}</li>
</ul>
<h3>Message</h3>
<p>${req.body.message}</p>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'bh-74.webhostbox.net',
    port: 465,
    secure: true,
    auth: {
      user: 'contact@thetstory.co',
      pass: 'd_A7[3}lDwhK'
    }
    // ---- Only for dev setups
    ,
    tls: {
      rejectUnauthorized: false
    }

    // ----
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"thetstoryco Contact Us" <contact@thetstory.co>', // sender address
    to: 'hello@thetstory.co', // list of receivers
    subject: 'Contact form message', // Subject line
    html: htmlBody // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return logger.logError(error.message);
    }
    logger.logInfo('Message sent: %s', info.messageId);
  });

  res.render('contact.hbs', {
    pageTitle: 'thetstory | Succulents, Terrariums & Home Decor',
    productMenu: res.productMenu
  });
});

//load record for SKU from DB
var loadProduct = function(sku, callback) {
  MongoClient.connect(url, function(err, db) {
    if (err)
      logger.logError('Error while retrieving Product from DB : ' + err.message);
    else {
      var dbo = db.db(dbName);
      dbo.collection("SKU_Master").findOne({SKU: sku}, function(err, result) {
        if (err) throw err;
        if (result)
          callback(null, result);
        db.close();
      });
    }
  });
};

//Product page
app.get('/product/:SKU', (req, res) => {
  var sku = req.params['SKU'];
  var data = loadProduct(sku,function (err, data) {
    if (err)
      logger.logError('Error while loading Product for routing : ' + err.message);
    else {
      res.render('product.hbs', {
        pageTitle: 'thetstory | Succulents, Terrariums & Home Decor',
        productMenu: res.productMenu,
        description: data.Description,
        currency: data.Currency,
        price: data.Price,
        category: data.Category
      })
    }
  });
});

app.listen(port, () => {
  logger.logInfo(`Server is up on port ${port}`);
});
