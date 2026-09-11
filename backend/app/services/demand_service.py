import os
import joblib
import pandas as pd

BASE_DIR=os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
MODEL_PATH=os.path.join(BASE_DIR,"models","demand_gradient_boosting.pkl")

model=joblib.load(MODEL_PATH)

def predict_demand(product_data:dict):
    data=pd.DataFrame([product_data])
    prediction=model.predict(data)[0]
    predicted_demand=max(0,round(prediction))
    return predicted_demand