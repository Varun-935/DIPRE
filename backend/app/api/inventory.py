from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.inventory import Inventory
from app.models.product import Product
from app.schemas.inventory import InventoryCreate,InventoryResponse

router=APIRouter(prefix="/inventory",tags=["Inventory"])

@router.post("/",response_model=InventoryResponse)
def create_inventory(inventory:InventoryCreate,db:Session=Depends(get_db)):
    product=db.query(Product).filter(Product.id==inventory.product_id).first()

    if product is None:
        raise HTTPException(status_code=404,detail="Product not found")

    existing_inventory=db.query(Inventory).filter(Inventory.product_id==inventory.product_id).first()

    if existing_inventory is not None:
        raise HTTPException(status_code=400,detail="Inventory already exists for this product")

    new_inventory=Inventory(
        product_id=inventory.product_id,
        quantity=inventory.quantity,
        reorder_level=inventory.reorder_level
    )

    db.add(new_inventory)
    db.commit()
    db.refresh(new_inventory)

    return new_inventory

@router.get("/",response_model=list[InventoryResponse])
def get_inventory(db:Session=Depends(get_db)):
    return db.query(Inventory).all()

@router.get("/count")
def get_inventory_count(db:Session=Depends(get_db)):
    total_inventory=db.query(Inventory).with_entities(Inventory.quantity).all()
    total_quantity=sum(item.quantity for item in total_inventory)

    return {"count":total_quantity}

@router.get("/{inventory_id}",response_model=InventoryResponse)
def get_inventory_item(inventory_id:int,db:Session=Depends(get_db)):
    inventory=db.query(Inventory).filter(Inventory.id==inventory_id).first()

    if inventory is None:
        raise HTTPException(status_code=404,detail="Inventory not found")

    return inventory