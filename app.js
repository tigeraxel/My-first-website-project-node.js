const kontakterdata = require('./Kontakter-data');

const express = require('express');
const expressHandlebars = require('express-handlebars');
const path = require('path');
const app = express();
app.use(express.static('static'));

app.engine('hbs', expressHandlebars({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  extname: 'hbs'
}));
app.set("view engine", "hbs");
const sqlite= require('sqlite3')

const db = new sqlite.Database('axeltigerberg.db')

db.run();





// landing page
app.get('/', (req, res) => {
  res.render('start');
})

app.get('/basic', (req, res) => {
  res.render("basic");
})

app.get('/Start.hbs', (req, res) => {
  res.render("start");
})

app.get('/Blogg.hbs', (req, res) => {
  res.render("blogg");
})

app.get('/ommig.hbs', (req, res) => {
  res.render("ommig");
})

app.get('/projekt.hbs', (req, res) => {
  res.render("projekt");
})
app.get('/kontakter.hbs', function(request, response){
  const model = {
    kontakter: kontakterdata.kontakter
  }
  response.render("visa-alla-kontakter.hbs", model)
})

app.get('/gastbok.hbs', (req, res) => {
  res.render("gastbok");
})

app.get('/loggain.hbs', (req, res) => {
  res.render("loggain");
})

app.listen(8080)