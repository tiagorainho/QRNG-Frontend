
<script lang="ts">
  import { fetch, stop_fetch } from '../../../services/DemonstrationService';
  import { selected_generator } from '../../../stores/demonstration';

  let value:number = 10;

  $:size = value**3;

</script>


<div class="flex flex-col pt-4 space-y-3 mx-auto">
  <div>
    <input type="range" max="100" bind:value={value} class="range" disabled={$selected_generator.active}>
    <span>{size}</span>
  </div>

  {#if $selected_generator.active}
    <button class="transition-colors duration-150 w-48 animate-pulse bg-red-700 opacity-80 rounded-md text-center py-1 text-white cursor-pointer" on:click={() => stop_fetch()}>
      Pause...
    </button>
  {:else}
    <button class="transition-colors duration-150 w-48 { (value>0)? 'bg-gray-400 text-white': 'bg-gray-300 text-gray-700'} rounded-md text-center py-1  cursor-pointer" on:click={() => fetch(size)}>
      Generate
    </button>
  {/if}
</div>