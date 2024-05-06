from flask import Flask, request
from flask_restx import Api, Resource, fields
from flask_migrate import Migrate
from config import DevConfig
from models import Product, Category, Order, OrderItem
from exts import db

app = Flask(__name__)

app.config.from_object(DevConfig)

db.init_app(app)

migrate = Migrate(app,db)

api = Api(app, doc='/docs')

#modello (serializer)
product_model = api.model(
    "Product",
    {
        "id":fields.Integer(),
        "name":fields.String(),
        "description":fields.String(),
        "price":fields.Integer(),
        "stock":fields.Integer(),
        "created_at":fields.DateTime(),
        "category_id":fields.Integer()
    }
)

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
        "order_date":fields.DateTime(),
    }
)


#API ROUTES 
@api.route('/hello')
class HelloResource(Resource):
    def get(self):
        return {'message': 'Hello World'}
    
@api.route('/products')
class ProductsResource(Resource):

    @api.marshal_list_with(product_model)
    def get(self):
        #recupera tutti i Prodotti
        products = Product.query.all()
        return products
    
    @api.marshal_with(product_model)
    def post(self):
        #crea nuovo Prodotto
        data = request.get_json()

        new_product = Product(
            name = data.get('name'),
            description = data.get('description'),
            price = data.get('price'),
            stock = data.get('stock'),
            category_id = data.get('category_id')
        )
        
        new_product.save()

        return new_product, 201

@api.route('/product/<int:id>')
class ProductResource(Resource):
    @api.marshal_with(product_model)
    def get(self,id):
        #recupera un Prodotto tramite id
        product = Product.query.get_or_404(id)

        return product
    
    @api.marshal_with(product_model)
    def put(self,id):
        #aggiorna un prodotto
        product_to_update = Product.query.get_or_404(id)
        data = request.get_json()

        product_to_update.update(data.get('name'),data.get('description'))

        return product_to_update
    
    @api.marshal_with(product_model)
    def delete(self,id):
        #elimina un prodotto
        product_to_delete = Product.query.get_or_404(id)

        product_to_delete.delete()

        return product_to_delete


@app.shell_context_processor
def make_shell_context():
    return {
        "db": db,
        "Product": Product,
        "Category": Category,
        "Order": Order,
        "OrderItem": OrderItem
    }
    
if __name__ == '__main__':
    app.run()