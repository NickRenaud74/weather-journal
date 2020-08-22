// Initializing express
const express = require('express');
const app = express();

//Initiliazing cors
const cors = require('cors');
app.use(cors());

//Initializing body-parser
const bodyParser = require('body-parser');
const { response } = require('express');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Linking to website directory
app.use(express.static('website'));

//Initializing port and server connection
const port = '3000';

const listening = () => {
    console.log('Server is running');
    console.log(`Running on localhost: ${port}`)
}

const server = app.listen(port, listening);

//Global Variable holding project data
let projectData = [];

//GET Route
app.get('/', (req, res) => {
    res.send(projectData);
});

//POST Route
const addEntry = (req, res) => {
    let newEntry = {
        temp: req.body.temp,
        input: req.body.input
    }
    projectData.push(newEntry);
};

app.post('/addEntry', addEntry);