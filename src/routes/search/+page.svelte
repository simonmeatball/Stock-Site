<script>
    import { onMount, onDestroy } from "svelte";
    import { fetchStockData, fetchCompanyData } from "../finnhub";
    import StockChart from "../StockChart.svelte";
    import StockInput from "../StockInput.svelte";
    import { stockSymbol, loading, error, userStock } from "../stores";
    import { formatNumber } from "$lib/formatNumber";

    let companyData = {
        "country": "US",
        "currency": "USD",
        "estimateCurrency": "USD",
        "exchange": "NASDAQ NMS - GLOBAL MARKET",
        "finnhubIndustry": "Technology",
        "ipo": "1980-12-12",
        "logo": "https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/AAPL.png",
        "marketCapitalization": 0,
        "name": "Apple Inc",
        "phone": "14089961010",
        "shareOutstanding": 0,
        "ticker": "AAPL",
        "weburl": ""
    };

    let stockData = {
        "c": 0,
        "h": 0,
        "l": 0,
        "o": 0,
        "pc": 0,
        "t": 0
    };

    let setSymbol = "";

    $: {
        if ($stockSymbol === "") {
            setSymbol = "AAPL";
        }
        else {
            setSymbol = $stockSymbol;
        }
    }

    onMount(() => {
        loadData();
        const interval = setInterval(() => {
            loadData();
        }, 2500);

        onDestroy(() => {
            clearInterval(interval);
        });
    });

    $: loadData(), setSymbol;

    async function loadData() {
        loading.set(true);
        try {
            loading.set(true);
            error.set(null);
            const [company, stockDatas] = await Promise.all([
                fetchCompanyData(setSymbol.toUpperCase()),
                fetchStockData(setSymbol.toUpperCase())
            ]);

            companyData = company;
            stockData = stockDatas;
        } finally {
            loading.set(false);
        }
    }

    async function addToPortfolio() {
        // Add the stock to the user's portfolio
        console.log("Add to Portfolio");
        let isInPortfolio = false;
        userStock.subscribe(value => {
            isInPortfolio = value.includes(setSymbol.toUpperCase());
        });
        
        if (isInPortfolio) {
            alert("Stock already in portfolio");
        }
        else {
            userStock.update(value => [...value, setSymbol.toUpperCase()]);
            // go to portfolio page
            window.location.href = "/portfolio";

        }
    }

    let showPrice = true;

    function priceOrPercent() {
        showPrice = !showPrice;
    }
</script>


<main class="p-4 pt-20">
    <section class="bg-primary/70 text-white py-10 rounded-box hover:bg-primary/80">
        <div class="container mx-auto text-center">
            <h1 class="text-4xl font-bold mb-4">Search</h1>
                <p class="text-lg mb-8">Look for stock information here.</p>
                <StockInput />
        </div>
    </section>
</main>

<main class="px-4 py-0">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section class="bg-primary/70 text-white py-10 rounded-box px-5 hover:bg-primary/80">
            <h1 class = "text-3xl font-bold mb-4 text-center">${String(setSymbol).toUpperCase()} Stock Info</h1>
                <div class="text-xl space-y-1 p-2 px-2">

                    <div class="company-info mb-4 inline-flex flex-wrap">
                        <img src="{companyData.logo}" alt="{companyData.name}" class="h-12 w-12 mr-4" />
                        <p class="text-4xl pt-1">{ companyData.name }</p>
                        <div class="px-4 pt-3"><button class="text-sm border-gray-300  text-gray-300 border-2 rounded-full px-1 hover:text-gray-50 hover:border-gray-50" on:click={addToPortfolio}>⊕ Add to Portfolio</button></div>
                    </div>

                    <div class="stock-price mb-4 inline-flex">
                        <p class="text-5xl font-bold py-1">${ formatNumber(stockData.c) } </p>
                        {#if stockData.c < stockData.pc}
                            {#if showPrice === true}
                                <button class="text-2xl py-4 px-3 text-red-700" on:click={priceOrPercent}> (▼${formatNumber((stockData.pc - stockData.c))})</button>
                            {:else}
                                <button class="text-2xl py-4 px-3 text-red-700" on:click={priceOrPercent}> (▼{formatNumber((100 * (stockData.pc - stockData.c) / stockData.pc))}%)</button>
                            {/if}
                        {:else if stockData.c === stockData.pc}
                            {#if showPrice === true}
                                <button class="text-2xl py-4 px-3 text-gray-400" on:click={priceOrPercent}> ($0.00)</button>
                            {:else}
                                <button class="text-2xl py-4 px-3 text-gray-400" on:click={priceOrPercent}> (0.00%)</button>
                            {/if}
                        {:else}
                            {#if showPrice === true}
                                <button class="text-2xl py-4 px-3 text-green-400" on:click={priceOrPercent}> (▲${formatNumber((stockData.c - stockData.pc))})</button>
                            {:else}
                                <button class="text-2xl py-4 px-3 text-green-400" on:click={priceOrPercent}> (▲{formatNumber((100 * (stockData.c - stockData.pc) / stockData.pc))}%)</button>
                            {/if}                        
                        {/if}
                    </div>
                    
                    <p class = "pb-3"><a href="{ companyData.weburl }" class="text-blue-300 hover:text-blue-400 underline">{ companyData.weburl }</a></p>
                    <p>Previous Close: ${ formatNumber(stockData.pc) }</p>
                    <p>Open: ${ formatNumber(stockData.o) }</p>
                    <p>High: ${ formatNumber(stockData.h) }</p>
                    <p>Low: ${ formatNumber(stockData.l) }</p>
                </div>
        </section>

        <section class="bg-primary/70 text-white py-10 rounded-box px-4 hover:bg-primary/80">
            <h1 class = "text-3xl font-bold mb-4 text-center">${String(setSymbol).toUpperCase()} Stock Chart</h1>
            <div style="height: 450px">
                <StockChart />
            </div>
        </section>
    </div>
</main>
