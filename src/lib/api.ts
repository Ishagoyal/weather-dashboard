// src/lib/api.ts
export async function getWeather(location: string): Promise<any> {
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY; // Ensure you have this in your .env file
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch weather data');
    }
    return response.json();
}
