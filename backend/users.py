from flask import request, jsonify, make_response, render_template
from flask_restx import Resource, Namespace, fields
from models import User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity

# Define namespace
users_ns = Namespace("user", description = "A namespace for our Users")


# Define the model as in models.py
user_model = users_ns.model(
    "User",
    {
        "id":fields.Integer(),
        "username":fields.String(),
        "email":fields.String(),
        "password":fields.String()
    }
)

input_model = users_ns.model(
    "Input",
    {
        "input": fields.String()
    }
)



# Define the API

@users_ns.route('/users')
class UsersResource(Resource):

    @users_ns.marshal_list_with(user_model)
    def get(self):
        #recupera tutti gli Users
        # page = request.args.get('page', 1, type=int)
        # per_page = request.args.get('per_page', 4, type=int)
        users = User.query.all()
        return users
    
    @users_ns.marshal_with(user_model)
    @users_ns.expect(user_model)
    @jwt_required()
    def post(self):
        #crea nuovo User
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

        return make_response(jsonify({"message": "User created successfully"}), 201)

@users_ns.route('/user/<int:id>')
class UserResource(Resource):
    @users_ns.marshal_with(user_model)
    def get(self,id):
        #recupera un Prodotto tramite id
        user = User.query.get_or_404(id)

        return user
    
    # @users_ns.marshal_with(user_model)
    # @jwt_required()
    # def put(self,id):

    #     data = request.get_json()
    #     #aggiorna uno User
    #     user_to_update = User.query.get_or_404(id)
    #     old_password = data.get('old_password')

    #     if user_to_update and check_password_hash(user_to_update.password, old_password):
    #         password = data.get('password')
    #         user_to_update.update(generate_password_hash(password))
    #         user_to_update.save()

    #         return make_response(jsonify({"message": "User updated successfully"}), 201)
    #     else:
    #         return make_response(jsonify({"message": "Old password is not correct"}))
    
    @users_ns.marshal_with(user_model)
    @jwt_required()
    def delete(self,id):
        #elimina un utente
        user_to_delete = User.query.get_or_404(id)

        user_to_delete.delete()

        return user_to_delete
    
@users_ns.route('/search')
class UsersResource(Resource):
    @users_ns.marshal_with(user_model)
    def post(self):
        data = request.get_json()
        input = data.get('input')
        search = "%{}%".format(input)

        users = User.query.filter(User.username.like(search)).all()

        return users