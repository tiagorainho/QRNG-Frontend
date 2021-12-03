
<script lang="ts">

    import { generators, selected_generator } from '../../stores';
    // { $selected_generator.name }

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

<div class="bg-white shadow overflow-hidden sm:rounded-lg">
    <div class="px-4 py-5 sm:px-6">
        <h3 class="text-lg leading-6 font-medium">
            Statistics
        </h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
            Generator details and live statistics
        </p>
    </div>
    <div class="border-t border-gray-200">
        <dl>
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">
                    Mean
                </dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {mean}
                </dd>
            </div>
        </dl>
    </div>
</div>