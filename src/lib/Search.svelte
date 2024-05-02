<script lang="ts">
    import { createEventDispatcher } from 'svelte';
  
    const dispatch = createEventDispatcher();
  
    let searchTerm: string = '';
  
    function submitSearch() {
      if (searchTerm.trim()) {
        dispatch('search', { searchTerm });
      }
    }
  </script>
  
  <div class="flex justify-center items-center my-4">
    <input
      type="text"
      bind:value={searchTerm}
      on:keyup={(event) => event.key === 'Enter' && submitSearch()}
      placeholder="Enter city name or zip code"
      class="p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
    <button
      on:click={submitSearch}
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-lg"
    >
      Search
    </button>
  </div>
  
  <style>
    input, button {
      transition: all 0.2s;
    }
  </style>
  