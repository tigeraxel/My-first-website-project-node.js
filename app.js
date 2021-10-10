const kontakterdata = require('./Kontakter-data');

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

app.use(expressSession({
	secret: "hemlighetenärenhemlighet",
	saveUninitialized: false,
	resave: false,
	// TODO: Save the sessions in a session store.
}))

app.use(function(request, response, next){
	// Make the session available to all views.
	response.locals.session = request.session
	next()
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

db.run(`CREATE TABLE IF NOT EXISTS kommentar(ID INTEGER UNIQUE PRIMARY KEY AUTOINCREMENT,
  namn TEXT NOT NULL,kommentar TEXT,datum DATE);`, function (err) {
  if (err) {
    return console.log(err.message)
  }
  else console.log("kommentar table created")
})








// landing page

app.get('/', (req, res) => {
  const query = "SELECT * FROM kommentar ORDER BY ID DESC LIMIT 3"
  db.all(query, function (error, resultKommentar) {
    if (error) {
      const model = {
        hasDatabaseError: true,
        resultKommentar: []
      }
      res.render("gastbok.hbs", model)
    }
    else {
      const model = {
        hasDatabaseError: false,
        resultKommentar
      }
      console.log(model.resultKommentar)
      res.render("start.hbs", model)
    }
  })
})

app.get('/basic', (req, res) => {
  res.render("basic");
})

app.get('/Start', (req, res) => {
  const query = "SELECT * FROM kommentar ORDER BY ID DESC LIMIT 3"
  db.all(query, function (error, resultKommentar) {
    if (error) {
      const model = {
        hasDatabaseError: true,
        resultKommentar: []
      }
      res.render("gastbok.hbs", model)
    }
    else {
      const model = {
        hasDatabaseError: false,
        resultKommentar
      }
      console.log(model.resultKommentar)
      res.render("start.hbs", model)
    }
  })
})


app.get('/blog', (req, res) => {
  const query = "SELECT * FROM blog ORDER BY datum DESC"
  db.all(query, function (error, resultBlog) {
    if (error) {
      const model = {
        hasDatabaseError: true,
        resultBlog: []
      }
      res.render("blog.hbs", model)
    }
    else {
      const model = {
        hasDatabaseError: false,
        resultBlog
      }
      console.log(model.resultBlog)
      res.render("Blog.hbs", model)
    }
  })
})

app.get('/Kontakt', (req, res) => {
  const namn = "Axel"
  const query = "SELECT * FROM kontakt"
  db.all(query, function (error, resultKontakt) {
    if (error) {
      const model = {
        hasDatabaseError: true,
        resultKontakt: []
      }
      res.render("kontakt.hbs", model)
    }
    else {
      const model = {
        hasDatabaseError: false,
        resultKontakt
      }
      console.log(model.resultKontakt)
      res.render("kontakt.hbs", model)
    }
  })
})

app.post('/kontakt', function (request, response) {
  console.log(request.body);
  const name = request.body.Namn;
  const nummer = request.body.Nummer;
  const email = request.body.email;
  const meddelande = request.body.Meddelande;
  var datum = new Date();
  datum = datum.toLocaleString();
  

  const query = "INSERT INTO kontakt (Namn,Nummer,email,Meddelande,datum) VALUES (?,?,?,?,?)";
  const values = [name,nummer,email,meddelande,datum]

  db.run(query, values, function (error){

    if (error) {
      hasDatabaseError:true
      console.log("error insert kontakt");
    } 
    else {

      response.redirect('kontakt')
    }
  })
})


app.post('/createBlogPost', function (request, response) {
  console.log(request.body);
  const blogförfattare = request.body.blogförfattare;
  const blogtitel = request.body.blogtitel;
  const blogtext = request.body.blogtext;
  var datum = new Date();
  datum = datum.toLocaleString();
  
  const values = [blogförfattare,blogtitel,blogtext,datum];
  console.log(values)
  const query = "INSERT INTO blog (blogförfattare,blogtitel,blogtext,datum) VALUES (?,?,?,?)";
  
  

  db.run(query, values, function (error){

    if (error) {
      hasDatabaseError:true
      console.log("error insert blog");
    } 
    else {

      response.redirect('blog')
    }
  })
})


app.get('/projekt', (req, res) => {
  res.render("projekt");
})

app.get('/createBlogPost', (req, res) => {
  res.render("createBlogPost.hbs");
})


app.get('/gastbok', (req, res) => {
  const query = "SELECT * FROM kommentar"
  db.all(query, function (error, resultKommentar) {
    if (error) {
      const model = {
        hasDatabaseError: true,
        resultKommentar: []
      }
      res.render("gastbok.hbs", model)
    }
    else {
      const model = {
        hasDatabaseError: false,
        resultKommentar
      }
      console.log(model.resultKommentar)
      res.render("gastbok.hbs", model)
    }
  })
})


app.post('/gastbok', function (request, response) {
  console.log(request.body);
  const name = request.body.Namn;
  const comment = request.body.Kommentar;
  var datum = new Date();
  datum = datum.toLocaleString();

  const query = "INSERT INTO kommentar (Namn,Kommentar,datum) VALUES (?,?,?)";
  const values = [name, comment,datum]
  

  db.run(query, values, function (error){

    if (error) {
      hasDatabaseError:true
      console.log("error insert kommentar");
    } 
    else {

      response.redirect('gastbok')
    }
  })
})

app.post('/start', function (request, response) {
  console.log(request.body);
  const name = request.body.Namnstart;
  const comment = request.body.Kommentarstart;
  var datum = new Date();
  datum = datum.toLocaleString();
  const query = "INSERT INTO kommentar (Namn,Kommentar,datum) VALUES (?,?,?)";
  const values = [name, comment,datum]

  db.run(query, values, function (error){

    if (error) {
      hasDatabaseError:true
      console.log("error insert kommentar");
    } 
    else {

      response.redirect('start')
    }
  })
})

app.get('/Ommig', (req, res) => {
    res.render("ommig.hbs");
  })

app.get('/loggain', (req, res) => {
    res.render("loggain.hbs");
  })

  const ADMIN_USERNAME = 'Axel'
  const ADMIN_PASSWORD = 'abc123'

  app.post('/loggain.hbs', function(request, response){
	
    const användarnamn = request.body.användarnamn
    const lösenord = request.body.lösenord
    
    if(användarnamn == ADMIN_USERNAME && lösenord == ADMIN_PASSWORD){
      request.session.isLoggedIn = true
      // TODO: Do something better than redirecting to start page.
      response.redirect('/')
    }else{
      // TODO: Display error message to the user.
      response.render('loggain.hbs')
    }
    
  })

  app.get('/Blog/:id', function(request, response){
    
    
    const query = "SELECT * FROM blog WHERE postID = ? LIMIT 1"
    const id = request.params.id
    
    db.all(query, id, function(error, resultBlogpost){
      if(error){
      // TODO: Handle error.
      console.log("Error")
      console.log(id)

    }
    else{
      const model = {
        resultBlogpost
      }
      console.log(query)
      console.log(id)
    
      response.render('blogPost.hbs', model)
    }
    })
    
  })


app.listen(8080)