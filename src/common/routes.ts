
import Qrng from '../qrng/ui/Qrng.svelte';
import Documentation from '../documentation/ui/Documentation.svelte';
import Demonstration from '../demonstration/ui/Demonstrations.svelte';

export const routes = {
    // root
    '/': Documentation,

    '/demos': Demonstration,
    '/qrng': Qrng
}

