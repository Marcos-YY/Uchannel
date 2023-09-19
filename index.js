const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('express-flash');
const app = express();
const conexao = require('./db/conexao');
const rotasPost = require('./routes/postRoutes.js');
const rotasAuth = require('./routes/autRoutes.js');
const partials = exphbs.create({partialsDir:'partials'});
const PostController = require('./controllers/postController');

// session middleware (antes das rotas)
app.use(session({
    name:'session',
    secret: 'senhaDasessao',
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
        path: './sessions'
    }),
    cookie: {
        secure: false,
        maxAge: 360000,
        expires: new Date(Date.now() + 360000),
        httpOnly: true
    }
}));

// flash middleware (antes das rotas)
app.use(flash());

// handlebars
app.engine('hbs', partials.engine);
app.engine('hbs', exphbs.engine({extname: '.hbs'}));
app.set('view engine', 'hbs');

// resgatar dados: body
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use((req, res, next) => {
    if (req.session.userid) {
        res.locals.session = req.session;
    }
    next();
});

// rotas
app.use('/', rotasAuth);
app.use('/',  rotasPost);
app.get('/', PostController.showPosts);

// public
app.use(express.static('public'));

conexao.sync().then(() => {
    app.listen(3000);
}).catch((err) => {
    console.log(err);
});
