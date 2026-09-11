from pydantic import BaseModel,Field
from decimal import Decimal
from datetime import datetime

class SaleCreate(BaseModel):
    product_id:int=Field(gt=0)
    quantity:int=Field(gt=0)
    sale_price:Decimal=Field(gt=0)

class SaleResponse(BaseModel):
    id:int
    product_id:int
    quantity:int
    sale_price:Decimal
    sale_date:datetime

    model_config={"from_attributes":True}