<script lang="ts">
	import { onMount } from 'svelte';
	import { getWeatherForecast } from '$lib/api';
	import { page } from '$app/stores';

	interface WeatherCondition {
		main: string;
		description: string;
	}

	interface ForecastEntry {
		dt: number;
		main: {
			temp: number;
			feels_like: number;
			temp_min: number;
			temp_max: number;
			humidity: number;
		};
		weather: WeatherCondition[];
		dt_txt: string;
	}

	interface DailySummary {
		date: string;
		temp_min: number;
		temp_max: number;
		conditions: string;
	}

	let forecastData = null;
	let error = '';
	let dailySummaries: DailySummary[] = [];

	onMount(async () => {
		try {
			let location = $page.params.location;
			forecastData = await getWeatherForecast(location);
			dailySummaries = processForecastData(forecastData.list);
		} catch (e) {
			if (e instanceof Error) {
				error = e.message || 'An unexpected error occurred';
			}
		}
	});

	function processForecastData(data: ForecastEntry[] | undefined): DailySummary[] {
		if (!data) {
			console.error('Data is undefined or not an array.');
			return []; // Return an empty array if data is undefined
		}

		const daily: Record<string, DailySummary> = {};

		data.forEach((entry) => {
			const date = entry.dt_txt.split(' ')[0]; // Get the date part
			const newDate = new Date(date);
			const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' };
			const formattedDate = newDate.toLocaleString('en-US', options);
			if (!daily[date]) {
				daily[date] = {
					temp_min: entry.main.temp_min,
					temp_max: entry.main.temp_max,
					conditions: entry.weather[0].description,
					date: formattedDate
				};
			} else {
				daily[date].temp_min = Math.min(daily[date].temp_min, entry.main.temp_min);
				daily[date].temp_max = Math.max(daily[date].temp_max, entry.main.temp_max);
			}
		});

		return Object.values(daily);
	}
</script>

{#if dailySummaries.length > 0}
	<div class="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen">
		<h1 class="text-3xl font-bold text-center text-blue-500 mb-10">5-Day Weather Forecast</h1>
		<div
			class="grid grid-cols-3 gap-4 px-10 py-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md"
		>
			{#each dailySummaries as day, index}
				<div
					class="bg-white rounded-lg shadow-lg p-6 mb-4 {index % 2 === 0
						? 'bg-blue-50'
						: 'bg-blue-100'}"
				>
					<h2 class="text-xl font-semibold text-gray-800 mb-4">{day.date}</h2>
					<p class="text-gray-600">Min Temp: {day.temp_min} K</p>
					<p class="text-gray-600">Max Temp: {day.temp_max} K</p>
					<p class="text-blue-500">Conditions: {day.conditions}</p>
				</div>
			{/each}
		</div>
	</div>
{:else}
	<p class="text-center text-gray-500">Loading forecast...</p>
{/if}
