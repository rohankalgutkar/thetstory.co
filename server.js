const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');


const path = require('path');
const port = process.env.PORT || 3001;
var app = express();

// Loading coming soon static assets
app.use(express.static(path.join(__dirname, 'public')));

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
    pageTitle: 'thetstory | Succulents, Terrariums & Home Decor'
  });
});

// About Us Page
app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'thetstory | Succulents, Terrariums & Home Decor'
  });
});

// Contact Us Page
app.get('/contact', (req, res) => {
  res.render('contact.hbs', {
    pageTitle: 'thetstory | Succulents, Terrariums & Home Decor'
  });
});
// Helper for Contact page
app.post('/contact', urlencodedParser, (req, res) => {
  console.log(req.body);

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
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
  });



  res.render('contact.hbs', {
    pageTitle: 'thetstory | Succulents, Terrariums & Home Decor'
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
