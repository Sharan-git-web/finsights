from pydantic import BaseModel, Field, ConfigDict
from typing import List


class PricePoint(BaseModel):
    date: str
    price: float


class VolumePoint(BaseModel):
    date: str
    volume: int


class PredictionPoint(BaseModel):
    date: str
    predicted_price: float


class StockInsights(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    current_price: float
    change_percent: float
    high_52_week: float = Field(alias='52_week_high')
    low_52_week: float = Field(alias='52_week_low')
    price_history_6m: List[PricePoint]
    volume_history: List[VolumePoint]
    ml_prediction_30d: List[PredictionPoint]
    trend_signal: str
