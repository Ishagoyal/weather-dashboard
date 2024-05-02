<!-- src/routes/index.svelte -->
<script lang="ts">
    import Search from '$lib/Search.svelte';
    import { getWeather } from '$lib/api';
    import { writable } from 'svelte/store';

    interface SearchEventDetail {
        searchTerm: string;
    }

    interface WeatherData {
    name: string;
    main: {
        temp: number;
        humidity: number;
    };
    weather: {
        description: string;
    }[];
    wind: {
        speed: number;
    };
}

    let weatherData = writable<WeatherData | null>(null);
    let error = writable('');

    async function handleSearch(event: CustomEvent<SearchEventDetail>) {
        try {
            const data = await getWeather(event.detail.searchTerm);
            weatherData.set(data);
            error.set('');
        } catch (e) {
            if (e instanceof Error) {
                error.set(e.message); // Now safely accessing e.message
            } else {
                error.set('An unexpected error occurred');
            }
            weatherData.set(null);
        }
    }
</script>

<Search on:search={handleSearch} />

<div class="mt-8">
    {#if $weatherData}
        <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
            <div class="md:flex">
                <div class="p-8">
                    <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Weather in {$weatherData.name}</div>
                    <p class="block mt-1 text-lg leading-tight font-medium text-black">Temperature: {$weatherData.main.temp} °C</p>
                    <p class="mt-2 text-gray-500">Conditions: {$weatherData.weather[0].description}</p>
                    <p class="mt-2 text-gray-500">Humidity: {$weatherData.main.humidity}%</p>
                    <p class="mt-2 text-gray-500">Wind Speed: {$weatherData.wind.speed} km/h</p>
                </div>
            </div>
        </div>
    {:else if $error}
        <p class="text-red-500 text-center">{$error}</p>
    {:else}
        <p class="text-center text-gray-500">Enter a location to see the weather.</p>
    {/if}
</div>

