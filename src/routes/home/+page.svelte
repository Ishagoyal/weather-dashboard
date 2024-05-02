<!-- src/routes/index.svelte -->
<script lang="ts">
	import Search from '$lib/Search.svelte';
	import { getWeather } from '$lib/api';
	import { writable } from 'svelte/store';
	import { goto } from '$app/navigation';

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
				error.set(e.message);
			} else {
				error.set('An unexpected error occurred');
			}
			weatherData.set(null);
		}
	}
    function viewForecast() {
    goto(`/forecast/${encodeURIComponent($weatherData.name)}`);
}

	const formatDate = (date) => {
		return new Date(date).toLocaleDateString(undefined, {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};
</script>

<Search on:search={handleSearch} />

<div class="mt-8">
	{#if $weatherData}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			role="button"
			tabindex="0"
			on:click={viewForecast}
			class="cursor-pointer max-w-4xl mx-auto bg-gradient-to-r from-blue-500 to-blue-300 rounded-xl shadow-lg overflow-hidden p-5 text-white focus:outline-none"
		>
			<div class="flex justify-between items-center mb-4">
				<h1 class="text-3xl font-bold">{$weatherData.name}</h1>
				<span>{formatDate(new Date())}</span>
			</div>
			<h2 class="text-2xl mb-2">Temperature: {$weatherData.main.temp} °C</h2>
			<div class="grid grid-cols-3 gap-4">
				<div class="bg-blue-700 bg-opacity-50 rounded-lg p-3">
					<h3 class="font-semibold">Conditions</h3>
					<p>{$weatherData.weather[0].description}</p>
				</div>
				<div class="bg-blue-700 bg-opacity-50 rounded-lg p-3">
					<h3 class="font-semibold">Humidity</h3>
					<p>{$weatherData.main.humidity}%</p>
				</div>
				<div class="bg-blue-700 bg-opacity-50 rounded-lg p-3">
					<h3 class="font-semibold">Wind Speed</h3>
					<p>{$weatherData.wind.speed} km/h</p>
				</div>
			</div>
		</div>
	{:else if $error}
		<div class="text-center">
			<p class="text-red-500">{error}</p>
		</div>
	{:else}
		<div class="text-center">
			<p class="text-gray-500">Enter a location to see the weather.</p>
		</div>
	{/if}
</div>
