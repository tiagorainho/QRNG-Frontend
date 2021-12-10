
<script lang="ts">
    import { selected_generator } from '../../../stores/demonstration';

    let show_tooltip:boolean = false;
</script>

{#if $selected_generator.active}
<div class="w-full h-full sticky">
    <div on:mouseleave={() => show_tooltip = false} on:blur class='w-96 {show_tooltip? '': 'invisible'} absolute rounded shadow-lg px-8 py-4 bg-white text-gray-500 -ml-96 mt-8 z-40'>
        <div class="absolute top-0 right-2">
            <a href="/#/demos" on:click={() => show_tooltip = false}>Back</a>
        </div>
        <div class="grid grid-cols-2">
            <div class="w-1/2">
                <dt class="text-sm font-medium text-gray-500">
                    Generated
                </dt>
                <dd class="text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    { $selected_generator.random_values.length }
                </dd>
            </div>
            <div class="w-1/2">
                <dt class="text-sm font-medium text-gray-500">
                    Elapsed
                </dt>
                <dd class="text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    { $selected_generator.elapsed } s
                </dd>
            </div>
        </div>
        <div class="border-t border-gray-200 w-full"></div>
        <div class="grid grid-cols-2 pt-4">
            <div class="w-1/2">
                <dt class="text-sm font-medium text-gray-500">
                    Min
                </dt>
                <dd class="text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    { ($selected_generator.statistics.min == null)? '0': $selected_generator.statistics.min.toFixed(8) }
                </dd>
            </div>
            <div class="w-1/2">
                <dt class="text-sm font-medium text-gray-500">
                    Mean
                </dt>
                <dd class="text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    { ($selected_generator.statistics.mean == null) ? '0': $selected_generator.statistics.mean.toFixed(8) }
                </dd>
            </div>
            <div class="w-1/2">
                <dt class="text-sm font-medium text-gray-500">
                    Max
                </dt>
                <dd class="text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    { ($selected_generator.statistics.max == null) ? '0': $selected_generator.statistics.max.toFixed(8) }
                </dd>
            </div>
        </div>
        
    </div>
    <button on:click={() => show_tooltip = !show_tooltip} class="flex rounded-full bg-gray-200 text-gray-500 w-full h-full cursor-pointer animate-bounce scale-125">
        <span class="m-auto">
            { (($selected_generator.random_values.length / $selected_generator.total) * 100).toFixed(1) } %
        </span>
    </button>
</div>
    
{/if}

