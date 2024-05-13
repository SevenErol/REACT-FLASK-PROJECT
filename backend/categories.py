from flask import request
from flask_restx import Resource, Namespace, fields
from models import Category
from flask_jwt_extended import jwt_required

categories_ns = Namespace("category", description = "A namespace for our Categories")

category_model = categories_ns.model(
    "Product",
    {
        "id":fields.Integer(),
        "name":fields.String(),
        "created_at":fields.DateTime()
    }
)

@categories_ns.route('/categories')
class CategoriesResource(Resource):

    @categories_ns.marshal_list_with(category_model)
    def get(self):
        #recupera tutti i Prodotti
        categories = Category.query.all()
        return categories
    
    @categories_ns.marshal_with(category_model)
    @categories_ns.expect(category_model)
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

@categories_ns.route('/product/<int:id>')
class ProductResource(Resource):
    @categories_ns.marshal_with(category_model)
    def get(self,id):
        #recupera un Prodotto tramite id
        product = Product.query.get_or_404(id)

        return product
    
    @categories_ns.marshal_with(category_model)
    @jwt_required()
    def put(self,id):
        #aggiorna un prodotto
        product_to_update = Product.query.get_or_404(id)
        data = request.get_json()

        product_to_update.update(data.get('name'),data.get('description'),data.get('price'),data.get('stock'),data.get('category_id'))

        return product_to_update
    
    @categories_ns.marshal_with(category_model)
    @jwt_required()
    def delete(self,id):
        #elimina un prodotto
        product_to_delete = Product.query.get_or_404(id)

        product_to_delete.delete()

        return product_to_delete