from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.inventory import Inventory
from app.models.product import Product

router=APIRouter(prefix="/inventory-intelligence",tags=["Inventory Intelligence"])

@router.get("/alerts")
def get_inventory_alerts(db:Session=Depends(get_db)):
    inventory_items=db.query(Inventory).all()

    alerts=[]

    for inventory in inventory_items:
        product=db.query(Product).filter(Product.id==inventory.product_id).first()

        if product is None:
            continue

        if inventory.quantity<=inventory.reorder_level:
            target_stock=inventory.reorder_level*2
            recommended_reorder=max(0,target_stock-inventory.quantity)

            alerts.append({
                "product_id":product.id,
                "product_name":product.name,
                "current_stock":inventory.quantity,
                "reorder_level":inventory.reorder_level,
                "recommended_reorder":recommended_reorder,
                "status":"LOW STOCK"
            })

    return{
        "total_alerts":len(alerts),
        "alerts":alerts
    }