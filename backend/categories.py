from flask import request
from flask_restx import Resource, Namespace, fields
from models import Product
from flask_jwt_extended import jwt_required

categories_ns = Namespace("category", description = "A namespace for our Categories")