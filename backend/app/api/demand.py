from fastapi import APIRouter
from app.schemas.demand_request import DemandRequest,DemandResponse
from app.services.demand_service import predict_demand

router=APIRouter(prefix="/ml",tags=["Machine Learning"])

@router.post("/predict-demand",response_model=DemandResponse)
def predict_product_demand(request:DemandRequest):
    product_data=request.model_dump()
    predicted_demand=predict_demand(product_data)

    return DemandResponse(
        product_id=request.product_id,
        predicted_demand=predicted_demand
    )