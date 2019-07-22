const express = require('express');
const app = express();
app.set('view engine', 'pug');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('content', {
        signIn: '/auth/google'
    });
});

app.get('/auth/google', (req, res) => {
    res.render('logged')
})

app.listen(3000)
app.use((req, res, next) => {
    res.status(404).send('Error 404 - nie znaleziono')
})