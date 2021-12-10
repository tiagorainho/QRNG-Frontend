import { selected_generator } from "../stores/demonstration";
import { generators as generatorStore } from "../stores/generators";
import { get } from "svelte/store";
import type { Generator } from "../models/Generator";

let MAX_SINGLE_CALL_AMOUNT:number = 2000;

export function assignGenerator() {
    let generators:Generator[] = get(generatorStore)
    let default_generator:Generator = generators[0];

    for(let generator of generators)
        if(generator.name == "IT QRNG")
            default_generator = generator
    
    selected_generator.update_generator(default_generator)
}

function fetch_from_server(n : number) {
    let random_numbers = []
    while(n>0) {
        random_numbers.push(Math.random())
        n -= 1
    }
    return random_numbers
}


function update_statistics(new_random_numbers:number[]) {
    let stats = get(selected_generator).statistics
    let sum:number = 0
    let max:number = stats.max
    let min:number = stats.min
    
    for(let number of new_random_numbers) {

        sum += number
        if(max == null || number > stats.max) max = number
        if(min == null || number < stats.min) min = number

    }

    let store = get(selected_generator)
    selected_generator.update_stats({
            sum: store.statistics.sum + sum,
            mean: (store.statistics.sum + sum)/(store.random_values.length+new_random_numbers.length),
            max: max,
            min: min
        }
    )
}

export async function fetch(n : number) {
    if(n<=0) return

    selected_generator.status(true)

    const elapse_manager = setInterval(() => {
        selected_generator.tick()
    }, 1000);

    selected_generator.update_goal(n)

    while(n > 0) {
        // break loop when there is a stop signal
        if(!get(selected_generator).active) break
        
        // fetch n or MAX_SINGLE_CALL_AMOUNT from server based on the remaining quantity needed
        let to_fetch = (n / MAX_SINGLE_CALL_AMOUNT < 1) ? n: MAX_SINGLE_CALL_AMOUNT;
        let new_random_numbers = fetch_from_server(to_fetch)
        await sleep(10);
        selected_generator.add(new_random_numbers)
        n -= new_random_numbers.length
        
        update_statistics(new_random_numbers)
    }

    clearInterval(elapse_manager);
    await sleep(600);
    selected_generator.status(false)
}

export function stop_fetch() {
    selected_generator.status(false)
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}