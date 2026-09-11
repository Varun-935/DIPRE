import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder,StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.ensemble import GradientBoostingRegressor

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

model=GradientBoostingRegressor(
    n_estimators=200,
    random_state=42
)

pipeline=Pipeline([
    ("preprocessor",preprocessor),
    ("model",model)
])

pipeline.fit(X_train,y_train)

joblib.dump(pipeline,"../models/demand_gradient_boosting.pkl")

print("Final demand model trained successfully")
print("Model:Gradient Boosting")
print("Model saved successfully")