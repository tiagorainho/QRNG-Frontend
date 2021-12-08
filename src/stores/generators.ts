import { writable } from 'svelte/store';
import type { Generator } from '../models/Generator';



function createGenerators() {
	const { subscribe, update, set } = writable(
        [] as Generator[]
    );

	return {
		subscribe,
        set,
        add: (new_generator) => update(old => ([...old, new_generator]))
	};
}

export const generators = createGenerators();
