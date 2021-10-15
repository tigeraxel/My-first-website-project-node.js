const express = require('express')
const router = express.Router();
const sqlite = require('sqlite3');
const db = new sqlite.Database('axeltigerberg.db')


router.get('/', (req, res) => {
    const query = "SELECT * FROM gästbok ORDER BY datum DESC"
    db.all(query, function (error, resultGastbok) {
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
          resultGastbok
        }
        console.log(model.resultGastbok)
        res.render("gastbok.hbs", model)
      }
    })
  })
  
  
  router.post('/', function (request, response) {
    console.log(request.body);
    const name = request.body.Namn;
    const comment = request.body.text;
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
  
        response.redirect('gastbok')
      }
    })
  })


  router.get('/:id/delete', function (request, response) {

    const id = request.params.id
    const query = "SELECT * FROM gästbok WHERE ID = ? "


    db.all(query, id, function (error, resultGästbok) {
        if (error) {
            // TODO: Handle error.
            console.log("Error")
            console.log(id)

        }
        else {
            const model = {
                resultGästbok
            }
            console.log(query)
            console.log(id)
            response.render('deletegastbok.hbs', model)

        }
    })

})


router.get('/:id/update', function (request, response) {

    const id = request.params.id
    const query = "SELECT * FROM gästbok WHERE ID = ? "


    db.all(query, id, function (error, resultGastbok) {
        if (error) {
            // TODO: Handle error.
            console.log("Error")
            console.log(id)

        }
        else {
            const model = {
                resultGastbok
            }
            console.log(query)
            console.log(id)
            response.render('updategastbok.hbs', model)

        }
    })

})


router.post('/:id/update', function (request, response) {
    console.log(request.body);

    const namn = request.body.namn;
    const text = request.body.text;
    const ID = request.params.id

    const min_skribentnamn_längd = 2;
    const min_text_längd = 10;

    const values = [namn, text, ID];
    console.log(values)
    const query = "UPDATE gästbok SET namn = ?, text = ? WHERE ID=?";
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
                console.log("error UPDATE gästbokinlägg");
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
                namn,
                text,
                ID
            }
        }
        response.render("updategastbok.hbs", model)
    }

})

router.post('/:id/delete', function (request, response) {

    const id = request.params.id
    const query = "DELETE FROM gästbok WHERE ID = ?"
    console.log("försöker ta bort gästbokinlägg")

    db.all(query, id, function (error) {
        if (error) {
            // TODO: Handle error.
            console.log("Error")
            console.log(id)

        }
        else {
            response.redirect('/gastbok')

        }
    })

})

module.exports = router;