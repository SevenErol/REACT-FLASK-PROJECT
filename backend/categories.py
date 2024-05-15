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

        new_category = Category(
            name = data.get('name')
        )
        
        new_category.save()

        return new_category, 201

@categories_ns.route('/category/<int:id>')
class ProductResource(Resource):
    @categories_ns.marshal_with(category_model)
    def get(self,id):
        #recupera una Categoria tramite id
        category = Category.query.get_or_404(id)

        return category
    
    @categories_ns.marshal_with(category_model)
    @jwt_required()
    def put(self,id):
        #aggiorna una categoria
        category_to_update = Category.query.get_or_404(id)
        data = request.get_json()

        category_to_update.update(data.get('name'))

        return category_to_update
    
    @categories_ns.marshal_with(category_model)
    @jwt_required()
    def delete(self,id):
        #elimina una categoria
        category_to_delete = Category.query.get_or_404(id)

        category_to_delete.delete()

        return category_to_delete

@categories_ns.route('/search')
class CategoriesResource(Resource):
    @categories_ns.marshal_with(category_model)
    def post(self):
        data = request.get_json()
        input = data.get('input')
        search = "%{}%".format(input)

        categories = Category.query.filter(Category.name.like(search)).all()

        return categories