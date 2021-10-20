


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
var bcrypt = require('bcryptjs');

var cookieParser = require('cookie-parser')
var csrf = require('csurf')
app.use(cookieParser("hej"))
var csrfProtection = csrf({ cookie: true })


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


const ADMIN_USERNAME = '$2a$10$Fzv3BL4qUi0AJFhNsQwoEe9RxMSJaN34tldi7YVQhCU8gDjMD0tvq'
const ADMIN_PASSWORD = '$2a$10$WSBKk9IYS19ekjJyoU2z2uJy4ueQvEEVMnq/IXh05BVlea0pcHrlS'

//async function getHashCode(){
//const username= await bcrypt.hash('Axel',10)
//const password = await bcrypt.hash('123',10)
//console.log("USERNAME =" + username)
//console.log("PASSWORD =" + password)
//}

//getHashCode();


app.get('/loggain', (req, res) => {
  res.render("loggain.hbs");
})


app.post('/loggain', async function (request, response) {

  const användarnamn = request.body.användarnamn
  const lösenord = request.body.lösenord

  const validPassword= await bcrypt.compare(lösenord,ADMIN_PASSWORD)
  const validUsername= await bcrypt.compare(användarnamn,ADMIN_USERNAME)

  if (validPassword && validUsername) {
    request.session.isLoggedIn = true
    // TODO: Do something better than redirecting to start page.
    response.redirect('/')
  } else {
    const model = {
      Ogiltig: true,
      
    }
    // TODO: Display error message to the user.
    response.render('loggain.hbs',model)
  }

})

app.post('/loggaut', async function (request, response) {

    request.session.isLoggedIn = false
 
    response.redirect('/')

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



db.run(`CREATE TABLE IF NOT EXISTS accounts(ID INTEGER UNIQUE PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,password TEXT NOT NULL);`, function (err) {
  if (err) {
    return console.log(err.message)
  }
  else console.log("accounts table created")
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
  db.all(query, function (error, resultGastbok) {
    if (error) {
      const model = {
        hasDatabaseError: true,
        resultGastbok: []
      }
      res.render("gastbok.hbs", model)
    }
    else {
      const model = {
        hasDatabaseError: false,
        resultGastbok
      }
      console.log(model.resultGastbok)
      res.render("start.hbs", model)
    }
  })
})





app.post('/', function (request, response) {
  console.log(request.body);
  const namn = request.body.namn;
  const text = request.body.text;
  var datum = new Date();
  datum = datum.toLocaleString();
  const min_skribentnamn_längd = 2;
  const min_text_längd = 10;

  const values = [namn, text, datum]

  console.log(values)
  const query = "INSERT INTO gästbok (Namn,text,datum) VALUES (?,?,?)";
  const errors = []

  //if (!request.session.isLoggedIn) {
  //    errors.push("Not logged in.")
  //}

  if (!namn) {
    errors.push("Det saknas ett namn.")
  }
  else if (namn.length < min_skribentnamn_längd) {
    errors.push("Ditt namn måste vara minst " + min_skribentnamn_längd + " tecken.")
  }

  if (!text) {
    errors.push("Det saknas en text.")
  }
  else if (text.length < min_text_längd) {
    errors.push("Din text måste vara minst" + min_text_längd + " tecken.")
  }
  console.log(errors)

  if (errors.length == 0) {
    db.run(query, values, function (error) {

      if (error) {
        hasDatabaseError: true
        console.log("error insert gästbokkommentar");
      }
      else {

        response.redirect('/')
      }
    })
  }
  else {

    const model = {
      errors,
      resultGastbok: {
        namn,
        text
      }
    }
    response.render("start.hbs", model)
  }

})

app.get('/Ommig', (req, res) => {
  res.render("ommig.hbs");
})


app.listen(8080)
