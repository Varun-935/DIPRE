from pydantic import BaseModel,Field
from decimal import Decimal
from datetime import datetime

class DemandPredictionCreate(BaseModel):
    product_id:int=Field(gt=0)
    predicted_demand:int=Field(ge=0)
    confidence:Decimal|None=Field(default=None,ge=0,le=100)
    model_name:str|None=None

class DemandPredictionResponse(BaseModel):
    id:int
    product_id:int
    predicted_demand:int
    confidence:Decimal|None
    model_name:str|None
    prediction_date:datetime

    model_config={"from_attributes":True}