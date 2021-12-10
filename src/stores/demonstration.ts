import { writable, get } from 'svelte/store';
import { generators } from './generators';

const default_statistics = {
    mean: null as number,
    max: null as number,
    min: null as number,
    sum: 0,
    Q1: null as number,
    Q2: null as number,
    Q3: null as number,
    Q4: null as number
}

function createGeneratorStatistics() {
	const { subscribe, update, set } = writable({
        generator: get(generators)[0],
        random_values: [],
        statistics: default_statistics,
        active: false,
        elapsed: 0,
        total: 0
    });

	return {
		subscribe,
        set,
        update,
        add: (random_numbers) => update(old => ({
            ...old,
            random_values: [...old.random_values, ...random_numbers]
        })),
        reset_values: () => update(old => ({
            ...old,
            random_values: [],
            statistics: default_statistics,
            elapsed: 0,
            old: 0
        })),
        update_stats: (stats) => update((old) => ({
            ...old,
            statistics: {
                ...old.statistics,
                ...stats
            }
        })),
        update_generator: (generator) => update(() => ({
            generator: generator,
            random_values: [],
            statistics: default_statistics,
            active: false,
            elapsed: 0,
            total: 0
        })),
        status: (value) => update((old) => ({
            ...old,
            active:value
        })),
        tick: () => update((old) => ({
            ...old,
            elapsed: old.elapsed+1
        })),
        update_goal: (goal) => update((old) => ({
            ...old,
            total: old.random_values.length + goal
        }))
	};
}

export const selected_generator = createGeneratorStatistics();

/*

add_values: (random_numbers) => update(old => ({...old, random_values: [...old.random_values, random_numbers]})),
        reset_values: () => update(old => ({...old, random_values: [], statistics: {}})),
        update_generator: (generator) => update(old => ({generator: generator, random_values: [], statistics: {}}))

        */
