
<script lang="ts">
    import { selected_generator } from '../../../stores/demonstration';
    
    let mean:number = 20

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
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
    <div class="px-4 py-5 sm:px-6">
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