import pandas as pd

df=pd.read_csv("../dataset/dipre_sales_data.csv")

print("Dataset shape:")
print(df.shape)

print("\nColumn names:")
print(df.columns.tolist())

print("\nMissing values:")
print(df.isnull().sum())

print("\nDuplicate rows:")
print(df.duplicated().sum())

print("\nData types:")
print(df.dtypes)

print("\nStatistical summary:")
print(df.describe())

print("\nCategory distribution:")
print(df["category"].value_counts())

print("\nTarget distribution:")
print(df["demand"].describe())