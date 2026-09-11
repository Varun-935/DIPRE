import pandas as pd
import joblib

model=joblib.load("../models/demand_gradient_boosting.pkl")

product_data=pd.DataFrame([{
    "product_id":1,
    "category":"Electronics",
    "brand":"BrandA",
    "cost_price":45000,
    "selling_price":52000,
    "inventory":100,
    "competitor_price":50000,
    "previous_sales":80,
    "customer_rating":4.5,
    "discount":10,
    "seasonality":1,
    "promotion":1,
    "day_of_week":5
}])

prediction=model.predict(product_data)

predicted_demand=max(0,round(prediction[0]))

print("Demand Prediction")
print("==================")
print(f"Product ID:1")
print(f"Predicted Demand:{predicted_demand} units")