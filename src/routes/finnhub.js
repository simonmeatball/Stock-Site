// src/utils/finnhub.js
import axios from 'axios';
import { loading, error } from './stores.js';
import { PUBLIC_API_KEY } from '$env/static/public';

/**
 * @param {any} symbol
 */
export async function fetchStockData(symbol) {
  loading.set(true);
  error.set(null);

  try {
    const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${PUBLIC_API_KEY}`);
    return response.data;
  } catch (err) {
    // @ts-expect-error no need to check for null
    error.set(err.message);
  } finally {
    loading.set(false);
  }
}

/**
 * @param {any} symbol
 */
export async function fetchCompanyData(symbol) {
    loading.set(true);
    error.set(null);
    
    try {
        const response = await axios.get(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${PUBLIC_API_KEY}`);
        return response.data;
    } catch (err) {
        // @ts-expect-error no need to check for null
        error.set(err.message);
    } finally {
        loading.set(false);
    }
}