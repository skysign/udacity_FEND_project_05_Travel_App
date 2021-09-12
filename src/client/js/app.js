// Base URL of Geonames API
const URL_Geonames = 'http://api.geonames.org/search?maxRows=1&username=skysign&type=json&q='
// Base URL of pixabay API
const URL_pixabay = 'https://pixabay.com/api/?key=23245283-3763530b0782b1941d26657dd&q='
// Base URL of weatherbit API
const URL_weatherbit = 'http://api.weatherbit.io/v2.0/current?key=4a6b880762a84b0c8951a100bc9d5673&city='

// Handling submit from form
const handleSubmit = async function (event) {
    event.preventDefault();

    // Get city name value
    let formText = document.getElementById('name').value;

    // Validate city name to check that it is consist of alphabets only.
    if (false == Client.validateCityname(formText)) {
        console.log(`formText is not valid`);
        return;
    }

    // Get city name from Geonames
    let res = await getGeonames(formText)
    if (res == null)
        return;

    console.log('done getGeonames');
    console.log(res);
    console.log(res['geonames'][0].name);
    const cityname = res['geonames'][0].name;

    // Get city image from Pixabay
    res = await getPixabay(cityname);
    console.log('done getPixabay');
    console.log(res);
    console.log(res['hits'][0].webformatURL);
    const cityimage = res['hits'][0].webformatURL;

    // Get weather from Weatherbit
    res = await getWeatherbit(cityname);
    console.log('done getWeatherbit');
    console.log(res);
    console.log(res.data[0].weather.icon);
    console.log(res.data[0].weather.description);
    let weatherDesc = res.data[0].weather.description;
    const icon = res.data[0].weather.icon;
    let iconPath = getWeatherIconPath(icon);
    console.log(iconPath);

    let json = {cityname:cityname,
                cityimage:cityimage,
                weatherDesc:weatherDesc,
                weatherIcon:iconPath};

    // Render new city with city name, image and weather
    addCity(json);
}

function addCity(dt) {
    console.log(dt.cityname);
    console.log(dt.cityimage);
    console.log(dt.weatherDesc);
    console.log(dt.weatherIcon);

    const cities = document.getElementById('cities');
    const city = document.createElement('div');
    city.textAlign = 'center';
    city.innerHTML = `
        <div class='center'>
        <p id='cityX' onclick='Client.clickX(this)'>[X]</p>
        <p>${dt.cityname}</p>
        <p>${dt.weatherDesc}</p>
        <p><img src='${dt.weatherIcon}' alt='weather ${dt.weatherDesc} icon'></p>
        <p>
            <img src='${dt.cityimage}' alt='picture of ${dt.cityname}'>
        </p>
        </div>
    `;

    cities.appendChild(city);
}

function clickX(element) {
    console.log('click X');
    console.log(element.innerHTML);
    element.parentNode.parentNode.removeChild(element.parentNode);
}

const getGeonames = async function(cityname) {
    let urlG = URL_Geonames + cityname;
    let res = await fetch(urlG);

    if (res.ok) {
        res = await res.json();
        return res;
    }

    return null;
};

const getPixabay = async function(cityname) {
    let urlG = URL_pixabay + cityname;
    let res = await fetch(urlG);

    if (res.ok) {
        res = await res.json();
        return res;
    }

    return null;
};

const getWeatherbit = async function(cityname) {
    let urlG = URL_weatherbit + cityname;
    let res = await fetch(urlG);

    if (res.ok) {
        res = await res.json();
        return res;
    }

    return null;
};

let doPost = async function(url = "", data = {}) {
    console.log('doPost:', data);
    let res = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    try {
        res = await res.json();
        console.log('res of doPost:', res);
        return res;
    }
    catch (error) {
       console.log('doPost error', error);
   }
};

function getWeatherIconPath(weather) {
    return 'https://www.weatherbit.io/static/img/icons/'+weather+'.png';
}

function validateCityname(url) {
    let matched = url.match(/[a-zA-Z]+/g);

    if (matched != null)
        return true;

    return false;
 }

 export {
     handleSubmit,
     validateCityname,
     clickX
 }
