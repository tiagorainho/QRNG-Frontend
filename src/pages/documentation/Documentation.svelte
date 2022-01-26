<script>
    import Sidebar from "./components/DocsSidebar.svelte";
    import CodeBlock from "../../components/CodeBlock.svelte";
</script>


<div class="flex relative">
    <!-- Sidebar -->
    <Sidebar/>

    <!-- Documentation -->
    <div class="flex-1 px-8 text-gray-800 space-y-1">
        <h1 class="text-2xl pb-4 font-semibold" id="services">Services</h1>

        <span class="block">In this chapter we will discuss in depth how the services were created and why. All services were purposely created to be loosely coupled with each other.</span>
	    <span class="block">To provide a rapid, frequent and reliable delivery of complex applications, the microservice architecture was chosen. This architecture allows for:</span>
        <ul class="list-decimal pl-8 space-y-1">
            <li>different teams to work on different services with low communications if any while working together</li>
            <li>loosely coupled code and components</li>
            <li>independently deployable</li>
            <li>highly maintainable and testable</li>
        </ul>
        <br>
        <span class="block">The order in which the services will be reviewed is crescent in terms of abstraction.</span>
        <span class="block">All services but RNG were created with java in the Spring Framework, the RNG was created in python because it will be the most used by future users adding generators and python is widely used and easier to use compared to most other languages.</span>


        <h2 class="text-1xl pt-8 font-semibold" id="qrng-service">QRNG Service</h2>
        adad

        <h2 class="text-1xl pt-8 font-semibold" id="qrng-service">Prime Service</h2>

        <div >
            <p class="text-md text-dark-gray">qrng</p>
            <CodeBlock code="
                npm install \\
                npm run dev"/>
        </div>


ada

    </div>

</div>