
<script lang="ts">
  import DemoStats from "./components/DemoStats.svelte";
  import GeneratorSelection from "./components/GeneratorSelection.svelte";
</script>

<div>
  <div class="flex flex-col md:flex-row gap-x-20 pb-16 space-y-4 justify-center mx-auto">
    <div class="w-64">
      <GeneratorSelection/>
    </div>
    <div class="flex-grow">
      <DemoStats/>
    </div>
  </div>
  
  <div class="grid justify-items-start">
  
    <div>1</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
    <div>5</div>
    <div>6</div>
  </div>
  <br>
  <div class="flex justify-between ...">
    <div class="order-last">1</div>
    <div>2</div>
    <div>3</div>
  </div>
</div>
