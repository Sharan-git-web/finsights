from datetime import datetime, timedelta, timezone
from typing import List, Optional
import yfinance as yf
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression

# simple in-memory cache
_cache: dict = {}
CACHE_TTL = timedelta(minutes=5)


def _slice_last_six_months(df: pd.DataFrame) -> pd.DataFrame:
    cutoff = datetime.now(timezone.utc) - timedelta(days=182)  # approx 6 months
    # Ensure index is timezone-aware if cutoff is
    if df.index.tz is None:
        df.index = df.index.tz_localize('UTC')
    return df[df.index >= cutoff]





def get_multi_stock_comparison(tickers: List[str]) -> List[dict]:
    now = datetime.now(timezone.utc)
    results = []

    for symbol in tickers:
        symbol = symbol.upper()
        # check cache
        cached = _cache.get(f"compare_{symbol}")
        if cached and cached["expiry"] > now:
            results.append(cached["data"])
            continue

        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            hist: pd.DataFrame = ticker.history(period="1y")

            if hist.empty or not info:
                # Stock not found or no data
                continue

            # 6-month performance
            last_6m = _slice_last_six_months(hist.copy())
            if len(last_6m) >= 2:
                start_price = float(last_6m["Close"].iloc[0])
                end_price = float(last_6m["Close"].iloc[-1])
                perf_6m = float(((end_price - start_price) / start_price) * 100) if start_price != 0 else None
            else:
                perf_6m = None

            # Historical data
            price_history_6m = [
                {"date": idx.strftime("%Y-%m-%d"), "price": float(row["Close"])}
                for idx, row in last_6m.iterrows()
            ]

            fast = ticker.fast_info
            
            # Safe extraction with fast_info fallbacks
            market_cap = info.get("marketCap") or getattr(fast, "market_cap", None)
            pe_ratio = info.get("trailingPE") or None
            
            # Dividend yield calculation: fallback to rate / price if yield is missing
            dividend_yield = info.get("dividendYield")
            if dividend_yield is None:
                # calculate manually if possible
                div_rate = info.get("dividendRate")
                current_price = info.get("currentPrice") or getattr(fast, "last_price", None)
                if div_rate and current_price:
                    dividend_yield = div_rate / current_price

            high_52 = info.get("fiftyTwoWeekHigh") or getattr(fast, "year_high", None) or float(hist["High"].max()) if not hist.empty else None
            low_52 = info.get("fiftyTwoWeekLow") or getattr(fast, "year_low", None) or float(hist["Low"].min()) if not hist.empty else None

            data = {
                "symbol": symbol,
                "currency": info.get("currency") or getattr(fast, "currency", "USD"),
                "marketCap": float(market_cap) if market_cap else None,
                "trailingPE": float(pe_ratio) if pe_ratio else None,
                "dividendYield": float(dividend_yield) if dividend_yield else None,
                "six_month_performance": float(perf_6m) if perf_6m is not None else None,
                "fiftyTwoWeekHigh": float(high_52) if high_52 else None,
                "fiftyTwoWeekLow": float(low_52) if low_52 else None,
                "price_history_6m": price_history_6m
            }
            
            _cache[f"compare_{symbol}"] = {"expiry": now + CACHE_TTL, "data": data}
            results.append(data)

        except Exception as e:
            # Skip failed tickers but log internally
            print(f"Error comparing {symbol}: {e}")
            continue

    return results


def get_stock_insights(ticker_symbol: str) -> dict:
    now = datetime.now(timezone.utc)
    cached = _cache.get(ticker_symbol)
    if cached and cached["expiry"] > now:
        return cached["data"]

    try:
        ticker = yf.Ticker(ticker_symbol)
        hist: pd.DataFrame = ticker.history(period="1y")
    except Exception as exc:
        raise ValueError("Failed to fetch data from yfinance")

    if hist.empty:
        raise ValueError("Ticker symbol not found or no historical data")

    # compute current price information
    last_close = float(hist["Close"].iloc[-1])
    prev_close = float(hist["Close"].iloc[-2]) if len(hist) >= 2 else last_close
    change_percent = ((last_close - prev_close) / prev_close) * 100 if prev_close != 0 else 0

    # 52-week extremes
    high_52 = float(hist["High"].max())
    low_52 = float(hist["Low"].min())

    # 6-month slice
    last_6m = _slice_last_six_months(hist.copy())

    price_history_6m = [
        {"date": idx.strftime("%Y-%m-%d"), "price": float(row["Close"])}
        for idx, row in last_6m.iterrows()
    ]
    volume_history = [
        {"date": idx.strftime("%Y-%m-%d"), "volume": int(row["Volume"])}
        for idx, row in last_6m.iterrows()
    ]

    # linear regression prediction over last 6 months closes
    closes = last_6m["Close"].reset_index()
    closes = closes.dropna()
    if closes.empty:
        preds_list = []
        avg_pred = 0
    else:
        # encode days as integers
        closes["day"] = np.arange(len(closes))
        X = closes[["day"]].values
        y = closes["Close"].values
        model = LinearRegression()
        model.fit(X, y)

        future_days = np.arange(len(closes), len(closes) + 30).reshape(-1, 1)
        preds = model.predict(future_days)

        last_date = closes["Date"].iloc[-1]
        future_dates = [last_date + timedelta(days=i + 1) for i in range(30)]
        preds_list = [
            {"date": d.strftime("%Y-%m-%d"), "predicted_price": float(p)}
            for d, p in zip(future_dates, preds)
        ]
        avg_pred = float(np.mean(preds))

    trend_signal = "Bullish" if avg_pred > last_close else "Bearish"

    response = {
        "current_price": last_close,
        "change_percent": round(change_percent, 2),
        "52_week_high": high_52,
        "52_week_low": low_52,
        "price_history_6m": price_history_6m,
        "volume_history": volume_history,
        "ml_prediction_30d": preds_list,
        "trend_signal": trend_signal,
    }

    _cache[ticker_symbol] = {"expiry": now + CACHE_TTL, "data": response}
    return response
