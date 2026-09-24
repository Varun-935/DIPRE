from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.product import Product
from app.schemas.product import ProductCreate,ProductUpdate,ProductResponse

router=APIRouter(prefix="/products",tags=["Products"])

@router.post("/",response_model=ProductResponse)
def create_product(product:ProductCreate,db:Session=Depends(get_db)):
    new_product=Product(
        name=product.name,
        category=product.category,
        brand=product.brand,
        cost_price=product.cost_price,
        selling_price=product.selling_price
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@router.get("/",response_model=list[ProductResponse])
def get_products(db:Session=Depends(get_db)):
    return db.query(Product).all()

@router.put("/{product_id}",response_model=ProductResponse)
def update_product(product_id:int,product_data:ProductUpdate,db:Session=Depends(get_db)):
    product=db.query(Product).filter(Product.id==product_id).first()
    if product is None:
        raise HTTPException(status_code=404,detail="Product not found")
    product.name=product_data.name
    product.category=product_data.category
    product.brand=product_data.brand
    product.cost_price=product_data.cost_price
    product.selling_price=product_data.selling_price
    db.commit()
    db.refresh(product)
    return product

@router.delete("/{product_id}")
def delete_product(product_id:int,db:Session=Depends(get_db)):
    product=db.query(Product).filter(Product.id==product_id).first()
    if product is None:
        raise HTTPException(status_code=404,detail="Product not found")
    db.delete(product)
    db.commit()
    return{"message":"Product deleted successfully"}

@router.get("/count")
def get_product_count(db:Session=Depends(get_db)):
    return {"count":db.query(Product).count()}

@router.get("/{product_id}",response_model=ProductResponse)
def get_product(product_id:int,db:Session=Depends(get_db)):
    product=db.query(Product).filter(Product.id==product_id).first()
    if product is None:
        raise HTTPException(status_code=404,detail="Product not found")
    return product