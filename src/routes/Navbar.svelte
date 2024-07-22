<script>
  let menuOpen = false;
  function toggleMenu() {
    menuOpen = !menuOpen;
  }
</script>

<nav class="glass p-4 font-serif fixed top-0 left-0 right-0 z-50">
  <div class="container mx-auto mix-blend-saturation flex justify-between">

    <a href="/" class="text-primary font-bold">Stocks and Stuff</a>

    <!--Primary navbar for regular displays-->
    <div class="hidden md:flex space-x-4">
      <a href="/" class="text-gray-300 hover:text-white">Home</a>
      <a data-sveltekit-reload href="/search" class="text-gray-300 hover:text-white">Search</a>
      <a data-sveltekit-reload href="/portfolio" class="text-gray-300 hover:text-white">Portfolio</a>
    </div>

    <!--Hidden navbar for mobile/small displays-->
    <div class="md:hidden">
      <button on:click={toggleMenu} class="text-gray-300 focus:outline-none">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </button>
    </div>
    
  </div>

  <!--Toggle menu for small displays-->
  {#if menuOpen}
  <div class="md:hidden">
    <a href="/" class="block text-gray-300 hover:text-white px-2 py-1">Home</a>
    <a data-sveltekit-reload href="/search" class="block text-gray-300 hover:text-white px-2 py-1">Search</a>
    <a href="/portfolio" class="block text-gray-300 hover:text-white px-2 py-1">Portfolio</a>
  </div>
  {/if}
</nav>