from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import portfolio, stocks, search, expenses, user, market

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(portfolio.router, prefix="/api/portfolio")
app.include_router(stocks.router, prefix="/api/stocks")
app.include_router(search.router, prefix="/api/search")
app.include_router(expenses.router, prefix="/api/expenses")
app.include_router(user.router, prefix="/api/user")
app.include_router(market.router, prefix="/api/market")

@app.get("/")
def root():
    return {"message": "FINSIGHTS API running 🚀"}