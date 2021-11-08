const express = require('express');
const exphbs = require('express-handlebars')
const session = require('express-session')
const mongoose =  require('mongoose')
const path = require('path')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const morgan = require('morgan')
const methodOverride = require('method-override')
const passport = require('passport')
const MongoStore = require('connect-mongo')


// LOADING CONFIG 
dotenv.config({path: './config/config.env'})

// passport config
require('./config/passport')(passport)
connectDB()

const app = express();

app.use(express.urlencoded({
    extended: false
}))
// method override
app.use(methodOverride(function (req, res){
    if(req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
    }
}))


if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}
// handlebars helpers
const{ formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs')

// Handlebars
app.engine('.hbs', exphbs({
    helpers:{
        formatDate,
        stripTags,
        truncate,
        editIcon,
        select
    },
    defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs')

// Sessions
app.use(session({
    secret: 'keyboard',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
}))

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// SET GLOBAL VARIABLE FOR EDIT ICON
app.use(function(req,res,next) {
    res.locals.user = req.user || null
    next()
})

// STATIC EXPRESS
app.use(express.static(path.join(__dirname,'public')))

// routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))


const PORT = process.env.PORT;


app.listen(PORT, console.log(`THIS PORT IS ON ${process.env.PORT}`))