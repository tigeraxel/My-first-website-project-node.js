const express = require('express')
const router = express.Router();
const sqlite = require('sqlite3');
const db = new sqlite.Database('axeltigerberg.db')

router.get('/', (req, res) => {
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

router.get('/createBlogPost', (req, res) => {
    res.render("createBlogPost.hbs");
})

router.post('/createBlogPost', function (request, response) {
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
        errors.push("Not logged in.")
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
    else if (blogtitel.length < min_text_längd) {
        errors.push("Din text måste vara minst" + min_text_längd + " tecken.")
    }
    console.log(errors)

    if (errors.length == 0) {
        db.run(query, values, function (error) {

            if (error) {
                hasDatabaseError: true
                console.log("error insert blog");
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
                blogtext,

            }
        }
        response.render("createBlogPost.hbs", model)
    }

})


router.get('/:id', function (request, response) {


    const query = "SELECT * FROM blog WHERE postID = ? LIMIT 1"
    const id = request.params.id

    db.all(query, id, function (error, resultBlogpost) {
        if (error) {
            // TODO: Handle error.
            console.log("Error")
            console.log(id)

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

router.get('/:id/update', function (request, response) {

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
                resultBlogpost
            }
            console.log(query)
            console.log(id)
            response.render('updateBlogPost.hbs', model)

        }
    })

})


router.post('/:id/update', function (request, response) {
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
        errors.push("Not logged in.")
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

            }
        }
        response.render("updateBlogPost.hbs", model)
    }

})


router.get('/:id/delete', function (request, response) {

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
                resultBlogpost
            }
            console.log(query)
            console.log(id)
            response.render('deleteBlogPost.hbs', model)

        }
    })

})

router.post('/:id/delete', function (request, response) {

    const id = request.params.id
    const query = "DELETE FROM blog WHERE postID = ?"
    console.log("försöker ta bort")

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

})




module.exports = router;
