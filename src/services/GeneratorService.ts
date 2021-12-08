
import { generators } from '../stores/generators'
import { selected_generator } from "../stores/demonstration";

let all_generators = [
    {
        id: 1,
        name: "Intel QRNG",
        img: "qrng-logo.png",
        developed_by: 'Intel'
    },
    {
        id: 2,
        name: "IT proprietary",
        img: "qrng-logo.png",
        developed_by: 'IT'
    },
    {
        id: 3,
        name: "Raspberry PI",
        img: "qrng-logo.png",
        developed_by: 'Raspberry Fundation'
    }
]

export function fetchGenerators() {
    generators.set(all_generators)
    selected_generator.add(all_generators[0])
}

