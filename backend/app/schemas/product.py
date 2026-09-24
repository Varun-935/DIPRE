from pydantic import BaseModel

class ProductCreate(BaseModel):
    name:str
    category:str
    brand:str|None=None
    cost_price:float
    selling_price:float

class ProductUpdate(BaseModel):
    name:str
    category:str
    brand:str|None=None
    cost_price:float
    selling_price:float

class ProductResponse(BaseModel):
    id:int
    name:str
    category:str
    brand:str|None
    cost_price:float
    selling_price:float
    model_config={"from_attributes":True}