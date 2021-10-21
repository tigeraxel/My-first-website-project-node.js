const { request } = require('express');
const express = require('express')
const router = express.Router();
const sqlite = require('sqlite3');
const db = new sqlite.Database('axeltigerberg.db')

var csrf = require('csurf')
var csrfProtection = csrf({ cookie: true })


//const mainApp = require("../app")


router.get('/', csrfProtection, (req, res) => {

    const query = "SELECT * FROM contact ORDER BY date DESC"
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

router.post('/', csrfProtection, function (request, response) {
    console.log(request.body);
    const name = request.body.Namn;
    const phonenumber = request.body.Nummer;
    const email = request.body.email;
    const message = request.body.Meddelande;
    var date = new Date();
    date = date.toLocaleString();


    const min_namn_längd = 2;
    const min_text_längd = 10;
    const min_nummer_längd = 5

    const errors = []

    // if (!request.session.isLoggedIn) {
    //     errors.push("Not logged in.")
    //}

    if (!name) {
        errors.push("Det saknas ett namn.")
    }
    else if (name.length < min_namn_längd) {
        errors.push("Ditt namn måste vara minst " + min_namn_längd + " tecken.")
    }

    if (!message) {
        errors.push("Det saknas en text.")
    }
    else if (message.length < min_text_längd) {
        errors.push("Din text måste vara minst" + min_text_längd + " tecken.")
    }

    if (!phonenumber) {
        errors.push("Det saknas ett nummer.")
    }
    else if (phonenumber.length < min_nummer_längd) {
        errors.push("Ditt nummer måste vara minst " + min_nummer_längd + " tecken.")
    }
    console.log(errors)


    const query = "INSERT INTO contact (name,phonenumber,email,message,date) VALUES (?,?,?,?,?)";
    const values = [name, phonenumber, email, message, date]
    if (errors.length == 0) {
        db.run(query, values, function (error) {

            if (error) {
                hasDatabaseError: true
                console.log(values)
                console.log("error insert kontakt");
                errors.push("internt databas fel")
                const model = {
                    errors,
                    resultKontakt: {
                        name,
                        phonenumber,
                        email,
                        message
                    }
                    , csrfToken: request.csrfToken()
                }
                response.render("kontakt.hbs", model)
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
                name,
                phonenumber,
                email,
                message
            }
            , csrfToken: request.csrfToken()

        }
        response.render("kontakt.hbs", model)
    }

})


router.get('/:id/update', csrfProtection, function (request, response) {

    const id = request.params.id
    const query = "SELECT * FROM contact WHERE ID = ? "
    var errors = []

    db.get(query, id, function (error, resultKontakt) {
        if (error) {
            // TODO: Handle error.
            console.log("Error")
            console.log(id)
            errors.push("internt databas fel")
            const model = {
                errors,
                resultKontakt: {
                    name,
                    phonenumber,
                    email,
                    message
                }
                , csrfToken: request.csrfToken()
            }
            response.render("updateKontakt.hbs", model)


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


router.post('/:id/update', csrfProtection, function (request, response) {
    console.log(request.body);

    const name = request.body.namn;
    const phonenumber = request.body.nummer;
    const email = request.body.email;
    const message = request.body.Meddelande;
    const ID = request.params.id

    const min_namn_längd = 2;
    const min_text_längd = 10;

    const values = [name, phonenumber, email, message, ID];
    console.log(values)
    const query = "UPDATE contact SET name = ?, phonenumber = ?, email = ?, message = ? WHERE ID=?";
    const errors = []

    if (!request.session.isLoggedIn) {
        errors.push("Inte inloggad.")
    }

    if (!name) {
        errors.push("Det saknas ett namn.")
    }
    else if (name.length < min_namn_längd) {
        errors.push("Ditt namn måste vara minst " + min_namn_längd + " tecken.")
    }

    if (!message) {
        errors.push("Det saknas en text.")
    }
    else if (message.length < min_text_längd) {
        errors.push("Din text måste vara minst" + min_text_längd + " tecken.")
    }
    console.log(errors)

    if (errors.length == 0) {
        db.run(query, values, function (error) {

            if (error) {
                hasDatabaseError: true
                console.log("error UPDATE Kontakt");
                errors.push("internt databas fel")
                const model = {
                    errors,
                    resultKontakt: {
                        name,
                        phonenumber,
                        email,
                        message
                    }
                    , csrfToken: request.csrfToken()
                }
                response.render("updateKontakt.hbs", model)
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
                name,
                email,
                phonenumber,
                message
            },
            csrfToken: request.csrfToken()
        }
        response.render("updateKontakt.hbs", model)
    }

})


router.get('/:id/delete', csrfProtection, function (request, response) {

    const id = request.params.id
    const query = "SELECT * FROM contact WHERE ID = ? "
    const errors = []

    db.get(query, id, function (error, resultKontakt) {
        if (error) {
            // TODO: Handle error.
            console.log("Error")
            console.log(id)
            errors.push("internt databas fel")
            const model = {
                errors,
                resultKontakt: {
                    name,
                    phonenumber,
                    email,
                    message
                }
                , csrfToken: request.csrfToken()
            }
            response.render("deleteKontakt.hbs", model)

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


router.post('/:id/delete', csrfProtection, function (request, response) {

    const id = request.params.id
    const query = "DELETE FROM contact WHERE ID = ?"
    console.log("försöker ta bort kontakt")
    const errors = []
    if (!request.session.isLoggedIn) {
        errors.push("Inte inloggad.")
    }

    if (errors == 0)
        db.all(query, id, function (error) {
            if (error) {
                // TODO: Handle error.
                console.log("Error")
                console.log(id)
                errors.push("internt databas fel")
                const model = {
                    errors,
                    resultKontakt: {
                        name,
                        phonenumber,
                        email,
                        message
                    }
                    , csrfToken: request.csrfToken()
                }
                response.render("deleteKontakt.hbs", model)
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