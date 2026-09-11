from app.api.inventory import router as inventory_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import Base,engine
from app.models.product import Product
from app.models.inventory import Inventory
from app.models.sale import Sale
from app.models.demand_prediction import DemandPrediction
from app.models.pricing_recommendation import PricingRecommendation
from app.api.product import router as product_router
from app.api.sale import router as sale_router
from app.api.demand_prediction import router as demand_prediction_router
from app.api.pricing_recommendation import router as pricing_recommendation_router
from app.api.demand import router as demand_router
from app.api.pricing import router as pricing_router

Base.metadata.create_all(bind=engine)

app=FastAPI(
    title="DIPRE API",
    description="Dynamic Inventory and Pricing Recommender Engine",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(product_router)
app.include_router(inventory_router)
app.include_router(sale_router)
app.include_router(demand_prediction_router)
app.include_router(pricing_recommendation_router)
app.include_router(demand_router)
app.include_router(pricing_router)

@app.get("/")
def home():
    return{
        "message":"Welcome to DIPRE API",
        "status":"Running"
    }

@app.get("/health")
def health():
    return{
        "status":"Healthy"
    }