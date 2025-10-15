import { useState, useEffect } from "react";

function Weather(){
    const [weatherData, setWeatherData] = useState(null);
    const [villelat, setVillelat] = useState(null);
    const [villelong, setVillelong] = useState(null);
    const [ville, setVille] = useState("Paris");
    const [date, setDate] = useState(null);
    const [nextHourForecast, setNextHourForecast] = useState(null);
    const [dayoe, setDayoe] = useState(null);
    


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


            const weatherdata = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true&daily=uv_index_max,temperature_2m_max,temperature_2m_min,sunrise,sunset&hourly=temperature_2m,apparent_temperature,precipitation,surface_pressure,is_day,wind_speed_10m,precipitation_probability`)
            .then(response => response.json())
            
            setWeatherData(weatherdata);
            console.log("données météto", weatherdata);

            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hour = String(now.getHours()).padStart(2, '0');
            const currentHourString = `${year}-${month}-${day}T${hour}:00`;
            const currentDay = `${year}-${month}-${day}`;
            setDate(currentDay);

            const currentIndexDay = weatherdata.daily.time.findIndex(time => time === currentDay);
            if (currentIndexDay !== -1 && currentIndexDay + 1 < weatherdata.daily.time.length) {
                const dailyUV = weatherdata.daily.uv_index_max[currentIndexDay];
                setDayoe({
                    UV: Math.round(dailyUV),
                });
            }

            const currentIndexHour = weatherdata.hourly.time.findIndex(time => time === currentHourString);
            if (currentIndexHour !== -1 && currentIndexHour + 1 < weatherdata.hourly.time.length) {
                const nextHourIndex = currentIndexHour + 1;
                const forecastTemp = weatherdata.hourly.apparent_temperature[nextHourIndex];
                const forecastPressure = weatherdata.hourly.surface_pressure[nextHourIndex]; 
                setNextHourForecast({
                    temp: forecastTemp,
                    pressure: forecastPressure
                });
            }
            
        };
        fetchvilleweather();
    },
    []);


    if (weatherData === null){
        return(
            <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
                <h1 className="text-3xl font-bold text-white">Chargement en cours...</h1>
            </div>
        )
    };

    return (
        <div className="min-h-screen bg-[#0a0e27] text-white">
            {/* Navigation Bar */}
            <nav className="flex justify-between items-center px-4 md:px-8 py-4 md:py-6">
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-xl md:text-2xl">☀️</span>
                    </div>
                    <span className="text-lg md:text-xl font-bold">Weather Now</span>
                </div>
                <button className="px-4 md:px-6 py-2 bg-[#1a1f3a] rounded-lg border border-gray-700 hover:border-gray-600 transition text-sm md:text-base">
                    Unités ▾
                </button>
            </nav>

            {/* Main Content */}
            <div className="px-4 md:px-8 py-6 md:py-8">
                {/* Heading */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6 md:mb-8">
                    Comment est le ciel aujourd'hui ?
                </h1>

                {/* Search Section */}
                <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8 md:mb-12 max-w-2xl mx-auto">
                    <input 
                        type="text" 
                        placeholder="Rechercher un lieu..."
                        className="w-full sm:flex-1 px-4 md:px-6 py-3 bg-[#1a1f3a] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition"
                    />
                    <button className="px-6 md:px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition whitespace-nowrap">
                        Rechercher
                    </button>
                </div>

                {/* Two Column Layout */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Column - Main Weather */}
                    <div className="flex-1">
                        {/* Main Weather Card */}
                        <div className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl md:rounded-3xl p-6 md:p-8 mb-6 overflow-hidden">
                            {/* Decorative floating dots */}
                            <div className="absolute top-10 right-10 w-3 h-3 bg-white/30 rounded-full"></div>
                            <div className="absolute top-24 right-32 w-2 h-2 bg-white/20 rounded-full hidden md:block"></div>
                            <div className="absolute bottom-20 left-20 w-4 h-4 bg-white/25 rounded-full hidden md:block"></div>
                            <div className="absolute bottom-32 right-16 w-2 h-2 bg-white/30 rounded-full"></div>
                            
                            <div className="relative z-10">
                                <h2 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">{ville}</h2>
                                <p className="text-base md:text-lg opacity-90 mb-6 md:mb-8">{date}</p>
                                
                                <div className="flex items-center justify-between">
                                    <div className="text-6xl md:text-7xl lg:text-8xl font-bold">
                                        {Math.round(weatherData.current_weather.temperature)}°
                                    </div>
                                    <div className="text-7xl md:text-8xl lg:text-9xl">
                                        ☀️
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Weather Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                            {/* Feels Like */}
                            <div className="bg-[#1a1f3a] rounded-xl md:rounded-2xl p-4 md:p-6">
                                <p className="text-gray-400 text-xs md:text-sm mb-2">Ressenti</p>
                                {nextHourForecast && nextHourForecast.temp ? (
                                    <p className="text-xl md:text-2xl font-bold">
                                        {Math.round(nextHourForecast.temp)}°
                                    </p>
                                ) : (
                                    <p className="text-base md:text-lg text-gray-500">--°</p>
                                )}
                            </div>

                            {/* Humidity - Placeholder */}
                            <div className="bg-[#1a1f3a] rounded-xl md:rounded-2xl p-4 md:p-6">
                                <p className="text-gray-400 text-xs md:text-sm mb-2">Humidité</p>
                                <p className="text-xl md:text-2xl font-bold">46%</p>
                            </div>

                            {/* Wind */}
                            <div className="bg-[#1a1f3a] rounded-xl md:rounded-2xl p-4 md:p-6">
                                <p className="text-gray-400 text-xs md:text-sm mb-2">Vent</p>
                                <p className="text-xl md:text-2xl font-bold">
                                    {Math.round(weatherData.current_weather.windspeed)}
                                    <span className="text-xs md:text-sm ml-1">{weatherData.current_weather_units.windspeed}</span>
                                </p>
                            </div>

                            {/* Precipitation - Placeholder */}
                            <div className="bg-[#1a1f3a] rounded-xl md:rounded-2xl p-4 md:p-6">
                                <p className="text-gray-400 text-xs md:text-sm mb-2">Précipitation</p>
                                <p className="text-xl md:text-2xl font-bold">0 mm</p>
                            </div>
                        </div>

                        {/* Additional Info Row */}
                        <div className="grid grid-cols-2 gap-3 md:gap-4 mt-3 md:mt-4">
                            {/* Pressure */}
                            {nextHourForecast && nextHourForecast.pressure ? (
                                <div className="bg-[#1a1f3a] rounded-xl md:rounded-2xl p-4 md:p-6">
                                    <p className="text-gray-400 text-xs md:text-sm mb-2">Pression</p>
                                    <p className="text-xl md:text-2xl font-bold">
                                        {Math.round(nextHourForecast.pressure)} hPa
                                    </p>
                                </div>
                            ) : null}

                            {/* UV Index */}
                            {dayoe && dayoe.UV ? (
                                <div className="bg-[#1a1f3a] rounded-xl md:rounded-2xl p-4 md:p-6">
                                    <p className="text-gray-400 text-xs md:text-sm mb-2">Indice UV</p>
                                    <p className="text-xl md:text-2xl font-bold">{dayoe.UV}</p>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {/* Right Column - Hourly Forecast */}
                    <div className="w-full lg:w-80">
                        <div className="bg-[#1a1f3a] rounded-2xl md:rounded-3xl p-5 md:p-6">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-5 md:mb-6">
                                <h3 className="text-lg md:text-xl font-bold">Prévisions horaires</h3>
                                <button className="text-xs md:text-sm text-gray-400 hover:text-white transition">
                                    Aujourd'hui ▾
                                </button>
                            </div>

                            {/* Hourly Forecast List - Placeholder */}
                            <div className="space-y-3 md:space-y-4">
                                {[
                                    { time: '15:00', icon: '☁️', temp: 24 },
                                    { time: '16:00', icon: '⛅', temp: 23 },
                                    { time: '17:00', icon: '☀️', temp: 22 },
                                    { time: '18:00', icon: '☀️', temp: 21 },
                                    { time: '19:00', icon: '🌤️', temp: 20 },
                                    { time: '20:00', icon: '☁️', temp: 19 },
                                    { time: '21:00', icon: '🌙', temp: 18 },
                                    { time: '22:00', icon: '🌙', temp: 17 },
                                ].map((hour, index) => (
                                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-0">
                                        <span className="text-gray-400 w-12 md:w-16 text-sm md:text-base">{hour.time}</span>
                                        <span className="text-xl md:text-2xl">{hour.icon}</span>
                                        <span className="font-semibold w-10 md:w-12 text-right text-sm md:text-base">{hour.temp}°</span>
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