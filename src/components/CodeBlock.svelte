<script lang="ts">
    export let code:string;

</script>

<div class="max-w-3xl mx-auto my-10 font-mono">
    <div class="w-full h-11 relative rounded-t-lg bg-gray-900 flex overflow-hidden justify-start items-center space-x-1.5 px-2">
        <div class="absolute w-full h-full inset-0 bg-gray-900 opacity-50  rounded-b-lg"></div>
        <span class="relative w-3 h-3 border-2 rounded-full border-red-400 bg-red-400"></span>
        <span class="relative w-3 h-3 border-2 rounded-full border-yellow-400 bg-yellow-400"></span>
        <span class="relative w-3 h-3 border-2 rounded-full border-green-400 bg-green-400"></span>
    </div>
    <div class="relative bg-gray-900 w-full h-32 border-gray-900 rounded-b-lg">
        <div class="absolute w-full h-full inset-0 bg-gray-900 py-4 px-8 text-gray-300 rounded-b-lg">
            { @html code.replaceAll('\\', '<br>') }
        </div>
    </div>
</div>


