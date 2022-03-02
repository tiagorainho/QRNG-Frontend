
<script lang="ts">
  import DemoStats from "./components/DemoStats.svelte";
  import GeneratorStats from "./components/GeneratorStats.svelte";
  import GeneratorSelection from "./components/GeneratorSelection.svelte";
  import StartDemo from "./components/StartDemo.svelte";

  import Demo1 from "./demos/Demo1.svelte";
  import Demo2 from "./demos/Demo2.svelte";
  import Demo3 from "./demos/Demo3.svelte";

  let demos = {
    demo1: {
      active: false
    },
    demo2: {
      active: false
    },
    demo3: {
      active: false
    },
  };

  function toggle_demo(demo) {
    demos[demo]['active'] = !demos[demo]['active'];
  }

</script>

<div>
  <div class="flex flex-col xl:flex-row gap-x-20 pb-16 space-y-4 justify-center">
    <div class="flex flex-col">
      <GeneratorSelection/>
      <StartDemo/>
    </div>
    <div class="flex-1">
      <GeneratorStats/>
    </div>
    <div class="flex-1">
      <DemoStats/>
    </div>
  </div>

  <div class="grid grid-cols-2 gap-x-12 gap-y-6">
    <!-- Demo 1 -->
    {#if demos['demo1']['active']}
      <div class="relative">
        <div class="absolute top-0 right-0 ">
          <button on:click={() => toggle_demo('demo1')} type="button" class="bg-gray-100 rounded-md p-1 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 mr-1 mt-1">
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <Demo1/>
      </div>
    {:else}
      <button class="py-8 hover:bg-gray-100 hover:text-large bg-white shadow overflow-hidden rounded-lg" on:click={() => toggle_demo("demo1")}>
        <h3 class="text-lg leading-6 font-medium">
            Aproximation of Pi (π)
        </h3>
      </button>
    {/if}

    <!-- Demo 2 -->
    {#if demos['demo2']['active']}
      <div class="relative">
        <div class="absolute top-0 right-0 ">
          <button on:click={() => toggle_demo('demo2')} type="button" class="bg-gray-100 rounded-md p-1 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 mr-1 mt-1">
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <Demo2/>
      </div>
    {:else}
      <button class="py-8 hover:bg-gray-100 hover:text-large bg-white shadow overflow-hidden rounded-lg" on:click={() => toggle_demo("demo2")}>
        <h3 class="text-lg leading-6 font-medium">
            Demonstration 2
        </h3>
      </button>
    {/if}

    <!-- Demo 3 -->
    {#if demos['demo3']['active']}
      <div class="relative">
        <div class="absolute top-0 right-0 ">
          <button on:click={() => toggle_demo('demo3')} type="button" class="bg-gray-100 rounded-md p-1 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 mr-1 mt-1">
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <Demo3/>
      </div>
    {:else}
      <button class="py-8 hover:bg-gray-100 hover:text-large bg-white shadow overflow-hidden rounded-lg" on:click={() => toggle_demo("demo3")}>
        <h3 class="text-lg leading-6 font-medium">
            Demonstration 3
        </h3>
      </button>
    {/if}
  </div>
</div>