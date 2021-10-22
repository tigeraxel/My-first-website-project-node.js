const express = require('express')
const router = express.Router();
const sqlite = require('sqlite3');
const db = new sqlite.Database('axeltigerberg.db')

var csrf = require('csurf')
var csrfProtection = csrf({ cookie: true })

const min_skribentnamn_längd = 2;
const min_text_längd = 10;


router.get('/',csrfProtection, (req, res) => {
    const query = "SELECT * FROM guestbook ORDER BY date DESC"
    db.all(query, function (error, resultGastbok) {
      if (error) {
        const model = {
          hasDatabaseError: true,
          resultGästbok: [],
          csrfToken: req.csrfToken()
        }
        res.render("gastbok.hbs", model)
      }
      else {
        const model = {
          hasDatabaseError: false,
          resultGastbok,
          csrfToken: req.csrfToken()
        }
        console.log(model.resultGastbok)
        res.render("gastbok.hbs", model)
      }
    })
  })
  

  router.post('/',csrfProtection, function (request, response) {
    console.log(request.body);

    const name = request.body.namn;
    const text = request.body.text;
    var date = new Date();
    date = date.toLocaleString();

    const values = [name, text,date];
    console.log(values)
    const query = "INSERT INTO guestbook (name,text,date) VALUES (?,?,?)";
    const errors = []

    //if (!request.session.isLoggedIn) {
    //    errors.push("Not logged in.")
    //}

    if (!name) {
        errors.push("Det saknas ett namn.")
    }
    else if (name.length < min_skribentnamn_längd) {
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
                console.log("error insert gästbok");
                errors.push("internt databas fel")
                const model = {
                errors,
                csrfToken: request.csrfToken()
                
                }
                
            response.render("gastbok.hbs", model)
            }
            else {

                response.redirect('/gastbok')
            }
        })
    }
    else {

        const model = {
            errors,
            resultGastbok: {
                name,
                text,
                date
            },
            csrfToken: request.csrfToken()

        }
        response.render("gastbok.hbs", model)
    }

})


  router.get('/:id/delete',csrfProtection, function (request, response) {

    const id = request.params.id
    const query = "SELECT * FROM guestbook WHERE ID = ? "
    const errors = []
 
    db.get(query, id, function (error, resultGästbok) {
        if (error) {
            // TODO: Handle error.
            console.log("Error")
            console.log(id)
            errors.push("internt databas fel")
            const model = {
                errors,
                csrfToken: request.csrfToken()
                
                }
                
            response.render("deletegastbok.hbs", model)

        }
        else {
            const model = {
                resultGästbok,
                csrfToken: request.csrfToken()

            }
            console.log(query)
            console.log(id)
            response.render('deletegastbok.hbs', model)

        }
    })

})


router.get('/:id/update',csrfProtection, function (request, response) {

    const id = request.params.id
    const query = "SELECT * FROM guestbook WHERE ID = ? "

    var errors=[]
    db.get(query, id, function (error, resultGastbok) {
        if (error) {
            // TODO: Handle error.
            console.log("Error")
            console.log(id)
            errors.push("internt databas fel")
            const model = {
                errors,
                csrfToken: request.csrfToken()
                
                }
                
            response.render("updateGastbok.hbs", model)

        }
        else {
            const model = {
                resultGastbok,
                csrfToken: request.csrfToken()
            }
            console.log(query)
            console.log(id)
            response.render('updateGastbok.hbs', model)

        }
    })

})


router.post('/:id/update',csrfProtection, function (request, response) {
    console.log(request.body);

    const name = request.body.namn;
    const text = request.body.text;
    const ID = request.params.id

    const values = [name, text, ID];
    console.log(values)
    const query = "UPDATE guestbook SET name = ?, text = ? WHERE ID=?";
    const errors = []

    if (!request.session.isLoggedIn) {
        errors.push("Inte inloggad.")
    }

    if (!name) {
        errors.push("Det saknas ett namn.")
    }
    else if (name.length < min_skribentnamn_längd) {
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
                console.log("error UPDATE gästbokinlägg");
                errors.push("internt databas fel")
                const model = {
                errors,
                csrfToken: request.csrfToken()
                
                }
                
            response.render("updateGastbok.hbs", model)
                
            }
            else {

                response.redirect('/gastbok')
            }
        })
    }
    else {

        const model = {
            errors,
            resultGastbok: {
                name,
                text,
                ID
            },
            csrfToken: request.csrfToken()

        }
        response.render("updateGastbok.hbs", model)
    }

})

router.post('/:id/delete',csrfProtection, function (request, response) {

    const id = request.params.id
    const query = "DELETE FROM guestbook WHERE ID = ?"
    console.log("försöker ta bort gästbokinlägg")
    const errors= []

    if (!request.session.isLoggedIn) {
        errors.push("Not logged in.")
    }

    if(errors==0)
    db.get(query, id, function (error) {
        if (error) {
            // TODO: Handle error.
            console.log("Error")
            console.log(id)
            errors.push("internt databas fel")
            const model = {
                errors,
                csrfToken: request.csrfToken()
                
                }
                
            response.render("deletegastbok.hbs", model)

        }
        else {
            response.redirect('/gastbok')

        }
    })
    else{

        const model = {
            errors,
            csrfToken: request.csrfToken()
        }
        response.render("deletegastbok.hbs", model)
    }

})

module.exports = router;