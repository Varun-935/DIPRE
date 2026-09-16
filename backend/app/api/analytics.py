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

@router.get("/daily")
def get_daily_analytics(db:Session=Depends(get_db)):
    sales=db.query(Sale).order_by(Sale.sale_date.asc()).all()

    daily_data={}

    for sale in sales:
        date=str(sale.sale_date.date())

        if date not in daily_data:
            daily_data[date]={
                "date":date,
                "sales":0,
                "revenue":0,
                "profit":0
            }

        product=db.query(Product).filter(Product.id==sale.product_id).first()

        daily_data[date]["sales"]+=sale.quantity
        daily_data[date]["revenue"]+=float(sale.sale_price)*sale.quantity

        if product is not None:
            daily_data[date]["profit"]+=(float(sale.sale_price)-float(product.cost_price))*sale.quantity

    result=list(daily_data.values())

    for item in result:
        item["revenue"]=round(item["revenue"],2)
        item["profit"]=round(item["profit"],2)

    return result