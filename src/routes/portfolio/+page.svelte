<script lang="ts">
    import { userStock, stockSymbol } from '../stores';
    import { onMount, onDestroy } from 'svelte';
    import { fetchStockData, fetchCompanyData } from "../finnhub";
    import { writable } from 'svelte/store';
	import type { MouseEventHandler } from 'svelte/elements';
    import { formatNumber } from '$lib/formatNumber';

    // Define the types for the data
    interface CompanyData {
        country: string;
        currency: string;
        estimateCurrency: string;
        exchange: string;
        finnhubIndustry: string;
        ipo: string;
        logo: string;
        marketCapitalization: number;
        name: string;
        phone: string;
        shareOutstanding: number;
        ticker: string;
        weburl: string;
    }

    interface StockData {
        c: number;
        h: number;
        l: number;
        o: number;
        pc: number;
        t: number;
    }

    interface StockInfo {
        stock: string;
        company: CompanyData;
        stockData: StockData;
    }

    let stocks = writable<StockInfo[]>([]);

    let loading = writable(true);
    let error = writable<string | null>(null);

    // Stores the data from the API in a list for rendering
    async function loadData() {
        error.set(null);

        let stockInfo: StockInfo[] = [];
        try {
            for (const stock of $userStock) {
                const [company, stockData] = await Promise.all([
                    fetchCompanyData(stock),
                    fetchStockData(stock)
                ]);
                stockInfo.push({ stock, company, stockData });
            }
            stocks.set(stockInfo);
        } finally {
            loading.set(false);
        }
    }

    function searchStock(stock: string): MouseEventHandler<HTMLAnchorElement> {
        return async (event) => {
            event.preventDefault();
            stockSymbol.set(stock);
            window.location.href = '/search';
        };
    }

    function removeStock(stock: string): MouseEventHandler<HTMLButtonElement> {
        return async (event) => {
            loading.set(true);
            event.preventDefault();
            userStock.update(value => value.filter(s => s !== stock));
            loadData();
        };
    }

    onMount(() => {
        loadData();
        const interval = setInterval(() => {
            loadData();
        }, 10000);  // Refresh every 10 seconds

        onDestroy(() => {
            clearInterval(interval);
        });
    });

    let showPrice = true;

    function priceOrPercent() {
        showPrice = !showPrice;
    }
</script>

<main class="p-4 pt-20">
    <section class="bg-primary/70 text-white py-6 rounded-box hover:bg-primary/80">
        <div class="container mx-auto text-center">
            <h1 class="text-4xl font-bold">Your Portfolio</h1>
        </div>
    </section>
</main>

{#if $loading}
    <p class="px-4">Loading...</p>

{:else if $error}
    <p>Error: {$error}</p>

{:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
        {#each $stocks as stockInfo}
            <div class="bg-primary/70 text-white rounded-box hover:bg-primary/80 p-6">
                <a data-sveltekit-reload href="/search" on:click={searchStock(stockInfo.stock.toUpperCase())}>
                    <h2 class="text-2xl font-bold">${stockInfo.stock.toUpperCase()}</h2>
                    <div class="company-info mb-4 flex pt-4">
                        <img src={stockInfo.company.logo} alt={stockInfo.company.name} class="w-10 h-10"/>
                        <p class="text-3xl font-bold px-4 pt-1">{stockInfo.company.name}</p>
                    </div>
                </a>
                <div class="stock-price mb-4 inline-flex flex-wrap">
                    <p class="text-5xl font-bold pt-1">${ formatNumber(stockInfo.stockData.c) } </p>
                    {#if stockInfo.stockData.c < stockInfo.stockData.pc}
                        {#if showPrice === true}
                            <button class="text-2xl pt-4 px-3 text-red-700" on:click={priceOrPercent}> (▼${formatNumber((stockInfo.stockData.pc - stockInfo.stockData.c))})</button>
                        {:else}
                            <button class="text-2xl pt-4 px-3 text-red-700" on:click={priceOrPercent}> (▼{formatNumber((100 * (stockInfo.stockData.pc - stockInfo.stockData.c) / stockInfo.stockData.pc))}%)</button>
                        {/if}
                    {:else if stockInfo.stockData.c === stockInfo.stockData.pc}
                        {#if showPrice === true}
                            <button class="text-2xl pt-4 px-3 text-gray-400" on:click={priceOrPercent}> ($0.00)</button>
                        {:else}
                            <button class="text-2xl pt-4 px-3 text-gray-400" on:click={priceOrPercent}> (0.00%)</button>
                        {/if}
                    {:else}
                        {#if showPrice === true}
                            <button class="text-2xl pt-4 px-3 text-green-400" on:click={priceOrPercent}> (▲${formatNumber((stockInfo.stockData.c - stockInfo.stockData.pc))})</button>
                        {:else}
                            <button class="text-2xl pt-4 px-3 text-green-400" on:click={priceOrPercent}> (▲{formatNumber((100 * (stockInfo.stockData.c - stockInfo.stockData.pc) / stockInfo.stockData.pc))}%)</button>
                        {/if}
                    {/if}
                </div>
                    <button class="text-sm border-gray-300 text-gray-300 border-2 rounded-full px-1 hover:text-gray-50 hover:border-gray-50" on:click={removeStock(stockInfo.stock)}>⊖ Remove from Portfolio</button>
            </div>
        {/each}
        
        <a data-sveltekit-reload href="/search">
            <div class="bg-primary/20 border-dashed border-2 border-gray-400 rounded-box p-9 text-white/70 hover:bg-primary/10 hover:text-white/50">
                <h2 class="text-9xl text-center p-5">⊕</h2>
            </div>
        </a>
    </div>
{/if}