from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.sale import Sale
from app.models.product import Product
from app.models.inventory import Inventory

router=APIRouter(prefix="/analytics",tags=["Analytics"])

@router.get("/summary")
def get_analytics_summary(db:Session=Depends(get_db)):
    sales=db.query(Sale).all()

    total_sales=sum(sale.quantity for sale in sales)

    total_revenue=sum(
        float(sale.sale_price)*sale.quantity
        for sale in sales
    )

    total_profit=0

    for sale in sales:
        product=db.query(Product).filter(Product.id==sale.product_id).first()

        if product is not None:
            profit=(float(sale.sale_price)-float(product.cost_price))*sale.quantity
            total_profit+=profit

    low_stock_count=0

    inventory_items=db.query(Inventory).all()

    for inventory in inventory_items:
        if inventory.quantity<=inventory.reorder_level:
            low_stock_count+=1

    return{
        "total_sales":total_sales,
        "total_revenue":round(total_revenue,2),
        "total_profit":round(total_profit,2),
        "low_stock_products":low_stock_count
    }