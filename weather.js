const key = '4ea811ca97da5895b3c960fa98d08d80';

//form search
function search() {
    const phrase = document.querySelector('input[type="text"]').value;
    const response = fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${phrase}&limit=5&appid=${key}`);
    const data = response.json();
    const ul = document.querySelector('form ul');
    ul.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
        const {name, lat, lon, country} = data[i];
        ul.innerHTML += `<li 
                    data-lat="${lat}" 
                    data-lon="${lon}" 
                    data-name="${name}">
                    ${name} <span>${country}</span></li>`;
    }
}

//memberikan waktu input pada search dan mendapatkan valuenya
const debouncedSearch = _.debounce(() => {
    search();
}, 600);

//mengambil api cuaca dan menampilkan cuaca
function showWeather(lat,lon,name) {
    const response = fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`);
    const data = response.json();
    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const humidity = Math.round(data.main.humidity);
    const wind = Math.round(data.wind.speed);
    const icon = data.weather[0].icon;
    document.getElementById('city').innerHTML = name;
    document.getElementById('degrees').innerHTML = temp + '&#8451;';
    document.getElementById('feelsLikeValue').innerHTML = feelsLike + '<span>&#8451;</span>';
    document.getElementById('windValue').innerHTML = wind + '<span>km/h</span>';
    document.getElementById('humidityValue').innerHTML = humidity + '<span>%</span>';
    document.getElementById('icon').src = `http://openweathermap.org/img/wn/${icon}@4x.png`;
    document.querySelector('form').style.display = 'none';
    document.getElementById('weather').style.display = 'block';
}

//mengambil nilai form search
document.querySelector('input[type="text"]').addEventListener('keyup', debouncedSearch);

//menampilkan cuaca pada saat menuliskan kota di search form dan klik nama kota nya
document.body.addEventListener('click', ev => {
    const li = ev.target;
    const {lat, lon, name} = li.dataset;
    localStorage.setItem('lat',lat);
    localStorage.setItem('lon',lon);
    localStorage.setItem('name',name);
    if (!lat){
        return;
    }
    showWeather(lat,lon,name);
});

//menghilangkan tampilan cuaca saat klik change city dan menampilkan form search
document.getElementById('change').addEventListener('click', () => {
    document.getElementById('weather').style.display = 'none';
    document.querySelector('form').style.display = 'block';
});

//saat refresh, data akan tersimpan dan auto menampilkan cuaca yang tersimpan di localstorage
document.body.onload = () => {
    if (localStorage.getItem('lat')) {
        const lat = localStorage.getItem('lat');
        const lon = localStorage.getItem('lon');
        const name = localStorage.getItem('name');
        showWeather(lat,lon,name);
    }
}