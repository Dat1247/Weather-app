const API_KEY_WEATHER = "edfe2569d6f0396acc2c0cb6df6c7587";
const API_KEY_GET_TIMEZONE = "L4CTY5ROBO2N";
const API_KEY_GET_TIME = "ajyeOvApgzJXMeiERmvm";

const cityName = document.getElementById("cityName");
const btnSearch = document.getElementById("btnSearch");
const result = document.getElementById("result");
const body = document.querySelector("body");
const label = document.querySelector(".searchCity label");

const callApiGetTime = async (timezone, data) => {
	await axios({
		method: "GET",
		url: `https://timezoneapi.io/api/timezone/?${timezone}&token=${API_KEY_GET_TIME}`,
	})
		.then((res) => {
			const timeDay = res.data.data.datetime.timeday_gen;
			switch (timeDay) {
				case "morning":
					body.style.backgroundImage = `url('./img/morning.jpg')`;
					label.style.color = "white";
					break;
				case "afternoon":
					body.style.backgroundImage = `url('./img/afternoon.jpg')`;
					label.style.color = "black";
					break;
				case "evening":
					body.style.backgroundImage = `url('./img/evening.jpg')`;
					label.style.color = "white";
					break;
				default:
					body.style.backgroundImage = `url('./img/night.jpg')`;
					label.style.color = "white";
					break;
			}
			result.innerHTML = renderWeather(data.data, res.data.data.datetime);
		})
		.catch((err) => {
			console.log(err);
		});
};

const callApiTimezone = async (lat, lon, data) => {
	await axios({
		method: "GET",
		url: `https://api.timezonedb.com/v2.1/get-time-zone?key=${API_KEY_GET_TIMEZONE}&format=json&by=position&lat=${lat}&lng=${lon}`,
	})
		.then((res) => {
			callApiGetTime(res.data.zoneName, data);
		})
		.catch((err) => {
			console.log(err);
		});
};

const callApiWeather = async (location) => {
	await axios({
		method: "GET",
		url: `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY_WEATHER}`,
	})
		.then((res) => {
			const { lat, lon } = res.data.coord;
			callApiTimezone(lat, lon, res);
		})
		.catch((err) => {
			console.log(err);
			alert(err.message);
		});
};

const handleSubmit = async (e) => {
	e.preventDefault();
	await callApiWeather(e.currentTarget[0].value);
};

const changeTemp = (temp) => {
	return Math.round(temp - 273.15);
};

const renderWeather = (data, timeOfDay) => {
	const { main, name, sys, weather, wind } = data;
	const { date, hour_12_wilz, minutes, hour_am_pm } = timeOfDay;

	return `<div class='card'>
		<div class='card-header d-flex justify-content-between align-items-center'>
			<p>${name} <span>(${sys.country})</span></p>
			<p class='date fst-italic'>${date}</p>
		</div>
		<div class='card-body'>
			<div class='weather'>
				<div class='d-flex weather_content'>
					<div class="col-12 col-sm-6">
						<div class='weather_img flexColumn'>
							<img src='https://openweathermap.org/img/wn/${weather[0].icon}@2x.png' alt='${
		weather[0].main
	}' />
							<span>${weather[0].description}</span>
						</div>
					</div>
					<div class="col-12 col-sm-6">
						<div class="timeAndTemp flexColumn">
							<div class="w-100 position-relative time">
								<p class="text-center mb-0 fs-5">
		
									
										${hour_12_wilz}:${minutes} ${hour_am_pm.toUpperCase()}
									
								</p>
							</div>
							<div class="w-100 flexColumn temp">
								<p class="mb-0">${changeTemp(main.temp)}&deg;C</p>
							</div>
							
						</div>
					</div>
				</div>

				<ul>
					<li>
						<p>Temp max: </p>
						<p>${changeTemp(main.temp_max)}&deg;C</p>
					</li>
					<li>
						<p>Temp min: </p>
						<p>${changeTemp(main.temp_min)}&deg;C</p>
					</li>
					<li>
						<p>Feels like: </p>
						<p>${changeTemp(main.feels_like)}&deg;C</p>
					</li>
					<li>
						<p>Humidity: </p>
						<p>${main.humidity}%</p>
					</li>
					<li>
						<p>Pressure: </p>
						<p>${main.pressure}hPa</p>
					</li>
					<li>
						<p>Wind speed: </p>
						<p>${wind.speed} m/s</p>
					</li>
				</ul>
			</div>
		</div>
	</div>`;
};
