from flask import Flask
from flask_restx import Api
from flask_migrate import Migrate
from models import Product, Category, Order, OrderItem, User
from exts import db
from flask_jwt_extended import JWTManager
from products import products_ns
from auth import auth_ns
from users import users_ns
from categories import categories_ns
from flask_cors import CORS
from config import DevConfig


def create_app():

    app = Flask(__name__)
    app.config.from_object(DevConfig)

    CORS(app)

    db.init_app(app)

    migrate = Migrate(app, db)

    JWTManager(app)

    api = Api(app, doc="/docs")
    api.add_namespace(products_ns)
    api.add_namespace(auth_ns)
    api.add_namespace(users_ns)
    api.add_namespace(categories_ns)

    @app.shell_context_processor
    def make_shell_context():
        return {
            "db": db,
            "Product": Product,
            "Category": Category,
            "Order": Order,
            "OrderItem": OrderItem,
            "User": User,
        }

    return app


"""

category_model = api.model(
    "Category",
    {
        "id":fields.Integer(),
        "name":fields.String(),
        "created_at":fields.DateTime()
    }
)

order_model = api.model(
    "Order",
    {
        "id":fields.Integer(),
        "total_price":fields.Integer(),
        "order_date":fields.DateTime()
    }
)


@api.route('/hello')
class HelloResource(Resource):
    def get(self):
        return {'message': 'Hello World'}

if __name__ == '__main__':
    app.run()
"""
