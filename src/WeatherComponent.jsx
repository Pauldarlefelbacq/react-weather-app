import { useState, useEffect } from "react";

function Weather(){
    const [weatherData, setWeatherData] = useState(null);
    const [villelat, setVillelat] = useState(null);
    const [villelong, setVillelong] = useState(null);
    const [ville, setVille] = useState("Paris");

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


            const weatherdata = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true&hourly=temperature_2m,weathercode,windspeed_10m`)
            .then(response => response.json())
            
            setWeatherData(weatherdata);
            console.log("données météto", weatherdata);
            
            
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
    }

    return (
        <div>
            <h1>Quel météo aujourd'hui ?</h1>
            <div>
                <input type="text" name="search" id="search" />
                <button>Search</button>
            </div>
            <div>
                <p>Il fait {weatherData.current_weather.temperature}<strong>{weatherData.current_weather_units.temperature}</strong> à {ville}</p>
            </div>
        </div>
    );

}
export default Weather;