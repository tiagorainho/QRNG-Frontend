
import { generators } from '../stores/generators'

let all_generators = [
    {
        id: 1,
        name: "Intel QRNG",
        img: "qrng-logo.png",
        developed_by: 'Intel',
        type: 'QUANTUM'
    },
    {
        id: 2,
        name: "IT proprietary",
        img: "qrng-logo.png",
        developed_by: 'IT',
        type: 'PSEUDO-RANDOM'
    },
    {
        id: 3,
        name: "Raspberry PI",
        img: "qrng-logo.png",
        developed_by: 'Raspberry Fundation',
        type: 'PSEUDO-RANDOM'
    },
    {
        id: 4,
        name: "IT QRNG",
        img: "qrng-logo.png",
        developed_by: "IT",
        type: "QUANTUM"
    }
]

export function fetchGenerators() {
    generators.set(all_generators)
}

