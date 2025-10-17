import * as Plot from "@observablehq/plot";
import { Leapfrog } from "ldrs/react";
import 'ldrs/react/Leapfrog.css';
import { useState, useEffect, useRef } from "react";

function Weather(){


    const [weatherData, setWeatherData] = useState(null);
    const [villelat, setVillelat] = useState(null);
    const [villelong, setVillelong] = useState(null);
    const [ville, setVille] = useState("Paris");
    const [date, setDate] = useState(null);
    const [nextHourForecast, setNextHourForecast] = useState(null);
    const [dayoe, setDayoe] = useState(null);
    const[input, setInput] = useState("");
    const [speedUnit, setSpeedUnit] = useState("");
    const [precUnit, setPrecUnit] = useState("");
    const [tempUnit, setTempUnit] = useState("");
    const[previsions, setPrevisions] = useState([]);
    const[suggestions, setSuggestions] = useState([])

    // const ref = useRef();
    // const [sort, setSort] = useState("Alphabetical");
    

    useEffect(() => {
        if (input.trim() === '') {
            setSuggestions([]);
            return;
        }

        const debounceTimer = setTimeout(() => {
            const fetchSuggestions = async () => {
                try {
                    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${input}&count=5`);
                    const data = await response.json();
                    setSuggestions(data.results || []);
                } catch (error) {
                    console.error("Echec des suggestions", error);
                    setSuggestions([]);
                }
            };

            fetchSuggestions();
        }, 300);

        return () => clearTimeout(debounceTimer);

    }, [input]);
    const handleSuggestionClick = (suggestion) => {
        setVille(suggestion.name);
        setInput("");
        setSuggestions([]);
    };

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

            let URL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true&daily=uv_index_max,temperature_2m_max,temperature_2m_min,sunrise,sunset&hourly=temperature_2m,apparent_temperature,precipitation,surface_pressure,is_day,wind_speed_10m,precipitation_probability`;
            if (speedUnit){
                URL += (speedUnit);                
            };
            if (tempUnit){
                URL += (tempUnit);                
            };
            if (precUnit){
                URL += (precUnit);                
            };
            const weatherdata = await fetch(`${URL}`)
            .then(response => response.json())

        
            setWeatherData(weatherdata);
            console.log("données météto", weatherdata);
            
            const currentHourString = weatherdata.current_weather.time;
            const currentDay = currentHourString.slice(0, 10)
            const currentHourSearchString = currentHourString.slice(0, 13);
            setDate(currentDay);

            const currentIndexDay = weatherdata.daily.time.findIndex(time => time === currentDay);
            if (currentIndexDay !== -1 && currentIndexDay + 1 < weatherdata.daily.time.length) {
                setDayoe({
                    UV: Math.round(weatherdata.daily.uv_index_max[currentIndexDay]),
                    sunset: weatherdata.daily.sunset[currentIndexDay],
                    sunrise: weatherdata.daily.sunrise[currentIndexDay],
                });
            }

            const currentIndexHour = weatherdata.hourly.time.findIndex(time => time.startsWith(currentHourSearchString));
            if (currentIndexHour !== -1) {
                const nextHourIndex = currentIndexHour + 1;
                const precipitationUnit = weatherdata.hourly_units.precipitation;
                if (nextHourIndex < weatherdata.hourly.time.length) {
                    setNextHourForecast({
                        temp: weatherdata.hourly.apparent_temperature[nextHourIndex],
                        pressure: weatherdata.hourly.surface_pressure[nextHourIndex],
                        precipitation: weatherdata.hourly.precipitation[nextHourIndex],
                        precipitationUnit: precipitationUnit,
                    });
                }else{
                    setNextHourForecast({
                        temp: weatherdata.hourly.apparent_temperature[currentIndexHour],
                        pressure: weatherdata.hourly.surface_pressure[currentIndexHour], 
                        precipitation: weatherdata.hourly.precipitation[currentIndexHour],
                        precipitationUnit: precipitationUnit,
                    });
                }
                const prev = []
                for (let i = currentIndexHour; i <= currentIndexHour + 7; i++) {
                    if (weatherdata.hourly.time[i]) { 
                        prev.push({
                            time: weatherdata.hourly.time[i].slice(11, 16),
                            icone: weatherdata.hourly.is_day[i],
                            temp: weatherdata.hourly.temperature_2m[i]
                        });
                    }
                        
                };
                setPrevisions(prev);
            }
        };
        fetchvilleweather();
    },
    [ville, speedUnit, precUnit, tempUnit]);
    console.log(previsions);

    // pas dingue mais je vois mal comment faire autrement...
    const situationAct = () => {
                return weatherData.current_weather.is_day === 1 ? (
                    (() => {
                        switch (weatherData.current_weather.weathercode) {
                            case 0:
                                return (
                                    <div className="text-7xl md:text-8xl lg:text-9xl">
                                    ☀️
                                    </div>
                                );
                                case 1:
                                    return (
                                        <div className="text-7xl md:text-8xl lg:text-9xl">
                                        🌤️
                                        </div>
                                    );
                                    case 2:
                                    return (
                                        <div className="text-7xl md:text-8xl lg:text-9xl">
                                        ⛅
                                        </div>
                                    );
                                    case 3:
                                    return (
                                        <div className="text-7xl md:text-8xl lg:text-9xl">
                                        ☁️
                                        </div>
                                    );
                                    case 45:
                                    return (
                                        <div className="text-7xl md:text-8xl lg:text-9xl">
                                        🌫️
                                        </div>
                                    );
                                    case 48:
                                    return (
                                        <div className="text-7xl md:text-8xl lg:text-9xl">
                                        🌁
                                        </div>
                                    );
                                    case 51:
                                    case 53:
                                    return (
                                        <div className="text-7xl md:text-8xl lg:text-9xl">
                                        🌦️
                                        </div>
                                    );
                                    case 55:
                                    return (
                                        <div className="text-7xl md:text-8xl lg:text-9xl">
                                        🌧️
                                        </div>
                                    );
                                    case 56:
                                    case 57:
                                    case 66:
                                    return (
                                        <div className="text-7xl md:text-8xl lg:text-9xl">
                                        🌧️
                                        </div>
                                    );
                                    case 61:
                                    case 80:
                                    return (
                                        <div className="text-7xl md:text-8xl lg:text-9xl">
                                        🌦️
                                        </div>
                                    );
                                    case 63:
                                    case 81:
                                    return (
                                        <div className="text-7xl md:text-8xl lg:text-9xl">
                                        🌧️
                                        </div>
                                    );
                                    case 65:
                                    return (
                                        <div className="text-7xl md:text-8xl lg:text-9xl">
                                        🌧️
                                        </div>
                                    );
                                    case 67:
                                    case 77:
                                    return (
                                        <div className="text-7xl md:text-8xl lg:text-9xl">
                                        🌨️
                                        </div>
                                    );
                                    case 71:
                                    case 85:
                                    return (
                                        <div className="text-7xl md:text-8xl lg:text-9xl">
                                        🌨️
                                        </div>
                                    );
                                    case 73:
                                    return (
                                        <div className="text-7xl md:text-8xl lg:text-9xl">
                                        🌨️
                                        </div>
                                    );
                                    case 75:
                                    return (
                                        <div className="text-7xl md:text-8xl lg:text-9xl">
                                        🌨️
                                        </div>
                                    );
                                    case 86:
                                    return (
                                        <div className="text-7xl md:text-8xl lg:text-9xl">
                                        🌨️
                                        </div>
                                    );
                                    case 95:
                                    return (
                                        <div className="text-7xl md:text-8xl lg:text-9xl">
                                        🌩️
                                        </div>
                                    );
                                    case 96:
                                    return (
                                        <div className="text-7xl md:text-8xl lg:text-9xl">
                                        ⛈️
                                        </div>
                                    );
                                    case 99:
                                    return (
                                        <div className="text-7xl md:text-8xl lg:text-9xl">
                                        ⛈️
                                        </div>
                                    );
                                    default:
                                    return (
                                        <div className="text-7xl md:text-8xl lg:text-9xl">
                                        ❓
                                        </div>
                                    );
                                }
                            })()
                        ) : (
                            <div className="text-7xl md:text-8xl lg:text-9xl">
                                🌕
                            </div>
                                    )
                            };

    if (weatherData === null){
        return(
            <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
                <h1 className="text-3xl font-bold text-white">Chargement en cours</h1>
                <Leapfrog size="50" speed="2.5" color="white" />
            </div>
        )
    };

    return (
        <div className="min-h-screen bg-[#0a0e27] text-white">
            <nav className="flex justify-between items-center px-4 md:px-8 py-4 md:py-6">
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-xl md:text-2xl">☀️</span>
                    </div>
                    <a href="/" className="text-lg md:text-xl font-bold">Meteo en React !</a>
                </div>
                
                <div className="collapse collapse-arrow bg-[#1a1f3a] rounded-lg border border-gray-700 w-auto">
                    <input type="checkbox" /> 
                    <div className="collapse-title text-sm md:text-base font-medium">
                        Unités
                    </div>
                    <div className="collapse-content *:my-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="checkbox checkbox-primary"
                                onChange={(e) => setTempUnit(e.target.checked ? "&temperature_unit=fahrenheit" : "")}
                            />
                            <span className="text-sm">fahrenheit</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="checkbox checkbox-primary"
                                onChange={(e) => setSpeedUnit(e.target.checked ? "&wind_speed_unit=mph" : "")}
                            />
                            <span className="text-sm">MpH</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="checkbox checkbox-primary"
                                onChange={(e) => setPrecUnit(e.target.checked ? "&precipitation_unit=inch" : "")}
                            />
                            <span className="text-sm">Inch</span>
                        </label>
                    </div>
                    
                </div>
            </nav>

            <div className="px-4 md:px-8 py-6 md:py-8">

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6 md:mb-8">
                    Quelle température aujourd'hui ? ?
                </h1>

                <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8 md:mb-12 max-w-2xl mx-auto relative">
                    <div className="w-full sm:flex-1 relative">
                        <input 
                            onChange={(e)=> setInput(e.target.value)}
                            value={input}
                            id="text"
                            type="text" 
                            placeholder="Rechercher un lieu..."
                            className="w-full px-4 md:px-6 py-3 bg-[#1a1f3a] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition"
                        />
                        {suggestions.length > 0 && (
                            <ul className="absolute w-full mt-2 bg-[#1a1f3a] border border-gray-700 rounded-lg z-50 overflow-hidden ">
                                {suggestions.map((suggestion) => (
                                    <li 
                                        key={suggestion.id} 
                                        className="px-4 py-3 cursor-pointer hover:bg-blue-600/50 transition-colors"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        {suggestion.name}, {suggestion.admin1}, {suggestion.country}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <button onClick={()=>setVille(input)} className="px-6 md:px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition whitespace-nowrap">
                        Rechercher
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                        <div className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl md:rounded-3xl p-6 md:p-8 mb-6 overflow-hidden">
                            
                            <div className="relative z-10">
                                <h2 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">{ville}</h2>
                                <p className="text-base md:text-lg opacity-90 mb-6 md:mb-8">{date}</p>
                                
                                <div className="flex items-center justify-between">
                                    <div className="text-6xl md:text-7xl lg:text-8xl font-bold">
                                        {Math.round(weatherData.current_weather.temperature)}{weatherData.current_weather_units.temperature}
                                    </div>
                                        {situationAct()}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                            <div className="bg-[#1a1f3a] rounded-xl md:rounded-2xl p-4 md:p-6">
                                <p className="text-gray-400 text-xs md:text-sm mb-2">Ressenti</p>
                                {nextHourForecast && nextHourForecast.temp ? (
                                    <p className="text-xl md:text-2xl font-bold">
                                        {Math.round(nextHourForecast.temp)}{weatherData.current_weather_units.temperature}
                                    </p>
                                ) : (
                                    <p className="text-base md:text-lg text-gray-500">--°</p>
                                )}
                            </div>

                            <div className="bg-[#1a1f3a] rounded-xl md:rounded-2xl p-4 md:p-6">
                                <p className="text-gray-400 text-xs md:text-sm mb-2">Humidité</p>
                                <p className="text-xl md:text-2xl font-bold">46%</p>
                            </div>

                            <div className="bg-[#1a1f3a] rounded-xl md:rounded-2xl p-4 md:p-6">
                                <p className="text-gray-400 text-xs md:text-sm mb-2">Vent</p>
                                <p className="text-xl md:text-2xl font-bold">
                                    {Math.round(weatherData.current_weather.windspeed)}
                                    <span className="text-xs md:text-sm ml-1">{weatherData.current_weather_units.windspeed}</span>
                                </p>
                            </div>
                            
                            {nextHourForecast ? (
                            <div className="bg-[#1a1f3a] rounded-xl md:rounded-2xl p-4 md:p-6">
                                <p className="text-gray-400 text-xs md:text-sm mb-2">Précipitation</p>
                                <p className="text-xl md:text-2xl font-bold">
                                    {nextHourForecast.precipitation} {nextHourForecast.precipitationUnit}
                                </p>
                            </div>
                            ) : null}
                        </div>

                        <div className="grid grid-cols-2 gap-3 md:gap-4 mt-3 md:mt-4">
                            {nextHourForecast && typeof nextHourForecast.pressure !== "undefined" ? (
                                <div className="bg-[#1a1f3a] rounded-xl md:rounded-2xl p-4 md:p-6">
                                    <p className="text-gray-400 text-xs md:text-sm mb-2">Pression</p>
                                    <p className="text-xl md:text-2xl font-bold">
                                        {Math.round(nextHourForecast.pressure)} hPa
                                    </p>
                                </div>
                            ) : null}

                            {dayoe && typeof dayoe.UV !== "undefined" ? (
                                <div className="bg-[#1a1f3a] rounded-xl md:rounded-2xl p-4 md:p-6">
                                    <p className="text-gray-400 text-xs md:text-sm mb-2">Indice UV</p>
                                    <p className="text-xl md:text-2xl font-bold">{dayoe.UV}</p>
                                </div>
                            ) : null}

                            {dayoe && dayoe.sunset ? (
                                <div className="bg-[#1a1f3a] rounded-xl md:rounded-2xl p-4 md:p-6">
                                    <p className="text-gray-400 text-xs md:text-sm mb-2">Couché de soleil</p>
                                    <p className="text-xl md:text-2xl font-bold">{dayoe.sunset.slice(11)}</p>
                                </div>
                            ) : null}

                            {dayoe && dayoe.sunrise ? (
                                <div className="bg-[#1a1f3a] rounded-xl md:rounded-2xl p-4 md:p-6">
                                    <p className="text-gray-400 text-xs md:text-sm mb-2">Lever de soleil</p>
                                    <p className="text-xl md:text-2xl font-bold">{dayoe.sunrise.slice(11)}</p>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    <div className="w-full lg:w-80">
                        <div className="bg-[#1a1f3a] rounded-2xl md:rounded-3xl p-5 md:p-6">
                            <div className="flex justify-between items-center mb-5 md:mb-6">
                                <h3 className="text-lg md:text-xl font-bold">Prévisions horaires</h3>
                                <button className="text-xs md:text-sm text-gray-400 hover:text-white transition">
                                    7 prochaines heures
                                </button>
                            </div>

                            <div className="space-y-3 md:space-y-4">
                                {previsions.map((hour, index) => (
                                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-0">
                                        <span className="text-gray-400 w-12 md:w-16 text-sm md:text-base">{hour.time}</span>
                                        <span className="text-gray-400 w-12 md:w-16 text-sm md:text-base">
                                            {hour.icone === 1 ? "☀️" : "🌕"}
                                        </span>
                                        <span className="font-semibold w-10 md:w-12 text-right text-sm md:text-base">{hour?.temp}{weatherData.current_weather_units.temperature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}
export default Weather;