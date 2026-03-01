from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from routes import portfolio, stocks, search, expenses, user, market

app = FastAPI()

# ✅ CORS for all Vercel preview + prod domains
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.options("/{path:path}")
async def preflight_handler(path: str):
    return Response(status_code=204)

app.include_router(portfolio.router, prefix="/api/portfolio")
app.include_router(stocks.router, prefix="/api/stocks")
app.include_router(search.router, prefix="/api/search")
app.include_router(expenses.router, prefix="/api/expenses")
app.include_router(user.router, prefix="/api/user")
app.include_router(market.router, prefix="/api/market")

@app.get("/")
def root():
    return {"message": "FINSIGHTS API running 🚀"}