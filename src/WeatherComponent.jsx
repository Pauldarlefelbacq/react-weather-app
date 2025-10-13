import { useState, useEffect } from "react";

function Weather(){
    const [weatherData, setWeatherData] = useState(null);
    const [villelat, setVillelat] = useState(null);
    const [villelong, setVillelong] = useState(null);
    const [ville, setVille] = useState("Paris");
    const [date, setDate] = useState(null);
    const [nextHourForecast, setNextHourForecast] = useState(null);
    


    useEffect(()=>{
        const fetchvilleweather = async()=>{
            const villedata = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${ville}`)
            .then(response => response.json())

            if (villedata.results.length === 0){
                setVille()
            }
            const lat = villedata.results[0].latitude;
            const long = villedata.results[0].longitude;
            console.log(lat);
            console.log(long);
            setVillelat(lat);
            setVillelong(long);


            const weatherdata = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true&hourly=temperature_2m,apparent_temperature,precipitation,surface_pressure,is_day,wind_speed_10m,precipitation_probability`)
            .then(response => response.json())
            
            setWeatherData(weatherdata);
            console.log("données météto", weatherdata);

            const datee = new Date(weatherdata.current_weather.time);
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            };

            const formattedDate = new Intl.DateTimeFormat('fr-FR', options).format(datee);
            setDate(formattedDate);
            console.log(formattedDate);

            const currentIndex = weatherdata.hourly.time.findIndex(time => time === weatherdata.current_weather.time);
            if (currentIndex !== -1 && currentIndex + 1 < weatherdata.hourly.time.length) {
                const nextHourIndex = currentIndex + 1;
                const forecastTemp = weatherdata.hourly.apparent_temperature[nextHourIndex];
                const forecastPressure = weatherdata.hourly.surface_pressure[nextHourIndex];
                setNextHourForecast({
                    temp: forecastTemp,
                    pressure:forecastPressure
                });
            }
            
        };
        fetchvilleweather();
    },
    []);


    if (weatherData === null){
        return(
            <div>
                <h1>Chargement en cours...</h1>
            </div>
        )
    };

    return (
        <div>
            <h1>Quel météo aujourd'hui ?</h1>
            <div>
                <input type="text" name="search" id="search" />
                <button>Search</button>
                
            </div>
            <div>
                <p>{ville}</p>
                <p>{weatherData.current_weather.temperature}</p>
                <p>{date}</p>
            </div>
            <div>
                {nextHourForecast.temp ? (
                    <div>
                        <p>Ressenti</p>
                        <p>{nextHourForecast.temp}°</p>
                    </div>
                ) : (
                    <div>
                        <p>Chargement de la prévision...</p>
                    </div>
                )}
                <div>
                    <h3>Vent</h3>
                    <p>{weatherData.current_weather.windspeed} km/h</p>
                </div>
                {nextHourForecast.pressure ?(
                    <div>
                        <h3>Précipitation</h3>
                        <p>{nextHourForecast.pressure} Bar</p>
                    </div>
                ) : (
                    <div>
                        <p>Chargement de la prévision...</p>
                    </div>
                )}
            </div>
        </div>
    );

}
export default Weather;