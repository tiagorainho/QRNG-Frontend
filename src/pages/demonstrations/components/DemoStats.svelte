
<script lang="ts">
    import { selected_generator } from '../../../stores/demonstration';
    import { get } from "svelte/store";

    let mean:number = 20

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function download_random_numbers() {
        let random_numbers = get(selected_generator).random_values;
        let a = document.createElement('a');
        let blob = new Blob(
            [random_numbers.join(", ")], 
            {'type': 'application/octet-stream'}
        );
        a.href = window.URL.createObjectURL(blob);
        a.download = `random_numbers_at_${Date.now()}.csv`;
        a.click();
        /*
        document.location = 'data:Application/octet-stream,' + 
            encodeURIComponent(random_numbers.join(", "));
        */
    }

    async function simulate() {
        for(let i=0; i< 100; i++) {
            let random_number = Math.random();
            if(random_number >= 0.5) mean = mean + random_number;
            else mean = mean - random_number;
            await sleep(2000);
        }
    }
    simulate()
</script>

<div class="bg-white shadow overflow-hidden rounded-lg">
    <div class="flex px-4 py-5 sm:px-6">
        <div class="flex-1">
            <h3 class="text-lg leading-6 font-medium flex">
                <span>Statistics</span>
                {#if $selected_generator.active == true }
                    <span class="flex my-auto ml-4">
                        <span class="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-it-red opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-3 w-3 bg-it-red"></span>
                    </span>
                {/if}
            </h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">
                Live statistics
            </p>
        </div>
        <div class="flex-right">
            {#if $selected_generator.random_values.length > 0 && $selected_generator.active == false}
            <button on:click={download_random_numbers} class="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-2 rounded inline-flex items-center">
                <svg class="fill-current w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
                <span class="ml-2">Random Numbers</span>
            </button>
            {/if}
        </div>
    </div>
    <div class="border-t border-gray-200">
        <dl>
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">
                    Mean
                </dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    { ( $selected_generator.statistics.mean == null ) ? 0: $selected_generator.statistics.mean }
                </dd>
                <dt class="text-sm font-medium text-gray-500">
                    Max
                </dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    { ( $selected_generator.statistics.max == null ) ? 0: $selected_generator.statistics.max }
                </dd>
                <dt class="text-sm font-medium text-gray-500">
                    Min
                </dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    { ( $selected_generator.statistics.min == null ) ? 0: $selected_generator.statistics.min }
                </dd>
            </div>
        </dl>
    </div>
</div>