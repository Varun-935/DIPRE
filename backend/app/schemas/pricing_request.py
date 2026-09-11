from pydantic import BaseModel,Field

class PricingRequest(BaseModel):
    product_id:int=Field(gt=0)
    competitor_price:float=Field(gt=0)
    previous_sales:int=Field(ge=0)
    customer_rating:float=Field(ge=0,le=5)
    discount:float=Field(ge=0,le=100)
    seasonality:int=Field(ge=0,le=1)
    promotion:int=Field(ge=0,le=1)
    day_of_week:int=Field(ge=0,le=6)

class PricingResponse(BaseModel):
    product_id:int
    predicted_demand:int
    current_price:float
    recommended_price:float
    action:str
    expected_profit:float
    reason:str