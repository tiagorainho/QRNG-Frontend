<script lang="ts">
    import { generators } from '../../../stores/generators';
    import {selected_generator } from '../../../stores/demonstration';
    import { fly } from 'svelte/transition';
    import type { Generator } from '../../../models/Generator';

    let dropdownOpen = false;

    const switch_generator = (generator) => {
        selected_generator.update(generator);
        dropdownOpen = false;
    }

</script>

<div>
    <h3 class="block text-sm font-medium text-gray-700">
        Select the Generator
    </h3>
    <div class="mt-1 relative">
        <button on:click={() => dropdownOpen = !dropdownOpen} type="button" class="relative w-full cursor-pointer bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-transparent sm:text-sm" aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label">
            <span class="flex items-center">
                <img src="{ $selected_generator.generator.img }" alt="" class="flex-shrink-0 h-6 w-6 rounded-full">
                <span class="ml-3 block truncate  transition ease-in duration-1000">
                    { $selected_generator.generator.name }
                </span>
            </span>
            <span class="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <!-- Heroicon name: solid/selector -->
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
            </span>
        </button>
  
      <!--
        Select popover, show/hide based on select state.
  
        Entering: ""
          From: ""
          To: ""
        Leaving: "transition ease-in duration-100"
          From: "opacity-100"
          To: "opacity-0"
      -->
    {#if dropdownOpen}
        <ul on:mouseleave={() => dropdownOpen = false} on:blur transition:fly="{{ y: -10, duration: 100 }}" class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm" tabindex="-1" role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-option-3">
            {#each $generators as generator}
                <!--
                Select option, manage highlight styles based on mouseenter/mouseleave and keyboard navigation.
        
                Highlighted: "text-white bg-indigo-600", Not Highlighted: "text-gray-900"
                -->
                <li on:click={() => switch_generator(generator)} class="text-gray-900 select-none relative py-2 pl-3 pr-9 hover:bg-gray-200 cursor-pointer" id="listbox-option-0" role="option">
                    <div class="flex items-center">
                        <img src="{generator.img}" alt="" class="flex-shrink-0 h-6 w-6 rounded-full">
                        <!-- Selected: "font-semibold", Not Selected: "font-normal" -->
                        <span class="font-normal ml-3 block truncate">
                            { generator.name }
                        </span>
                    </div>
            
                    <!--
                        Checkmark, only display for selected option.
            
                        Highlighted: "text-white", Not Highlighted: "text-indigo-600"
                    -->
                    <span class="text-green-400 absolute inset-y-0 right-0 flex items-center pr-4">
                        <!-- Heroicon name: solid/check -->
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                    </span>
                </li>
            {/each}
        </ul>
    {/if}
    </div>
  </div>