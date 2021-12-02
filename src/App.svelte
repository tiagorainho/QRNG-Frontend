<script lang="ts">
	import Router from 'svelte-spa-router'
	import { routes } from './common/routes'
	import Navbar  from './common/ui/Navbar.svelte'
	import Footer from './common/ui/Footer.svelte'

</script>

<body class="flex flex-col min-h-screen">
	<Navbar/>
	<div class="flex-grow px-4 md:px-32 py-12">
    	<Router {routes}/>
	</div>
	<Footer/>
</body>