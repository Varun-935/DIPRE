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

predicted_demand=max(0,round(model.predict(product_data)[0]))

cost_price=product_data["cost_price"].iloc[0]
current_price=product_data["selling_price"].iloc[0]
inventory=product_data["inventory"].iloc[0]
competitor_price=product_data["competitor_price"].iloc[0]

demand_ratio=predicted_demand/max(inventory,1)

if demand_ratio>=0.8 and current_price<competitor_price:
    action="RAISE"
    recommended_price=min(current_price*1.05,competitor_price)
    reason="High predicted demand and current price below competitor price"
elif demand_ratio<=0.3 or inventory>=predicted_demand*2:
    action="LOWER"
    recommended_price=max(current_price*0.95,cost_price*1.05)
    reason="Low predicted demand or excess inventory"
elif current_price>competitor_price and demand_ratio<1:
    action="LOWER"
    recommended_price=max(competitor_price,cost_price*1.05)
    reason="Current price is above competitor price"
else:
    action="HOLD"
    recommended_price=current_price
    reason="Demand, inventory and market conditions are balanced"

expected_units_sold=min(predicted_demand,inventory)
expected_profit=(recommended_price-cost_price)*expected_units_sold

print("DIPRE Pricing Recommendation")
print("============================")
print(f"Predicted Demand:{predicted_demand} units")
print(f"Current Inventory:{inventory} units")
print(f"Current Price:₹{current_price:.2f}")
print(f"Competitor Price:₹{competitor_price:.2f}")
print(f"Demand Ratio:{demand_ratio:.2f}")
print(f"Action:{action}")
print(f"Recommended Price:₹{recommended_price:.2f}")
print(f"Expected Profit:₹{expected_profit:.2f}")
print(f"Reason:{reason}")