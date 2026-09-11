import os
import joblib
import pandas as pd

BASE_DIR=os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
MODEL_PATH=os.path.join(BASE_DIR,"models","demand_gradient_boosting.pkl")

model=joblib.load(MODEL_PATH)

def generate_pricing_recommendation(product,inventory,market_data):
    product_data=pd.DataFrame([{
        "product_id":product.id,
        "category":product.category,
        "brand":product.brand or "Unknown",
        "cost_price":float(product.cost_price),
        "selling_price":float(product.selling_price),
        "inventory":inventory.quantity,
        "competitor_price":market_data["competitor_price"],
        "previous_sales":market_data["previous_sales"],
        "customer_rating":market_data["customer_rating"],
        "discount":market_data["discount"],
        "seasonality":market_data["seasonality"],
        "promotion":market_data["promotion"],
        "day_of_week":market_data["day_of_week"]
    }])

    predicted_demand=max(0,round(model.predict(product_data)[0]))

    current_price=float(product.selling_price)
    cost_price=float(product.cost_price)
    competitor_price=market_data["competitor_price"]
    inventory_quantity=inventory.quantity

    demand_ratio=predicted_demand/max(inventory_quantity,1)

    if demand_ratio>=0.8 and current_price<competitor_price:
        action="RAISE"
        recommended_price=min(current_price*1.05,competitor_price)
        reason="High predicted demand and current price below competitor price"

    elif current_price>competitor_price and demand_ratio<1:
        action="LOWER"
        recommended_price=max(competitor_price,current_price*0.95,cost_price*1.05)
        reason="Current price is above competitor price with weak demand"

    elif demand_ratio<=0.3 or inventory_quantity>=predicted_demand*2:
        action="LOWER"
        recommended_price=max(current_price*0.95,cost_price*1.05)
        reason="Low predicted demand or excess inventory"

    else:
        action="HOLD"
        recommended_price=current_price
        reason="Demand, inventory and market conditions are balanced"

    expected_units_sold=min(predicted_demand,inventory_quantity)
    expected_profit=(recommended_price-cost_price)*expected_units_sold

    return {
        "predicted_demand":predicted_demand,
        "current_price":current_price,
        "recommended_price":round(recommended_price,2),
        "action":action,
        "expected_profit":round(expected_profit,2),
        "reason":reason
    }