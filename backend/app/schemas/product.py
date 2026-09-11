from pydantic import BaseModel,Field
from decimal import Decimal
from datetime import datetime

class ProductCreate(BaseModel):
    name:str=Field(min_length=1,max_length=200)
    category:str=Field(min_length=1,max_length=100)
    brand:str|None=None
    cost_price:Decimal=Field(gt=0)
    selling_price:Decimal=Field(gt=0)

class ProductResponse(BaseModel):
    id:int
    name:str
    category:str
    brand:str|None
    cost_price:Decimal
    selling_price:Decimal
    created_at:datetime

    model_config={"from_attributes":True}