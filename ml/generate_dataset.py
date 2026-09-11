import pandas as pd
import numpy as np

np.random.seed(42)

n=1000

categories=["Electronics","Fashion","Home","Beauty","Sports"]
brands=["BrandA","BrandB","BrandC","BrandD","BrandE"]

data={
    "product_id":np.random.randint(1,51,n),
    "category":np.random.choice(categories,n),
    "brand":np.random.choice(brands,n),
    "cost_price":np.random.randint(500,50000,n),
    "selling_price":np.random.randint(700,60000,n),
    "inventory":np.random.randint(5,300,n),
    "competitor_price":np.random.randint(700,60000,n),
    "previous_sales":np.random.randint(1,100,n),
    "customer_rating":np.round(np.random.uniform(2.5,5.0,n),2),
    "discount":np.round(np.random.uniform(0,30,n),2),
    "seasonality":np.random.choice([0,1],n),
    "promotion":np.random.choice([0,1],n),
    "day_of_week":np.random.randint(0,7,n)
}

df=pd.DataFrame(data)

price_effect=(df["competitor_price"]-df["selling_price"])/df["selling_price"]
demand=(
    df["previous_sales"]*0.45+
    df["customer_rating"]*8+
    df["discount"]*0.8+
    df["promotion"]*12+
    df["seasonality"]*10+
    price_effect*30+
    np.random.normal(0,8,n)
)

df["demand"]=np.maximum(0,np.round(demand)).astype(int)

df.to_csv("../dataset/dipre_sales_data.csv",index=False)

print("Dataset generated successfully")
print(f"Rows:{len(df)}")
print(f"Columns:{len(df.columns)}")
print(df.head())