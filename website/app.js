// Open Weather Map API credentials
const baseUrl = 'http://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = '09e66fb0e0f51a3338ba81c87ae863d4';

// Create a new date instance dynamically with JS
let d = new Date();
//getMonth() is 0 indexed + 1 for correct month
let today = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;

//Get Request to Open Weather Map API
const getWeather = async (url, zip, key) => {
    const res = await fetch(`${url}${zip}&units=imperial&appid=${key}`);
    try {
        const weatherData = await res.json();
        console.log(weatherData);
        return weatherData;
    } catch (error) {
        console.log('error', error);
    };
};

//POST request 
const postWeather = async (url = '', data = {}) => {
    const res = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    try {
        const newData = await res.json();
        return newData;
    } catch (error) {
        console.log('error: ', error);
    };
};

//UI dynamically update html function
const updateUI = async () => {
    const request = await fetch('/projectData');

    try {
        const projectData = await request.json();
        console.log(projectData);

        document.getElementById('date').innerHTML = projectData.date;
        document.getElementById('location').innerHTML = `Current weather for ${projectData.city}, ${projectData.country}: `;
        document.getElementById('description').innerHTML = projectData.description;
        document.getElementById('temp').innerHTML = `Temperature: ${Math.floor(projectData.temp)} &degF`;
        document.getElementById('feels-like').innerHTML = `Feels like: ${Math.floor(projectData.feelsLike)} &degF`;
        document.getElementById('input').innerHTML = `Your feelings: ${projectData.input}`;
    } catch (error) {
        console.log('error', error);
    };
};

//Get, post data, update UI
const getData = (event) => {
    let zip = document.getElementById('zip').value;
    let feelings = document.getElementById('feelings').value;

    getWeather(baseUrl, zip, apiKey)
        .then(data => {
            postWeather('/addEntry', {
                temp: data.main.temp,
                feelsLike: data.main.feels_like,
                date: today,
                city: data.name,
                country: data.sys.country,
                description: data.weather[0].description,
                input: feelings
            });
        })
        .then(() => {
            updateUI()
        });
};

document.getElementById('generate').addEventListener('click', getData);