from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.sale import Sale
from app.models.product import Product
from app.schemas.sale import SaleCreate,SaleResponse

router=APIRouter(prefix="/sales",tags=["Sales"])

@router.post("/",response_model=SaleResponse)
def create_sale(sale:SaleCreate,db:Session=Depends(get_db)):
    product=db.query(Product).filter(Product.id==sale.product_id).first()

    if product is None:
        raise HTTPException(status_code=404,detail="Product not found")

    new_sale=Sale(
        product_id=sale.product_id,
        quantity=sale.quantity,
        sale_price=sale.sale_price
    )

    db.add(new_sale)
    db.commit()
    db.refresh(new_sale)

    return new_sale

@router.get("/",response_model=list[SaleResponse])
def get_sales(db:Session=Depends(get_db)):
    return db.query(Sale).all()

@router.get("/{sale_id}",response_model=SaleResponse)
def get_sale(sale_id:int,db:Session=Depends(get_db)):
    sale=db.query(Sale).filter(Sale.id==sale_id).first()

    if sale is None:
        raise HTTPException(status_code=404,detail="Sale not found")

    return sale