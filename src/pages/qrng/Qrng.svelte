
<script lang="ts">

</script>


<div class="center text-justify">
    <div class="ml-4 text-2xl mb-4 font-bold">IT QRNG</div>
    <div class="mb-10">
        <p>
            Reliable randomness sources are in increasing demand across many key fields such as cryptography and other information technologies. Standard classical approaches for random number generation cannot produce truly unpredictable outcomes and are thus unsuitable for security-critical applications. On the other hand, the intrinsic statistical properties of quantum mechanics can be explored to obtain values that are truly unpredictable.
        </p>
        
    
        <img class="mx-auto mt-2" src="assets/images/QRNG_schema.png" alt="Schematic representation of the quantum random number generator implemented. The scheme can be divided into two mains blocks: the physical layer, which measures the entropy source through homodyne detection, and the postprocessing layer, which eliminates the contributions of classical sources such as electronic noise.">
    </div>
    
    <div>
        <p>
            Our approach harnesses measurements from a quantum noise source to derive true randomness, which is not accessible to an adversary. We have chosen to probe the quantum fluctuations in the vacuum of the electromagnetic field by employing a homodyne detection scheme. As can be seen in the schematic above, by sending a laser through a beam splitter, we allow it to interact with the vacuum state, whose fluctuations will be present in the output beams. These are subsequently measured by two detectors and the resulting signals are subtracted. In a classical description, we would expect the output beams to be identical and no signal to remain. By contrast, here, the random quantum noise is still observable, and a signal proportional to the inherently probabilistic quadrature fluctuations of the optical vacuum state can be measured. Despite this, some additional classical noise is also inevitably introduced by the operation of the intrinsically imperfect hardware devices. Consequently, after quantifying the portion of entropy that originates from the vacuum fluctuations, the measurements are subjected to a randomness extraction algorithm that sacrifices a portion of the output to obtain a uniform distribution.
        </p>
    
        <div class="flex my-4">
            <div class="flex-1">
                <img class="mx-auto" src="assets/images/physical_qrng.png" alt="Quantum random number generator as implemented at Instituto de Telecomunicações">
            </div>
            <div class="flex-1">
                <img class="mx-auto" src="assets/images/noise_sample.jpg" alt="Bitmap (500x500) with the extracted true random bits showing a clear absence of any evident patterns.">
            </div>
        </div>
    </div>
    
    <p>
        Unlike other approaches, the real-time Toeplitz matrix hashing algorithm implemented efficiently extracts information-theoretically secure numbers at a rate of approximately 75 Mbit/s. This approach already supports real-time generation rates up to 8.23 Gbit/s, with the quality of the output being certified by applying on-demand statistical validation. In fact, the generation scheme has been shown to pass all evaluations in the standard NIST, Dieharder, and TestU01's SmallCrush statistical test suites.
    </p>
    


</div>