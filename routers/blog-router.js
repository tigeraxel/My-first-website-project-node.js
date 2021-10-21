const express = require('express')
const router = express.Router();
const sqlite = require('sqlite3');
const db = new sqlite.Database('axeltigerberg.db')

var csrf = require('csurf')
var csrfProtection = csrf({ cookie: true })

router.get('/', (req, res) => {
    const query = "SELECT * FROM blog ORDER BY date DESC"
    db.all(query, function (error, resultBlog) {
        if (error) {
            const model = {
                hasDatabaseError: true,
                resultBlog: [],


            }
            res.render("blog.hbs", model)
        }
        else {
            const model = {
                hasDatabaseError: false,
                resultBlog
            }
            console.log(model.resultBlog)
            res.render("blog.hbs", model)
        }
    })
})

router.get('/createBlogPost', csrfProtection, (req, res) => {
    const model = {
        csrfToken: req.csrfToken()
    }
    res.render("createBlogPost.hbs", model);
})

router.post('/createBlogPost', csrfProtection, function (request, response) {
    console.log(request.body);
    const writer = request.body.blogförfattare;
    const title = request.body.blogtitel;
    const text = request.body.blogtext;
    var date = new Date();
    date = date.toLocaleString();
    const min_skribentnamn_längd = 2;
    const min_titel_längd = 2;
    const min_text_längd = 10;

    const values = [writer, title, text, date];
    console.log(values)
    const query = "INSERT INTO blog (writer,title,text,date) VALUES (?,?,?,?)";
    const errors = []

    if (!request.session.isLoggedIn) {
        errors.push("Inte inloggad.")
    }

    if (!writer) {
        errors.push("Det saknas en skrivbent.")
    }
    else if (writer.length < min_skribentnamn_längd) {
        errors.push("Ditt skrivbentnamn måste vara minst " + min_skribentnamn_längd + " tecken.")
    }

    if (!title) {
        errors.push("Det saknas en blogtitel.")
    }
    else if (title.length < min_titel_längd) {
        errors.push("Din titel måste vara minst" + min_titel_längd + " tecken.")
    }

    if (!text) {
        errors.push("Det saknas en blogtext.")
    }
    else if (text.length < min_text_längd) {
        errors.push("Din text måste vara minst" + min_text_längd + " tecken.")
    }
    console.log(errors)

    if (errors.length == 0) {
        db.run(query, values, function (error) {

            if (error) {
                hasDatabaseError: true
                console.log("error insert blog");
                errors.push("internt databas fel")
                const model = {
                    errors,
                    csrfToken: request.csrfToken()

                }

                response.render("createBlogPost.hbs", model)
            }
            else {

                response.redirect('/Blog')
            }
        })
    }
    else {

        const model = {
            errors,
            resultBlogpost: {
                writer,
                title,
                text
            },
            csrfToken: request.csrfToken()

        }
        response.render("createBlogPost.hbs", model)
    }

}
)


router.get('/:id', function (request, response) {


    const query = "SELECT * FROM blog WHERE ID = ? LIMIT 1"
    const ID = request.params.id
    var errors = []

    db.all(query, ID, function (error, resultBlogpost) {
        if (error) {
            // TODO: Handle error.
            console.log("Error")
            console.log(ID)
            errors.push("internt databas fel")
            const model = {
                errors,
                csrfToken: request.csrfToken()

            }

            response.render("blogpost.hbs", model)

        }
        else {
            const model = {
                resultBlogpost
            }
            console.log(query)
            console.log(ID)

            response.render('blogPost.hbs', model)
        }
    })

})

router.get('/:id/update', csrfProtection, function (request, response) {

    const ID = request.params.id
    const query = "SELECT * FROM blog WHERE ID = ? "
    var errors = []

    db.get(query, ID, function (error, resultBlogpost) {
        if (error) {
            // TODO: Handle error.
            console.log("Error")
            console.log(ID)
            errors.push("internt databas fel")
            const model = {
                errors,
                csrfToken: request.csrfToken()

            }

            response.render("updateBlogPost.hbs", model)

        }
        else {
            const model = {
                resultBlogpost,
                csrfToken: request.csrfToken()
            }
            console.log(query)
            console.log(ID)
            response.render('updateBlogPost.hbs', model)

        }
    })

})


router.post('/:id/update', csrfProtection, function (request, response) {
    console.log(request.body);
    const writer = request.body.blogförfattare;
    const title = request.body.blogtitel;
    const text = request.body.blogtext;
    const ID = request.params.id
    

    var date = new Date();
    date = date.toLocaleString();
    const min_skribentnamn_längd = 2;
    const min_titel_längd = 2;
    const min_text_längd = 10;

    const values = [writer, title, text, ID];
    console.log(values)
    const query = "UPDATE blog SET writer = ?, title = ?, text = ? WHERE ID=?";
    const errors = []

    if (!request.session.isLoggedIn) {
        errors.push("Inte inloggad.")
    }

    if (!writer) {
        errors.push("Det saknas en skrivbent.")
    }
    else if (writer.length < min_skribentnamn_längd) {
        errors.push("Ditt skrivbentnamn måste vara minst " + min_skribentnamn_längd + " tecken.")
    }

    if (!title) {
        errors.push("Det saknas en blogtitel.")
    }
    else if (title.length < min_titel_längd) {
        errors.push("Din titel måste vara minst" + min_titel_längd + " tecken.")
    }

    if (!text) {
        errors.push("Det saknas en blogtext.")
    }
    else if (text.length < min_text_längd) {
        errors.push("Din blogtext måste vara minst" + min_text_längd + " tecken.")
    }
    console.log(errors)

    if (errors.length == 0) {
        db.run(query, values, function (error) {

            if (error) {
                hasDatabaseError: true
                console.log("error UPDATE blog");
            }
            else {

                response.redirect('/Blog/' + ID)
            }
        })
    }
    else {

        const model = {
            errors,
            resultBlogpost: {
                writer,
                title,
                text,
                ID
            },
            csrfToken: request.csrfToken()
        }
        response.render("updateBlogPost.hbs", model)
    }

})


router.get('/:id/delete', csrfProtection, function (request, response) {

    const ID = request.params.id
    const query = "SELECT * FROM blog WHERE ID = ? "


    db.all(query, ID, function (error, resultBlogpost) {
        if (error) {
            // TODO: Handle error.
            console.log("Error")
            console.log(ID)

        }
        else {
            const model = {
                resultBlogpost,
                csrfToken: request.csrfToken()
            }
            console.log(query)
            console.log(ID)
            response.render('deleteBlogPost.hbs', model)

        }
    })

})

router.post('/:id/delete', csrfProtection, function (request, response) {

    const ID = request.params.id
    const query = "DELETE FROM blog WHERE ID = ?"
    console.log("försöker ta bort")
    const errors = []

    if (!request.session.isLoggedIn) {
        errors.push("Inte inloggad.")
    }

    if (errors == 0)
        db.all(query, ID, function (error) {
            if (error) {
                // TODO: Handle error.
                console.log("Error")
                console.log(ID)

            }
            else {
                response.redirect('/Blog')

            }
        })
    else {
        const model = {
            errors,
            csrfToken: request.csrfToken()
        }
        console.log(query)
        console.log(ID)
        response.render('deleteBlogPost.hbs', model)

    }

})




module.exports = router;
