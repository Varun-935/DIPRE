from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.pricing_recommendation import PricingRecommendation
from app.models.product import Product
from app.schemas.pricing_recommendation import PricingRecommendationCreate,PricingRecommendationResponse

router=APIRouter(prefix="/pricing-recommendations",tags=["Pricing Recommendation"])

@router.post("/",response_model=PricingRecommendationResponse)
def create_pricing_recommendation(recommendation:PricingRecommendationCreate,db:Session=Depends(get_db)):
    product=db.query(Product).filter(Product.id==recommendation.product_id).first()

    if product is None:
        raise HTTPException(status_code=404,detail="Product not found")

    new_recommendation=PricingRecommendation(
        product_id=recommendation.product_id,
        current_price=recommendation.current_price,
        recommended_price=recommendation.recommended_price,
        action=recommendation.action,
        expected_profit=recommendation.expected_profit,
        reason=recommendation.reason
    )

    db.add(new_recommendation)
    db.commit()
    db.refresh(new_recommendation)

    return new_recommendation

@router.get("/",response_model=list[PricingRecommendationResponse])
def get_pricing_recommendations(db:Session=Depends(get_db)):
    return db.query(PricingRecommendation).all()

@router.get("/history")
def get_pricing_history(db:Session=Depends(get_db)):
    recommendations=db.query(PricingRecommendation).order_by(
        PricingRecommendation.created_at.desc()
    ).all()

    return[
        {
            "id":item.id,
            "product_id":item.product_id,
            "current_price":float(item.current_price),
            "recommended_price":float(item.recommended_price),
            "action":item.action,
            "expected_profit":float(item.expected_profit) if item.expected_profit is not None else 0,
            "reason":item.reason,
            "created_at":item.created_at
        }
        for item in recommendations
    ]

@router.get("/{recommendation_id}",response_model=PricingRecommendationResponse)
def get_pricing_recommendation(recommendation_id:int,db:Session=Depends(get_db)):
    recommendation=db.query(PricingRecommendation).filter(PricingRecommendation.id==recommendation_id).first()

    if recommendation is None:
        raise HTTPException(status_code=404,detail="Pricing recommendation not found")

    return recommendation