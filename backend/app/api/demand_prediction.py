from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.demand_prediction import DemandPrediction
from app.models.product import Product
from app.schemas.demand_prediction import DemandPredictionCreate,DemandPredictionResponse

router=APIRouter(prefix="/demand-predictions",tags=["Demand Prediction"])

@router.post("/",response_model=DemandPredictionResponse)
def create_demand_prediction(prediction:DemandPredictionCreate,db:Session=Depends(get_db)):
    product=db.query(Product).filter(Product.id==prediction.product_id).first()

    if product is None:
        raise HTTPException(status_code=404,detail="Product not found")

    new_prediction=DemandPrediction(
        product_id=prediction.product_id,
        predicted_demand=prediction.predicted_demand,
        confidence=prediction.confidence,
        model_name=prediction.model_name
    )

    db.add(new_prediction)
    db.commit()
    db.refresh(new_prediction)

    return new_prediction

@router.get("/",response_model=list[DemandPredictionResponse])
def get_demand_predictions(db:Session=Depends(get_db)):
    return db.query(DemandPrediction).all()

@router.get("/{prediction_id}",response_model=DemandPredictionResponse)
def get_demand_prediction(prediction_id:int,db:Session=Depends(get_db)):
    prediction=db.query(DemandPrediction).filter(DemandPrediction.id==prediction_id).first()

    if prediction is None:
        raise HTTPException(status_code=404,detail="Demand prediction not found")

    return prediction