const express = require('express');
const hbs = require('hbs');
var app = express();

//app.use(express.static(__dirname + '/public/'));
hbs.registerPartials(__dirname + '/views/partials/');
hbs.registerHelper('getCurrentYear', ()=>{
  return new Date().getFullYear();
})
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
  res.render('index.hbs', {
    pageTitle: 'thetstory | Succulents, Terrariums & Home Decor'
  });
});

app.listen(3001, () => {
  console.log('Server is up on port 3001');
});
