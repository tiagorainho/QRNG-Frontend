import { writable, readable } from 'svelte/store';

let fetched_generators = [
    {
        name: "Intel QRNG",
        img: "qrng-logo.png",
        developed_by: 'Intel'
    },
    {
        name: "IT proprietary",
        img: "qrng-logo.png",
        developed_by: 'IT'
    },
    {
        name: "Raspberry PI",
        img: "qrng-logo.png",
        developed_by: 'Raspberry Fundation'
    }
]

export const generators = readable(
    fetched_generators
);

export const selected_generator = writable(
    {
        generator: fetched_generators[0],
        statistics: {
            mean: 20,
            max: 50,
            min: 4,
        }
    }
);
