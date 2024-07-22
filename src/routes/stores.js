import { writable } from 'svelte/store';
import { persist, createLocalStorage } from '@macfja/svelte-persistent-store';

// symbol you are searching for in the Search tab
export const stockSymbol = persist(writable(""), createLocalStorage(), "stockSymbol");
export const stockData = writable({
    c: 0, // Current price
    h: 0, // High price of the day
    l: 0, // Low price of the day
    o: 0, // Open price of the day
    pc: 0, // Previous close price
});

export const error = writable(null);
export const loading = writable(false);

// Company data extracted from the API
export const companyData = writable({
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
    "weburl": "https://www.apple.com/"
});

// User stock list
export const userStock = persist(writable([
    "AAPL",
]), createLocalStorage(), "userStock");

// Bool for price change or percentage change
export const priceIncrease = writable(true);
