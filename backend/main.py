from flask import Flask, request, jsonify
from flask_restx import Api, Resource, fields
from flask_migrate import Migrate
from config import DevConfig
from models import Product, Category, Order, OrderItem, User
from exts import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required

app = Flask(__name__)

app.config.from_object(DevConfig)

db.init_app(app)

migrate = Migrate(app,db)

JWTManager(app)

api = Api(app, doc='/docs')

#modello (serializer)
#############################################################################
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
        "order_date":fields.DateTime()
    }
)

signup_model = api.model(
    "SignUp",
    {
        "username":fields.String(),
        "email":fields.String(),
        "password":fields.String()
    }
)

login_model = api.model(
    "Login",
    {
        "username":fields.String(),
        "password":fields.String()
    }
)
##################################################################################

#API ROUTES 
###################################################################################
@api.route('/hello')
class HelloResource(Resource):
    def get(self):
        return {'message': 'Hello World'}

@api.route('/signup')
class SignUp(Resource):

    @api.expect(signup_model)
    def post(self):
        data = request.get_json()

        username = data.get('username')
        email = data.get('email')

        db_user = User.query.filter_by(username = username).first()
        email_user = User.query.filter_by(email = email).first()

        #verifica che lo username sia univoco
        if db_user is not None:
            return jsonify({"message": f"User with username {username} already exists"})
        
        #verifica che la email sia univoca
        if email_user is not None:
            return jsonify({"message": f"User with email {email} already exists"})

        new_user = User(
            username = data.get('username'),
            email = data.get('email'),
            password = generate_password_hash(data.get('password'))
        )

        new_user.save()

        return jsonify({"message": "User created successfully"})

@api.route('/login')
class Login(Resource):

    @api.expect(login_model)
    def post(self):
        data = request.get_json()

        username = data.get('username')
        password = data.get('password')

        db_user = User.query.filter_by(username = username).first()

        if db_user and check_password_hash(db_user.password, password):

            access_token = create_access_token(identity=db_user.username)
            refresh_token = create_refresh_token(identity=db_user.username)

            return jsonify(
                {"access_token": access_token, "refresh_token": refresh_token}
            )


@api.route('/products')
class ProductsResource(Resource):

    @api.marshal_list_with(product_model)
    def get(self):
        #recupera tutti i Prodotti
        products = Product.query.all()
        return products
    
    @api.marshal_with(product_model)
    @api.expect(product_model)
    @jwt_required()
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
    @jwt_required()
    def put(self,id):
        #aggiorna un prodotto
        product_to_update = Product.query.get_or_404(id)
        data = request.get_json()

        product_to_update.update(data.get('name'),data.get('description'))

        return product_to_update
    
    @api.marshal_with(product_model)
    @jwt_required()
    def delete(self,id):
        #elimina un prodotto
        product_to_delete = Product.query.get_or_404(id)

        product_to_delete.delete()

        return product_to_delete

#######################################################################

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