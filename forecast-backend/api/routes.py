from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from models.sarimax_model import run_forecast

router = APIRouter()

class ForecastRequest(BaseModel):
    ticker: str
    start: str
    end: str
    forecast_days: int = 30

@router.post("/forecast")
def forecast_stock(data: ForecastRequest):
    try:
        print(f"📈 Received forecast request: {data.ticker} from {data.start} to {data.end}, {data.forecast_days} days ahead")

        result = run_forecast(
            ticker=data.ticker,
            start_date=data.start,
            end_date=data.end,
            forecast_days=data.forecast_days
        )

        # Validate result
        if result.get("error"):
            raise HTTPException(status_code=400, detail=result["error"])
        
        return {
            "ticker": data.ticker,
            "start": data.start,
            "end": data.end,
            "forecast_days": data.forecast_days,
            "forecast": result["forecast"],
            "metrics": result["metrics"],
            "model_info": result["model_info"]
        }

    except Exception as e:
        print(f"❌ Forecasting failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Forecasting failed: {str(e)}")
