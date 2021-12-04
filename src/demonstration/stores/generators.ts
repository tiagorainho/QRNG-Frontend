import { readable } from 'svelte/store';

let all_generators = [
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
    all_generators
);