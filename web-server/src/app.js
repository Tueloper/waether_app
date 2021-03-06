const express = require('express')
const chalk = require('chalk')
const path = require('path')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forcast = require('./utils/forcast')

const app = express()

const publicPath = path.join(__dirname, '../public')
//set helps us to set a value for a given express controller
// in cases when you want to change the directory name of the views folder, we create a path and use app.set
const viewPath = path.join(__dirname, '../template/views')
const reusePath = path.join(__dirname, '../template/partials')

//setup handlebars and set paths for views
app.set('view engine', 'hbs')
//hbs uses the view folder
app.set('views', viewPath)
hbs.registerPartials(reusePath)


//Define the routes and static directory
app.use(express.static(publicPath))
//the render is used to render files from the views folder

app.get('/', (req, res) => {
    res.render("index", {
        title: "Weather-App",
        name: 'Tueloper'
    })
})

app.get('/weather', (req, res) => {

    const address = req.query.address
    if (!req.query.address) {
        return res.send({
            error: 'Unable to find Address Location try anoter search'
        })
    }

    geocode(address , (err, { latitude, longitude, location } = {}) => {
        if (err) {
            return res.send({ err })
        } 
           
        forcast(latitude, longitude, (err, { summary, temperature, precipation}) => {
            if (err) {
                return res.send({ err })
            }
        
            res.send({
                Latitude: latitude,
                Longitude: longitude,
                Location: location,
                Report: 'It is currently ' + temperature + ' degrees out and there is ' + precipation + '%' + ' of rain.',
                Summary: summary
            })            
        }) 
       
    })
    
})

app.get('/about', (req, res) => {
    res.render('about', {
        about: "About Weather-app"
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        message: "Weather-App is here to help You"
    })
})

//catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   res.render('404');
// });

// error handler
app.get('*', (req, res) => {
  res.render('404', {
     message: "Page Not Found "
  })
})

const port = process.env.port || 7000

app.listen(port, () => {
    console.log(chalk.gray('App Server Running On Port: ' + port))
})