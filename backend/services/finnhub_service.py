import os
import requests
from dotenv import load_dotenv
from typing import List, Dict

load_dotenv()

FINNHUB_API_KEY = os.getenv("FINNHUB_API_KEY")
FINNHUB_BASE_URL = "https://finnhub.io/api/v1"

def search_stocks(query: str) -> List[Dict[str, str]]:
    """
    Search for stocks using Finnhub API.
    Filters for Common Stock and sorts exact prefix matches first.
    """
    if not query:
        return []

    try:
        url = f"{FINNHUB_BASE_URL}/search"
        params = {
            "q": query,
            "token": FINNHUB_API_KEY
        }
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        data = response.json()
        results = data.get("result", [])
        
        # Filter and process results
        filtered_results = [
            {
                "symbol": item["symbol"],
                "description": item["description"],
                "type": item.get("type", "N/A")
            }
            for item in results
            # Removing type filter to show ALL matching companies as requested
        ]
        
        # Sort: Exact prefix matches first (case insensitive)
        query_lower = query.lower()
        
        def sort_key(item):
            desc = item["description"].lower()
            sym = item["symbol"].lower()
            
            # If description or symbol starts with query, give it higher priority
            if desc.startswith(query_lower) or sym.startswith(query_lower):
                return (0, desc)
            return (1, desc)
            
        filtered_results.sort(key=sort_key)
        
        return filtered_results

    except Exception as e:
        print(f"Error searching Finnhub: {e}")
        return []
