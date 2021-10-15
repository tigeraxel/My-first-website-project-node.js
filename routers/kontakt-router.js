const express = require('express')
const router = express.Router();
const sqlite = require('sqlite3');
const db = new sqlite.Database('axeltigerberg.db')

router.get('/', (req, res) => {
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

router.post('/', function (request, response) {
    console.log(request.body);
    const name = request.body.Namn;
    const nummer = request.body.Nummer;
    const email = request.body.email;
    const meddelande = request.body.Meddelande;
    var datum = new Date();
    datum = datum.toLocaleString();


    const query = "INSERT INTO kontakt (Namn,Nummer,email,Meddelande,datum) VALUES (?,?,?,?,?)";
    const values = [name, nummer, email, meddelande, datum]

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
})


router.get('/:id/update', function (request, response) {

    const id = request.params.id
    const query = "SELECT * FROM kontakt WHERE ID = ? "


    db.all(query, id, function (error, resultKontakt) {
        if (error) {
            // TODO: Handle error.
            console.log("Error")
            console.log(id)

        }
        else {
            const model = {
                resultKontakt
            }
            console.log(query)
            console.log(id)
            response.render('updateKontakt.hbs', model)

        }
    })

})


router.post('/:id/update', function (request, response) {
    console.log(request.body);

    const namn = request.body.namn;
    const nummer = request.body.nummer;
    const email = request.body.email;
    const meddelande = request.body.Meddelande;
    const ID = request.params.id

    const min_namn_längd = 2;
    const min_text_längd = 10;

    const values = [namn, nummer,email,meddelande,ID];
    console.log(values)
    const query = "UPDATE kontakt SET namn = ?, nummer = ?, email = ?, meddelande = ? WHERE ID=?";
    const errors = []

    //if (!request.session.isLoggedIn) {
    //    errors.push("Not logged in.")
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
            resultKontakt : {
            ID,
            namn,
            email,
            nummer,
            meddelande
            }
        }
        response.render("updateKontakt.hbs", model)
    }

})







module.exports = router;