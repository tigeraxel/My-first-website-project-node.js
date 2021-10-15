


const express = require('express');
const expressHandlebars = require('express-handlebars');
const path = require('path');
const app = express();
app.use(express.static('public'));
app.use(express.static('static'));
app.use(express.urlencoded({
  extended: false
}))
const expressSession = require('express-session')


const blogRouter = require('./routers/blog-router')
const gastbokRouter = require('./routers/gastbok-router')
const kontaktRouter = require('./routers/kontakt-router')



app.use(expressSession({
  secret: "hemlighetenärenhemlighet",
  saveUninitialized: true,
  resave: true,
  // TODO: Save the sessions in a session store.
}))

app.use(function (request, response, next) {
  // Make the session available to all views.
  response.locals.session = request.session
  next()
})

app.use('/Blog', blogRouter)
app.use('/gastbok', gastbokRouter)
app.use('/kontakt', kontaktRouter)

app.get('/loggain', (req, res) => {
  res.render("loggain.hbs");
})

const ADMIN_USERNAME = 'Axel'
const ADMIN_PASSWORD = 'abc123'

app.post('/loggain.hbs', function (request, response) {

  const användarnamn = request.body.användarnamn
  const lösenord = request.body.lösenord

  if (användarnamn == ADMIN_USERNAME && lösenord == ADMIN_PASSWORD) {
      request.session.isLoggedIn = true
      inloggad=1;
      // TODO: Do something better than redirecting to start page.
      response.redirect('/')
  } else {
      // TODO: Display error message to the user.
      response.render('loggain.hbs')
  }

})



app.engine('hbs', expressHandlebars({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  extname: 'hbs'
}));

app.set("view engine", "hbs");
const sqlite = require('sqlite3');
const { response, urlencoded, query } = require('express');


const db = new sqlite.Database('axeltigerberg.db')
db.run(`CREATE TABLE IF NOT EXISTS kontakt(ID INTEGER UNIQUE PRIMARY KEY AUTOINCREMENT,
  namn TEXT NOT NULL,email TEXT,nummer TEXT,meddelande TEXT, 
  datum DATE);`, function (err) {
  if (err) {
    return console.log(err.message)
  }
  else console.log("kontakt table created")
})

db.run(`CREATE TABLE IF NOT EXISTS blog(postID INTEGER UNIQUE PRIMARY KEY AUTOINCREMENT,
  blogförfattare TEXT NOT NULL,blogtitel TEXT NOT NULL,blogtext TEXT NOT NULL, 
  datum DATE);`, function (err) {
  if (err) {
    return console.log(err.message)
  }
  else console.log("Blog table created")
})

db.run(`CREATE TABLE IF NOT EXISTS gästbok(ID INTEGER UNIQUE PRIMARY KEY AUTOINCREMENT,
  namn TEXT NOT NULL,text TEXT,datum DATE);`, function (err) {
  if (err) {
    return console.log(err.message)
  }
  else console.log("gästbok table created")
})








// landing page

app.get('/', (req, res) => {
  const query = "SELECT * FROM gästbok ORDER BY ID DESC LIMIT 3"
  db.all(query, function (error, resultGästbok) {
    if (error) {
      const model = {
        hasDatabaseError: true,
        resultGästbok: []
      }
      res.render("gastbok.hbs", model)
    }
    else {
      const model = {
        hasDatabaseError: false,
        resultGästbok
      }
      console.log(model.resultGästbok)
      res.render("start.hbs", model)
    }
  })
})

app.get('/basic', (req, res) => {
  res.render("basic");
})

app.get('/Start', (req, res) => {
  const query = "SELECT * FROM kommentar ORDER BY ID DESC LIMIT 3"
  db.all(query, function (error, resultGästbok) {
    if (error) {
      const model = {
        hasDatabaseError: true,
        resultGästbok: []
      }
      res.render("gastbok.hbs", model)
    }
    else {
      const model = {
        hasDatabaseError: false,
        resultGästbok
      }
      console.log(model.resultGästbok)
      res.render("start.hbs", model)
    }
  })
})





app.get('/projekt', (req, res) => {
  res.render("projekt");
})

app.get('/createBlogPost', (req, res) => {
  res.render("createBlogPost.hbs");
})


app.post('/', function (request, response) {
  console.log(request.body);
  const name = request.body.Namnstart;
  const comment = request.body.Kommentarstart;
  var datum = new Date();
  datum = datum.toLocaleString();
  const query = "INSERT INTO gästbok (Namn,text,datum) VALUES (?,?,?)";
  const values = [name, comment, datum]

  db.run(query, values, function (error) {

    if (error) {
      hasDatabaseError: true
      console.log("error insert gästbok");
    }
    else {

      response.redirect('/')
    }
  })
})

app.get('/Ommig', (req, res) => {
  res.render("ommig.hbs");
})



app.listen(8080)
