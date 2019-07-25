const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const config = require('./config');
let googleProfile = {};

app.use(express.static('assets'));
app.use(express.static('stylesheets'))

app.set('view engine', 'pug');
app.set('views', './views');
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((obj, done) => {
    done(null, obj);
});

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.CALLBACK_URL
},
    (accessToken, refreshToken, profile, cb) => {
        googleProfile = {
            id: profile.id,
            displayName: profile.displayName
        };
        cb(null, profile);
    }
));

//app routes
app.get('/', (req, res) => {
    res.render('index', { user: req.user });
});

app.get('/logged', (req, res) => {
    res.render('logged', { user: googleProfile });
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/')
});

//Passport routes
app.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    }));
app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/logged',
        failureRedirect: '/'
    }));

app.listen(3000);
app.use((req, res, next) => {
    res.status(404).send('Error 404 - nie znaleziono')
})