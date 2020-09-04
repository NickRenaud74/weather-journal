//Global variable - Stores data for previous entries
let history = [];

// Open Weather Map API credentials
const baseUrl = 'http://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = '09e66fb0e0f51a3338ba81c87ae863d4';

// Create a new date instance dynamically with JS
let d = new Date();
//getMonth() 0 indexed, + 1 for correct month
let today = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;

//Get Request to retrieve data from Open Weather Map API
const getWeather = async (url, zip, key) => {
    const res = await fetch(`${url}${zip}&units=imperial&appid=${key}`);
    try {
        const weatherData = await res.json();
        return weatherData;
    } catch (error) {
        console.log(error)
    };
};

//POST request to save project data
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

//Update UI with previous journal entries
const updateHistory = data => {
    history.push(data);
    let entryHistory = document.querySelector('.prev-entries');
    //Grabbing index of second last entry to add to .prev-entries list
    const len = history.length - 2;
    //If more than one post has been made update .prev-entries section
    if (history.length > 1) {
        let entry = document.createElement('li');
        entry.innerHTML =
            `<div class="head">
                <div class="prev-icon"><img src="http://openweathermap.org/img/wn/${history[len].icon}@2x.png" alt="weather icon"></div>
                <div class="prev-location"><strong>${history[len].city}, ${history[len].country}</strong></div>
            </div>
            <div class="prev-date"><em>${history[len].date}</em></div>
            <div class="prev-description"><strong>Conditions:</strong> ${history[len].description}</div>
            <div class="prev-temp"><strong>High:</strong> ${Math.floor(history[len].max)}&degF <strong>Low:</strong> ${Math.floor(history[len].min)}&degF</div>
            <div class="prev-input"><strong>Your feelings:</strong> ${history[len].input}</div>`;
        entryHistory.insertAdjacentElement('afterbegin', entry);
    };
};

//Fetch data from 'projectData' variable and update UI dynamically
const updateUI = async () => {
    const request = await fetch('/projectData');

    try {
        const projectData = await request.json();
        //updateHistory to add recent posts to .prev-entries list
        updateHistory(projectData);

        //dynamically update main entry section
        document.getElementById('date').innerHTML = `<em>${projectData.date}</em>`;
        document.getElementById('location').innerHTML = `Current weather for ${projectData.city}, ${projectData.country}`;
        document.getElementById('icon').innerHTML = `<img src="http://openweathermap.org/img/wn/${projectData.icon}@2x.png" alt="weather icon">`;
        document.getElementById('temp').innerHTML = `${Math.floor(projectData.temp)} &degF`;
        document.getElementById('description').innerHTML = `<strong>Conditions:</strong> ${projectData.description}`;
        document.getElementById('feels-like').innerHTML = `<strong>Feels like:</strong> ${Math.floor(projectData.feelsLike)} &degF`;
        document.getElementById('input').innerHTML = `<strong>Your feelings:</strong> ${projectData.input}`;
    } catch (error) {
        console.log('error', error);
    };
};

//Promise for Get and post data, update UI
const getData = (event) => {

    let zip = document.getElementById('zip').value;
    let feelings = document.getElementById('feelings').value;

    //Form validation - alert if required fields are not filled out
    if (zip.length == 0) {
        alert('Please enter zipcode');
        return;
    };

    if (feelings.length == 0) {
        alert('Please enter your feelings');
        return;
    };

    getWeather(baseUrl, zip, apiKey)
        .then(data => {
            postWeather('/addEntry', {
                temp: data.main.temp,
                feelsLike: data.main.feels_like,
                date: today,
                city: data.name,
                country: data.sys.country,
                description: data.weather[0].description,
                icon: data.weather[0].icon,
                max: data.main.temp_max,
                min: data.main.temp_min,
                input: feelings
            });
        })
        .then(() => {
            updateUI()
        }).catch(error => {
            alert(`City not found! Please enter valid zipcode`)
        })
};

//Event listener triggered on submitting form
document.getElementById('generate').addEventListener('click', getData);