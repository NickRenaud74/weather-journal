//Global Variable holding project data
let projectData = {};

//Requiring express
const express = require('express');
const app = express();

//Initiliazing cors for cross-origin allowance
const cors = require('cors');
app.use(cors());

//Configuring app to use body-parser as middleware
const bodyParser = require('body-parser');
const { response } = require('express');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Linking to website directory
app.use(express.static('website'));

//Initializing port and server connection
const port = '3000';

//Callback function to debug
const listening = () => {
    console.log('Server is running');
    console.log(`Running on localhost: ${port}`)
}

const server = app.listen(port, listening);

//GET Route
app.get('/projectData', (req, res) => {
    res.send(projectData);
});

//POST Route
const addEntry = (req, res) => {
    let newEntry = req.body;
    projectData['date'] = newEntry.date;
    projectData['temp'] = newEntry.temp;
    projectData['input'] = newEntry.input;
    projectData['feelsLike'] = newEntry.feelsLike;
    projectData['city'] = newEntry.city;
    projectData['country'] = newEntry.country;
    projectData['description'] = newEntry.description;
    projectData['icon'] = newEntry.icon;
    projectData['max'] = newEntry.max;
    projectData['min'] = newEntry.min;

    res.send(projectData);
};

app.post('/addEntry', addEntry);
