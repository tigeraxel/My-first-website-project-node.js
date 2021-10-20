const express = require('express')
const router = express.Router();
const sqlite = require('sqlite3');
const db = new sqlite.Database('axeltigerberg.db')

var csrf = require('csurf')
var csrfProtection = csrf({ cookie: true })

router.get('/', (req, res) => {
    const query = "SELECT * FROM blog ORDER BY datum DESC"
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
    const blogförfattare = request.body.blogförfattare;
    const blogtitel = request.body.blogtitel;
    const blogtext = request.body.blogtext;
    var datum = new Date();
    datum = datum.toLocaleString();
    const min_skribentnamn_längd = 2;
    const min_titel_längd = 2;
    const min_text_längd = 10;

    const values = [blogförfattare, blogtitel, blogtext, datum];
    console.log(values)
    const query = "INSERT INTO blog (blogförfattare,blogtitel,blogtext,datum) VALUES (?,?,?,?)";
    const errors = []

    if (!request.session.isLoggedIn) {
        errors.push("Inte inloggad.")
    }

    if (!blogförfattare) {
        errors.push("Det saknas en skrivbent.")
    }
    else if (blogförfattare.length < min_skribentnamn_längd) {
        errors.push("Ditt skrivbentnamn måste vara minst " + min_skribentnamn_längd + " tecken.")
    }

    if (!blogtitel) {
        errors.push("Det saknas en blogtitel.")
    }
    else if (blogtitel.length < min_titel_längd) {
        errors.push("Din titel måste vara minst" + min_titel_längd + " tecken.")
    }

    if (!blogtext) {
        errors.push("Det saknas en blogtext.")
    }
    else if (blogtext.length < min_text_längd) {
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
                blogförfattare,
                blogtitel,
                blogtext
            },
            csrfToken: request.csrfToken()

        }
        response.render("createBlogPost.hbs", model)
    }

}
)


router.get('/:id', function (request, response) {


    const query = "SELECT * FROM blog WHERE postID = ? LIMIT 1"
    const id = request.params.id
    var errors = []

    db.all(query, id, function (error, resultBlogpost) {
        if (error) {
            // TODO: Handle error.
            console.log("Error")
            console.log(id)
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
            console.log(id)

            response.render('blogPost.hbs', model)
        }
    })

})

router.get('/:id/update',csrfProtection, function (request, response) {

    const id = request.params.id
    const query = "SELECT * FROM blog WHERE postID = ? "
    var errors=[]

    db.get(query, id, function (error, resultBlogpost) {
        if (error) {
            // TODO: Handle error.
            console.log("Error")
            console.log(id)
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
                csrfToken : request.csrfToken()
            }
            console.log(query)
            console.log(id)
            response.render('updateBlogPost.hbs', model)

        }
    })

})


router.post('/:id/update',csrfProtection, function (request, response) {
    console.log(request.body);
    const blogförfattare = request.body.blogförfattare;
    const blogtitel = request.body.blogtitel;
    const blogtext = request.body.blogtext;
    const id = request.params.id
    const postID = request.params.id

    var datum = new Date();
    datum = datum.toLocaleString();
    const min_skribentnamn_längd = 2;
    const min_titel_längd = 2;
    const min_text_längd = 10;

    const values = [blogförfattare, blogtitel, blogtext, id];
    console.log(values)
    const query = "UPDATE blog SET blogförfattare = ?, blogtitel = ?, blogtext = ? WHERE postID=?";
    const errors = []

    if (!request.session.isLoggedIn) {
        errors.push("Inte inloggad.")
    }

    if (!blogförfattare) {
        errors.push("Det saknas en skrivbent.")
    }
    else if (blogförfattare.length < min_skribentnamn_längd) {
        errors.push("Ditt skrivbentnamn måste vara minst " + min_skribentnamn_längd + " tecken.")
    }

    if (!blogtitel) {
        errors.push("Det saknas en blogtitel.")
    }
    else if (blogtitel.length < min_titel_längd) {
        errors.push("Din titel måste vara minst" + min_titel_längd + " tecken.")
    }

    if (!blogtext) {
        errors.push("Det saknas en blogtext.")
    }
    else if (blogtext.length < min_text_längd) {
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

                response.redirect('/Blog/' + id)
            }
        })
    }
    else {

        const model = {
            errors,
            resultBlogpost: {
                blogförfattare,
                blogtitel,
                blogtext,
                postID
            },
            csrfToken: request.csrfToken()
        }
        response.render("updateBlogPost.hbs", model)
    }

})


router.get('/:id/delete',csrfProtection, function (request, response) {

    const id = request.params.id
    const query = "SELECT * FROM blog WHERE postID = ? "


    db.all(query, id, function (error, resultBlogpost) {
        if (error) {
            // TODO: Handle error.
            console.log("Error")
            console.log(id)

        }
        else {
            const model = {
                resultBlogpost,
                csrfToken : request.csrfToken()
            }
            console.log(query)
            console.log(id)
            response.render('deleteBlogPost.hbs', model)

        }
    })

})

router.post('/:id/delete',csrfProtection, function (request, response) {

    const id = request.params.id
    const query = "DELETE FROM blog WHERE postID = ?"
    console.log("försöker ta bort")
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

            }
            else {
                response.redirect('/')

            }
        })
    else {
        const model = {
            errors,
            csrfToken : request.csrfToken()
        }
        console.log(query)
        console.log(id)
        response.render('deleteBlogPost.hbs', model)

    }

})




module.exports = router;
