const { request } = require('express');
const express = require('express')
const router = express.Router();
const sqlite = require('sqlite3');
const db = new sqlite.Database('axeltigerberg.db')

var csrf = require('csurf')
var csrfProtection = csrf({ cookie: true })


//const mainApp = require("../app")


router.get('/',csrfProtection, (req, res) => {
    const namn = "Axel"
    const query = "SELECT * FROM kontakt"
    db.all(query, function (error, resultKontakt) {
        if (error) {
            const model = {
                hasDatabaseError: true,
                resultKontakt: [],
                csrfToken: req.csrfToken()
            }
            res.render("kontakt.hbs", model)
        }
        else {
            const model = {
                hasDatabaseError: false,
                resultKontakt,
                csrfToken: req.csrfToken()
            }
            console.log(model.resultKontakt)
            res.render("kontakt.hbs", model)
        }
    })
})

router.post('/',csrfProtection, function (request, response) {
    console.log(request.body);
    const namn = request.body.Namn;
    const nummer = request.body.Nummer;
    const email = request.body.email;
    const meddelande = request.body.Meddelande;
    var datum = new Date();
    datum = datum.toLocaleString();
    

    const min_namn_längd = 2;
    const min_text_längd = 10;
    const min_nummer_längd = 5

    const errors = []

    // if (!request.session.isLoggedIn) {
    //     errors.push("Not logged in.")
    //}

    if (!namn) {
        errors.push("Det saknas ett namn.")
    }
    else if (namn.length < min_namn_längd) {
        errors.push("Ditt namn måste vara minst " + min_namn_längd + " tecken.")
    }

    if (!meddelande) {
        errors.push("Det saknas en text.")
    }
    else if (meddelande.length < min_text_längd) {
        errors.push("Din text måste vara minst" + min_text_längd + " tecken.")
    }

    if (!nummer) {
        errors.push("Det saknas ett nummer.")
    }
    else if (nummer.length < min_nummer_längd) {
        errors.push("Ditt nummer måste vara minst " + min_nummer_längd + " tecken.")
    }
    console.log(errors)


    const query = "INSERT INTO kontakt (Namn,Nummer,email,Meddelande,datum) VALUES (?,?,?,?,?)";
    const values = [namn, nummer, email, meddelande, datum]
    if (errors.length == 0) {
        db.run(query, values, function (error) {

            if (error) {
                hasDatabaseError: true
                console.log(values)
                console.log("error insert kontakt");
            }
            else {

                response.render('kontaktSent.hbs')
            }
        })
    }
    else {

        const model = {
            errors,
            resultKontakt: {
                namn,
                nummer,
                email,
                meddelande
            }
            ,csrfToken: request.csrfToken()

        }
        response.render("kontakt.hbs", model)
    }

})


router.get('/:id/update',csrfProtection, function (request, response) {

    const id = request.params.id
    const query = "SELECT * FROM kontakt WHERE ID = ? "


    db.get(query, id, function (error, resultKontakt) {
        if (error) {
            // TODO: Handle error.
            console.log("Error")
            console.log(id)

        }
        else {
            const model = {
                resultKontakt,
                csrfToken: request.csrfToken()
            }
            console.log(query)
            console.log(id)
            response.render('updateKontakt.hbs', model)

        }
    })

})


router.post('/:id/update',csrfProtection, function (request, response) {
    console.log(request.body);

    const namn = request.body.namn;
    const nummer = request.body.nummer;
    const email = request.body.email;
    const meddelande = request.body.Meddelande;
    const ID = request.params.id

    const min_namn_längd = 2;
    const min_text_längd = 10;

    const values = [namn, nummer, email, meddelande, ID];
    console.log(values)
    const query = "UPDATE kontakt SET namn = ?, nummer = ?, email = ?, meddelande = ? WHERE ID=?";
    const errors = []

    if (!request.session.isLoggedIn) {
        errors.push("Inte inloggad.")
    }

    if (!namn) {
        errors.push("Det saknas ett namn.")
    }
    else if (namn.length < min_namn_längd) {
        errors.push("Ditt namn måste vara minst " + min_namn_längd + " tecken.")
    }

    if (!meddelande) {
        errors.push("Det saknas en text.")
    }
    else if (meddelande.length < min_text_längd) {
        errors.push("Din text måste vara minst" + min_text_längd + " tecken.")
    }
    console.log(errors)

    if (errors.length == 0) {
        db.run(query, values, function (error) {

            if (error) {
                hasDatabaseError: true
                console.log("error UPDATE Kontakt");
            }
            else {

                response.redirect('/Kontakt')
            }
        })
    }
    else {

        const model = {
            errors,
            resultKontakt: {
                ID,
                namn,
                email,
                nummer,
                meddelande
            },
            csrfToken: request.csrfToken()
        }
        response.render("updateKontakt.hbs", model)
    }

})


router.get('/:id/delete',csrfProtection, function (request, response) {

    const id = request.params.id
    const query = "SELECT * FROM kontakt WHERE ID = ? "
    const errors = []

        db.get(query, id, function (error, resultKontakt) {
            if (error) {
                // TODO: Handle error.
                console.log("Error")
                console.log(id)

            }
            else {
                const model = {
                    resultKontakt,
                    csrfToken: request.csrfToken()
                }
                console.log(query)
                console.log(id)
                response.render('deleteKontakt.hbs', model)

            }
        })

})


router.post('/:id/delete',csrfProtection, function (request, response) {

    const id = request.params.id
    const query = "DELETE FROM kontakt WHERE ID = ?"
    console.log("försöker ta bort kontakt")
    const errors= []
    if (!request.session.isLoggedIn) {
        errors.push("Inte inloggad.")
    }

    if (errors == 0)
    db.all(query, id, function (error) {
        if (error) {
            // TODO: Handle error.
            console.log("Error")
            console.log(id)

        }
        else {
            response.redirect('/kontakt')

        }
    })
    else {
        const model = {
            errors,
            csrfToken: request.csrfToken()
        }
        console.log(query)
        console.log(id)
        response.render('deleteKontakt.hbs', model)
    }

})



module.exports = router;