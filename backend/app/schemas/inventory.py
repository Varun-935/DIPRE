from pydantic import BaseModel,Field

class InventoryCreate(BaseModel):
    product_id:int=Field(gt=0)
    quantity:int=Field(ge=0)
    reorder_level:int=Field(ge=0)

class InventoryResponse(BaseModel):
    id:int
    product_id:int
    quantity:int
    reorder_level:int

    model_config={"from_attributes":True}