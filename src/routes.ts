
import Qrng from './pages/qrng/Qrng.svelte';
import Documentation from './pages/documentation/Documentation.svelte';
import Demonstration from './pages/demonstrations/Demonstrations.svelte';

export const routes = {
    // root
    '/': Documentation,

    '/demos': Demonstration,
    '/qrng': Qrng
}