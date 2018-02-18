const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 3001;
var app = express();

// Loading coming soon static assets
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', express.static(__dirname + '/public/'));

hbs.registerPartials(__dirname + '/views/partials/');
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
})
app.set('view engine', 'hbs');

// For logging / debugging
// app.use((req, res, next) => {
//   var now = new Date().toString();
//   var log = `${now}: ${req.method} ${req.url}`;
//   fs.appendFile('server.log', log + '\n', (err) => {
//     console.log('Unable to write to log file');
//   });
// });

app.get('/', (req, res) => {
  res.render('coming-soon/index.hbs');
});

app.get('/dev', (req, res) => {
  res.render('index.hbs', {
    pageTitle: 'thetstory | Succulents, Terrariums & Home Decor'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'thetstory | Succulents, Terrariums & Home Decor'
  });
});

app.get('/contact', (req, res) => {
  res.render('contact.hbs', {
    pageTitle: 'thetstory | Succulents, Terrariums & Home Decor'
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
