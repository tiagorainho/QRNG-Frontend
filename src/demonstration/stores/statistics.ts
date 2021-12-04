import { writable, get } from 'svelte/store';
import { generators } from './generators';


function createGeneratorStatistics() {
	const { subscribe, update, set } = writable({
        generator: get(generators)[0],
        random_values: [],
        statistics: {}
    });

	return {
		subscribe,
        add: (random_numbers) => update(old => ({...old, random_values: [...old.random_values, random_numbers]})),
        reset_values: () => update(old => ({...old, random_values: [], statistics: {}})),
        update: (generator) => update(old => ({generator: generator, random_values: [], statistics: {}}))
	};
}


export const selected_generator = createGeneratorStatistics();
