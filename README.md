# Finsights

Finsights is a smart portfolio tracking, AI-powered insights, and automated wealth management platform designed for the modern investor. It allows users to track their assets (stocks, crypto, mutual funds), get personalized insights, analyze their financial architecture, and organize their long-term investment strategies.

## Features

- **Portfolio Concentration Overview**: Review exposure across sectors and assets.
- **Advanced Financial Planning**: Map out asset allocation and strategies based on risk profile.
- **Multi-Asset Overview**: Analyze performance, allocation, and growth trends across investments.
- **Financial Architecture Overview**: Manage assets, plan long-term investments, and track wealth growth.
- **Global Market Insights**: Track international markets and multi-currency support.

## Tech Stack

### Frontend
- **React.js** (Vite)
- **Tailwind CSS** for styling
- **Recharts** for interactive charting
- **Lucide React** for icons
- **Supabase** for Backend-as-a-Service integration

### Backend
- **Python / FastAPI**
- **yfinance** for fetching real-time and historical market data
- **Pandas** for data manipulation

## Getting Started

### Prerequisites
- Node.js (v16+)
- Python 3.9+
- A Supabase account and project for authentication/database

### Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### Setup Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## License
MIT License
