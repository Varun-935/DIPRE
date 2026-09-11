def pricing_decision(predicted_demand,inventory,current_price,competitor_price,cost_price):
    demand_ratio=predicted_demand/max(inventory,1)

    if demand_ratio>=0.8 and current_price<competitor_price:
        action="RAISE"
        recommended_price=min(current_price*1.05,competitor_price)
        reason="High predicted demand and current price below competitor price"

    elif current_price>competitor_price and demand_ratio<1:
        action="LOWER"
        recommended_price=max(competitor_price,current_price*0.95,cost_price*1.05)
        reason="Current price is above competitor price with weak demand"

    elif demand_ratio<=0.3 or inventory>=predicted_demand*2:
        action="LOWER"
        recommended_price=max(current_price*0.95,cost_price*1.05)
        reason="Low predicted demand or excess inventory"

    else:
        action="HOLD"
        recommended_price=current_price
        reason="Demand, inventory and market conditions are balanced"

    expected_units_sold=min(predicted_demand,inventory)
    expected_profit=(recommended_price-cost_price)*expected_units_sold

    return action,recommended_price,expected_profit,reason


scenarios=[
    {
        "name":"High Demand Low Inventory",
        "predicted_demand":150,
        "inventory":100,
        "current_price":50000,
        "competitor_price":55000,
        "cost_price":40000
    },
    {
        "name":"Low Demand Excess Inventory",
        "predicted_demand":20,
        "inventory":150,
        "current_price":50000,
        "competitor_price":50000,
        "cost_price":40000
    },
    {
        "name":"Balanced Market",
        "predicted_demand":70,
        "inventory":100,
        "current_price":50000,
        "competitor_price":50000,
        "cost_price":40000
    },
    {
        "name":"High Price Weak Demand",
        "predicted_demand":40,
        "inventory":100,
        "current_price":60000,
        "competitor_price":50000,
        "cost_price":40000
    },
    {
        "name":"High Demand Price Below Competitor",
        "predicted_demand":120,
        "inventory":150,
        "current_price":48000,
        "competitor_price":52000,
        "cost_price":40000
    }
]

print("DIPRE Pricing Scenario Test")
print("="*70)

for scenario in scenarios:
    action,recommended_price,expected_profit,reason=pricing_decision(
        scenario["predicted_demand"],
        scenario["inventory"],
        scenario["current_price"],
        scenario["competitor_price"],
        scenario["cost_price"]
    )

    print(f"\nScenario:{scenario['name']}")
    print(f"Predicted Demand:{scenario['predicted_demand']}")
    print(f"Inventory:{scenario['inventory']}")
    print(f"Current Price:₹{scenario['current_price']:.2f}")
    print(f"Competitor Price:₹{scenario['competitor_price']:.2f}")
    print(f"Action:{action}")
    print(f"Recommended Price:₹{recommended_price:.2f}")
    print(f"Expected Profit:₹{expected_profit:.2f}")
    print(f"Reason:{reason}")