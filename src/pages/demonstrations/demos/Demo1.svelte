
<script lang="ts">
    import { selected_generator } from '../../../stores/demonstration';

    let random_numbers: number[];
    $: random_numbers = $selected_generator.random_values;
    let points: [number, number, boolean][] = [];
    let last_idx: number = 0
    let pi_approximation: number = 0;
    let is_inside: boolean;
    let inside_counter: number = 0;
    let left_side_number: number;
    let right_side_number: number;

    $: {
        for(let i: number=last_idx;i<random_numbers.length;i=i+2) {
            last_idx = random_numbers.length;
            left_side_number = random_numbers[i];
            right_side_number = random_numbers[i+1];
            is_inside = false;
            if(left_side_number * left_side_number + right_side_number * right_side_number <= 1) {
                is_inside = true;
                inside_counter += 1;
            }
            points.push([left_side_number, right_side_number, is_inside])
            points = points
        }
        pi_approximation = inside_counter/random_numbers.length*8
    }

</script>


<div class="flex bg-white shadow overflow-hidden rounded-lg">
    <div class="flex-1 px-4 py-5 sm:px-6">
        <h3 class="text-lg leading-6 font-medium">
            Approximate π
        </h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
            <span class="text-xl text-center mx-auto break-all">{isNaN(pi_approximation)? 0: pi_approximation}</span>
        </p>
    </div>
    <div class="w-1/3 border-2 ml-4 mr-12 my-1">
        <svg viewBox="0 0 500 500">
            {#if points.length > 0}
                {#each points as point}
                <circle cx={point[0]*100 + '%'} cy={point[1]*100 + '%'} r={1} fill={(point[2])? "black": "red"} />
                {/each}
            {/if}
            
        </svg>
    </div>
</div>
