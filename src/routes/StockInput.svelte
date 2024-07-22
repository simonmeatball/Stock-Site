<script>
    import { stockSymbol } from './stores';
</script>

<div>
    <input type="text" placeholder="Enter stock symbol" bind:value={$stockSymbol} class="bg-zinc-100 border text-gray-900 border-gray-400 text-center rounded-lg focus:border-blue-400 px-2 py-1 hover:bg-white"/>
</div>