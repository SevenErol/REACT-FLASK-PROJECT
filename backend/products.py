from flask import request, jsonify
from flask_restx import Resource, Namespace, fields
from models import Product
from flask_jwt_extended import jwt_required
import math

products_ns = Namespace("product", description="A namespace for our Products")

product_model = products_ns.model(
    "Product",
    {
        "id": fields.Integer(),
        "name": fields.String(),
        "description": fields.String(),
        "price": fields.Float(),
        "stock": fields.Integer(),
        "created_at": fields.DateTime(),
        "category_id": fields.Integer(),
    },
)


@products_ns.route("/hello")
class HelloResource(Resource):
    def get(self):
        return {"message": "Hello World"}


@products_ns.route("/products")
class ProductsResource(Resource):

    # @products_ns.marshal_list_with(paged_product_model)
    def get(self):
        # recupera tutti i Prodotti

        # products = Product.query.all()
        # return products

        page = request.args.get("page", default=1, type=int)
        per_page = request.args.get("per_page", default=2, type=int)

        pagination = Product.query.paginate(
            page=page, per_page=per_page, error_out=False
        )

        items = [
            {
                "id": product.id,
                "name": product.name,
                "description": product.description,
                "price": product.price,
                "stock": product.stock,
                "created_at": product.created_at,
                "category_id": product.category_id,
            }
            for product in pagination.items
        ]

        last_page = math.ceil(pagination.total / per_page)

        all_pages = []

        for x in range(last_page):
            all_pages.append(x + 1)

        return jsonify(
            {
                "items": items,
                "total": pagination.total,
                "page": page,
                "per_page": per_page,
                "last_page": last_page,
                "all_pages": all_pages,
            }
        )

    @products_ns.marshal_with(product_model)
    @products_ns.expect(product_model)
    @jwt_required()
    def post(self):
        # crea nuovo Prodotto
        data = request.get_json()

        new_product = Product(
            name=data.get("name"),
            description=data.get("description"),
            price=data.get("price"),
            stock=data.get("stock"),
            category_id=data.get("category_id"),
        )

        new_product.save()

        return new_product, 201


@products_ns.route("/product/<int:id>")
class ProductResource(Resource):
    @products_ns.marshal_with(product_model)
    def get(self, id):
        # recupera un Prodotto tramite id
        product = Product.query.get_or_404(id)

        return product

    @products_ns.marshal_with(product_model)
    @jwt_required()
    def put(self, id):
        # aggiorna un prodotto
        product_to_update = Product.query.get_or_404(id)
        data = request.get_json()

        product_to_update.update(
            data.get("name"),
            data.get("description"),
            data.get("price"),
            data.get("stock"),
            data.get("category_id"),
        )

        return product_to_update

    @products_ns.marshal_with(product_model)
    @jwt_required()
    def delete(self, id):
        # elimina un prodotto
        product_to_delete = Product.query.get_or_404(id)

        product_to_delete.delete()

        return product_to_delete


@products_ns.route("/search")
class UsersResource(Resource):
    @products_ns.marshal_with(product_model)
    @jwt_required()
    def post(self):
        data = request.get_json()
        input = data.get("input")
        search = "%{}%".format(input)

        users = Product.query.filter(Product.name.like(search)).all()

        return users
