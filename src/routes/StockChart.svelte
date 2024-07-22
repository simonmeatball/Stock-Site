<script>
    import { onMount } from 'svelte';
    import { stockSymbol } from './stores';
  
    // Function to update the TradingView widget
    /**
	 * @param {string} symbol
	 */
    function updateWidget(symbol) {
      const container = document.getElementById('tradingview-container');
      // @ts-ignore
      container.innerHTML = '';  // Clear the container before adding new script
  
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
      script.async = true;
      script.innerHTML = JSON.stringify({
        "autosize": true,
        "symbol": symbol,
        "interval": "1",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "2",
        "locale": "en",
        "allow_symbol_change": true,
        "calendar": false,
        "support_host": "https://www.tradingview.com"
      });
  
      // @ts-ignore
      container.appendChild(script);
    }
  
    // Reactively update the widget when stockSymbol changes
    $: {
      stockSymbol.subscribe(value => {
        if (typeof document !== 'undefined') {
          updateWidget(value);
        }
      });
    }
  
    onMount(() => {
      // Initial load
      stockSymbol.subscribe(value => {
        updateWidget(value);
      });
    });
  </script>
  
  <style>
    .tradingview-widget-container {
      height: 500px; /* Set your desired height */
      width: 100%;
    }
    .tradingview-widget-container__widget {
      height: calc(100% - 32px);
      width: 100%;
    }
  </style>
  
  <div id="tradingview-container" class="tradingview-widget-container">
    <div class="tradingview-widget-container__widget"></div>
  </div>