const express = require('express')
const db = require('../database')

const router = express.Router()





router.get('/loggain', (req, res) => {
    res.render("loggain.hbs");
})

const ADMIN_USERNAME = 'Axel'
const ADMIN_PASSWORD = 'abc123'

router.post('/loggain.hbs', function (request, response) {

    const användarnamn = request.body.användarnamn
    const lösenord = request.body.lösenord

    if (användarnamn == ADMIN_USERNAME && lösenord == ADMIN_PASSWORD) {
        request.session.isLoggedIn = true
        // TODO: Do something better than redirecting to start page.
        response.redirect('/')
    } else {
        // TODO: Display error message to the user.
        response.render('loggain.hbs')
    }

})





module.exports = router