const express = require('express')
const router = express.Router();
const { ensureAuth } = require('../middleware/auth')
const Story = require('../models/Story')

// @description  Show Add Page
//@route  GET /stories/add
//Routes are being used in index.js 

router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add', {
        layout: 'main'
    })
})

// @description  Process add form
//@route  POST /stories
//Routes are being used in index.js 

router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dash')
        console.log(Story)
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})


// @description    Show all stories


router.get('/', ensureAuth, async (req,res) => {
    try {
        const stories = await Story.find({ status: 'public'})
        .populate('user')
        .sort({createdAt: 'desc'})
        .lean()

    res.render('stories/index', {
        layout:'main',
        stories
    })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})
// @description  Show Single Story
//@route  GET /stories/:id
//Routes are being used in index.js 

router.get('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id)
            .populate('user')
            .lean()

        if(!story){
            return res.render('error/404')
        }
        res.render('stories/show', {
            layout: 'main',
            story
        })
    } catch (err) {
        res.render('error/404')
    }
})
// @description  Show Edit Page
//@route  GET /stories/edit/:id
//Routes are being used in index.js 

router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        const story = await Story.findOne({
            _id: req.params.id
        }).lean()
        if(!story) {
            return res.render('error/404')
        }
    
        if(story.user != req.user.id) {
            res.redirect('/stories')
    
        }else{
            res.render('stories/edit', {
                layout: 'main',
                story
            })
        }
    } catch (err) {
        res.render('error/500')
    }
    
})


// @description  Update Story
//@route  PUT /stories/:id
//Routes are being used in index.js 

router.put('/:id', ensureAuth, async (req, res) => {

    try {
        let story = await Story.findById(req.params.id).lean()

        if(!story) {
            return res.render('error/404')
        }
        if(story.user != req.user.id) {
            res.redirect('/stories')

        }else{
            story = await Story.findOneAndUpdate({ _id: req.params.id}, req.body, {
                new: true,
                runValidators: true
        })
        res.redirect('/dash')
    }
    } catch (err) {
        res.render('error/500')
    }
       
})
// @description  DELETE story
//@route  GET /stories/:id
//Routes are being used in index.js 

router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        await Story.remove({_id: req.params.id})
        res.redirect('/dash')
    } catch (err) {
        return res.render('error/500')        
    }
})

// @description  Show Add Page
//@route  GET /stories/add
//Routes are being used in index.js 

router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({
            user: req.params.userId,
            status: 'public'
        })
        .populate('user')
        .lean();

        res.render('stories/index', {
            layout: 'main',
            stories
        })
    } catch (error) {
        console.error(err)
        res.render('error/500')
    }    
})

module.exports = router