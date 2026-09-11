import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder,StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor,GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error,mean_squared_error,r2_score
from xgboost import XGBRegressor

df=pd.read_csv("../dataset/dipre_sales_data.csv")

X=df.drop("demand",axis=1)
y=df["demand"]

categorical_features=["category","brand"]

numerical_features=[
    "product_id",
    "cost_price",
    "selling_price",
    "inventory",
    "competitor_price",
    "previous_sales",
    "customer_rating",
    "discount",
    "seasonality",
    "promotion",
    "day_of_week"
]

categorical_pipeline=Pipeline([
    ("imputer",SimpleImputer(strategy="most_frequent")),
    ("encoder",OneHotEncoder(handle_unknown="ignore"))
])

numerical_pipeline=Pipeline([
    ("imputer",SimpleImputer(strategy="median")),
    ("scaler",StandardScaler())
])

preprocessor=ColumnTransformer([
    ("categorical",categorical_pipeline,categorical_features),
    ("numerical",numerical_pipeline,numerical_features)
])

X_train,X_test,y_train,y_test=train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

models={
    "Linear Regression":LinearRegression(),
    "Decision Tree":DecisionTreeRegressor(random_state=42,max_depth=10),
    "Random Forest":RandomForestRegressor(n_estimators=200,random_state=42,n_jobs=-1),
    "Gradient Boosting":GradientBoostingRegressor(n_estimators=200,random_state=42),
    "XGBoost":XGBRegressor(n_estimators=200,learning_rate=0.05,max_depth=6,subsample=0.8,colsample_bytree=0.8,random_state=42,n_jobs=-1,objective="reg:squarederror")
}

results=[]

for name,model in models.items():
    pipeline=Pipeline([
        ("preprocessor",preprocessor),
        ("model",model)
    ])

    pipeline.fit(X_train,y_train)

    predictions=pipeline.predict(X_test)

    mae=mean_absolute_error(y_test,predictions)
    rmse=np.sqrt(mean_squared_error(y_test,predictions))
    r2=r2_score(y_test,predictions)

    results.append({
        "Model":name,
        "MAE":round(mae,2),
        "RMSE":round(rmse,2),
        "R2 Score":round(r2,4)
    })

results_df=pd.DataFrame(results)

print("Demand Model Comparison")
print("="*60)
print(results_df.to_string(index=False))

best_model=results_df.loc[results_df["R2 Score"].idxmax()]

print("\nBest Model:")
print(best_model["Model"])
print(f"R2 Score:{best_model['R2 Score']}")

results_df.to_csv("../models/demand_model_comparison.csv",index=False)

print("\nComparison results saved successfully")