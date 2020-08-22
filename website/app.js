// Open Weather Map API credentials
const baseUrl = 'http://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = '09e66fb0e0f51a3338ba81c87ae863d4';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

//Get Request to Open Weather Map API
const getWeather = async (url, zip, key) => {
    const res = await fetch(`${url}${zip}&appid=${key}`);
    try {
        const weatherData = await res.json();
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
        console.log(newData)
        return newData;
    } catch (error) {
        console.log('error: ', error);
    };
};

//UI update function
const updateUI = async () => {
    const request = await fetch('/projectData');
    try {
        const projectData = await request.json();
        let recent = projectData.length - 1;
        document.getElementById('date').innerHTML = projectData[recent].date;
        document.getElementById('temp').innerHTML = projectData[recent].temp;
        document.getElementById('content').innerHTML = projectData[recent].input;
  
    }catch(error){
      console.log("error", error);
    }
  }

  //Get, post data, update UI
const getData = (event) => {
    let zip = document.getElementById('zip').value;
    let feelings = document.getElementById('feelings').value;

    getWeather(baseUrl, zip, apiKey)
        .then(data => {
            postWeather('/addEntry', { temp: data.main.temp, date: newDate, input: feelings })
        })
        .then(() => {
            updateUI()
        });
};

document.getElementById('generate').addEventListener('click', getData);