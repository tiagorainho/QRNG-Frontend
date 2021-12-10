
<script lang="ts">
  import DemoStats from "./components/DemoStats.svelte";
  import GeneratorStats from "./components/GeneratorStats.svelte";
  import GeneratorSelection from "./components/GeneratorSelection.svelte";
  import StartDemo from "./components/StartDemo.svelte";

  import Demo1 from "./demos/Demo1.svelte";
  import Demo2 from "./demos/Demo2.svelte";
  import Demo3 from "./demos/Demo3.svelte";

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
    <Demo1/>
    <Demo2/>
    <Demo3/>
  </div>
</div>