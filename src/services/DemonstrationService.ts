import { selected_generator } from "../stores/demonstration";
import { generators as generatorStore } from "../stores/generators";
import { get } from "svelte/store";
import type { Generator } from "../models/Generator";





export function assignGenerator() {
    let generators:Generator[] = get(generatorStore)
    let default_generator:Generator = generators[0];

    for(let generator of generators)
        if(generator.name == "IT")
            default_generator = generators[0]
    
    selected_generator.update(default_generator)
}