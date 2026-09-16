from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.product import Product
from app.models.inventory import Inventory
from app.models.pricing_recommendation import PricingRecommendation
from app.schemas.pricing_request import PricingRequest,PricingResponse
from app.services.pricing_service import generate_pricing_recommendation

router=APIRouter(prefix="/ml",tags=["Machine Learning"])

@router.post("/pricing-recommendation",response_model=PricingResponse)
def pricing_recommendation(request:PricingRequest,db:Session=Depends(get_db)):
    product=db.query(Product).filter(Product.id==request.product_id).first()

    if product is None:
        raise HTTPException(status_code=404,detail="Product not found")

    inventory=db.query(Inventory).filter(Inventory.product_id==request.product_id).first()

    if inventory is None:
        raise HTTPException(status_code=404,detail="Inventory not found")

    market_data={
        "competitor_price":request.competitor_price,
        "previous_sales":request.previous_sales,
        "customer_rating":request.customer_rating,
        "discount":request.discount,
        "seasonality":request.seasonality,
        "promotion":request.promotion,
        "day_of_week":request.day_of_week
    }

    result=generate_pricing_recommendation(
        product,
        inventory,
        market_data
    )

    new_recommendation=PricingRecommendation(
        product_id=product.id,
        current_price=result["current_price"],
        recommended_price=result["recommended_price"],
        action=result["action"],
        expected_profit=result["expected_profit"],
        reason=result["reason"]
    )

    db.add(new_recommendation)
    db.commit()
    db.refresh(new_recommendation)

    return PricingResponse(
        product_id=request.product_id,
        **result
    )