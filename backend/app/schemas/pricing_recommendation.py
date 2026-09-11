from pydantic import BaseModel,Field
from decimal import Decimal
from datetime import datetime

class PricingRecommendationCreate(BaseModel):
    product_id:int=Field(gt=0)
    current_price:Decimal=Field(gt=0)
    recommended_price:Decimal=Field(gt=0)
    action:str=Field(min_length=1,max_length=20)
    expected_profit:Decimal|None=None
    reason:str|None=Field(default=None,max_length=500)

class PricingRecommendationResponse(BaseModel):
    id:int
    product_id:int
    current_price:Decimal
    recommended_price:Decimal
    action:str
    expected_profit:Decimal|None
    reason:str|None
    created_at:datetime

    model_config={"from_attributes":True}