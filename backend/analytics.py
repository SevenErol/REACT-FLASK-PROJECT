from flask import request, jsonify
from flask_restx import Resource, Namespace, fields
from models import Category
from flask_jwt_extended import jwt_required
import math
import pandas as pd

# Define namespace
analytics_ns = Namespace("analytics", description="A namespace for Analytics")

# data = pd.DataFrame(
#     {
#         "date": pd.date_range(start="2023-01-01", periods=7),
#         "sales": [150, 200, 250, 300, 220, 400, 500],
#     }
# )

# Dataset simulato
data = [
    {"date": "2025-01-01", "category": "Electronics", "price": 1200, "quantity": 2},
    {"date": "2025-01-05", "category": "Furniture", "price": 800, "quantity": 1},
    {"date": "2025-02-01", "category": "Electronics", "price": 450, "quantity": 5},
    {"date": "2025-02-03", "category": "Clothing", "price": 50, "quantity": 10},
    {"date": "2025-02-05", "category": "Furniture", "price": 950, "quantity": 2},
]

# Carichiamo i dati in un DataFrame
df = pd.DataFrame(data)
df["date"] = pd.to_datetime(df["date"])


@analytics_ns.route("/api/analytics/kpi")
class AnalyticsResource(Resource):
    def get(self):
        total_sales = int((df["price"] * df["quantity"]).sum())
        # restituisce il numero totale di righe nel DataFrame
        total_orders = int(df.shape[0])
        average_sales = float((df["price"] * df["quantity"]).mean())

        response = {
            "total_sales": total_sales,
            "total_orders": total_orders,
            "average_sales": round(average_sales, 2),
        }
        return jsonify(response)


@analytics_ns.route("/api/analytics/sales_by_category")
class AnalyticsResource(Resource):
    def get(self):
        sales_data = (
            df.groupby("category")
            .apply(lambda x: (x["price"] * x["quantity"]).sum())
            .reset_index()
        )
        sales_data.columns = ["category", "total_sales"]
        sales_data["total_sales"] = sales_data["total_sales"].astype(int)
        return jsonify(sales_data.to_dict(orient="records"))


@analytics_ns.route("/api/analytics/price_range")
class AnalyticsResource(Resource):
    def get(self):
        bins = [0, 500, 1000, 2000]
        labels = ["0-500", "500-1000", "1000-2000"]
        df["price_range"] = pd.cut(df["price"], bins=bins, labels=labels, right=False)
        price_range_data = df.groupby("price_range").size().reset_index(name="count")
        return jsonify(price_range_data.to_dict(orient="records"))
