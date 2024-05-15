import unittest
from main import create_app
from config import TestConfig
from exts import db


class APITestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app(TestConfig)

        self.client = self.app.test_client(self)

        with self.app.app_context():
            # db.init_app(self.app)
            db.create_all()

    def test_hello_world(self):
        hello_response = self.client.get("/product/hello")

        json = hello_response.json

        self.assertEqual(json, {"message": "Hello World"})

    def test_signup(self):

        signup_response = self.client.post(
            "/auth/signup",
            json={
                "username": "testuser",
                "email": "testuser@mail.com",
                "password": "password",
            },
        )
        status_code = signup_response.status_code
        self.assertEqual(status_code, 201)

    def test_login(self):

        login_response = self.client.post(
            "/auth/login", json={"username": "testuser", "password": "password"}
        )
        status_code = login_response.status_code
        self.assertEqual(status_code, 200)

    def test_get_all_categories(self):

        categories_response = self.client.get("/category/categories")
        status_code = categories_response.status_code
        self.assertEqual(status_code, 200)

    def test_get_all_users(self):

        users_response = self.client.get("/user/users")
        status_code = users_response.status_code
        self.assertEqual(status_code, 200)

    def test_get_all_products(self):

        products_response = self.client.get("/product/products")
        status_code = products_response.status_code
        self.assertEqual(status_code, 200)

    def test_get_one_product(self):

        id = 1
        product_response = self.client.get("/product/product/{id}")
        status_code = product_response.status_code
        self.assertEqual(status_code, 404)

    def test_get_one_category(self):

        id = 1
        category_response = self.client.get("/category/category/{id}")
        status_code = category_response.status_code
        self.assertEqual(status_code, 404)

    def test_get_one_user(self):

        id = 1
        user_response = self.client.get("/user/user/{id}")
        status_code = user_response.status_code
        self.assertEqual(status_code, 404)

    def test_create_product(self):

        signup_response = self.client.post(
            "/auth/signup",
            json={
                "username": "testuser",
                "email": "testuser@mail.com",
                "password": "password",
            },
        )
        login_response = self.client.post(
            "/auth/login", json={"username": "testuser", "password": "password"}
        )
        access_token = login_response.json["access_token"]
        create_product_response = self.client.post(
            "/product/products",
            json={
                "name": "Testname",
                "description": "Testdescription",
                "price": 10,
                "stock": 1,
                "category_id": 1,
            },
            headers={"Authorization": f"Bearer {access_token}"},
        )
        status_code = create_product_response.status_code
        self.assertEqual(status_code, 201)

    def test_create_category(self):

        signup_response = self.client.post(
            "/auth/signup",
            json={
                "username": "testuser",
                "email": "testuser@mail.com",
                "password": "password",
            },
        )
        login_response = self.client.post(
            "/auth/login", json={"username": "testuser", "password": "password"}
        )
        access_token = login_response.json["access_token"]
        create_category_response = self.client.post(
            "/category/categories",
            json={"name": "Testname"},
            headers={"Authorization": f"Bearer {access_token}"},
        )
        status_code = create_category_response.status_code
        self.assertEqual(status_code, 201)

    def test_update_product(self):
        signup_response = self.client.post(
            "/auth/signup",
            json={
                "username": "testuser",
                "email": "testuser@mail.com",
                "password": "password",
            },
        )
        login_response = self.client.post(
            "/auth/login", json={"username": "testuser", "password": "password"}
        )
        access_token = login_response.json["access_token"]
        create_product_response = self.client.post(
            "/product/products",
            json={
                "name": "Testname",
                "description": "Testdescription",
                "price": 10,
                "stock": 1,
                "category_id": 1,
            },
            headers={"Authorization": f"Bearer {access_token}"},
        )
        id = 1
        update_response = self.client.put(
            f"/product/product/{id}",
            json={
                "name": "Testname3",
                "description": "Testdescription3",
                "price": 10,
                "stock": 1,
                "category_id": 1,
            },
            headers={"Authorization": f"Bearer {access_token}"},
        )
        status_code = update_response.status_code
        self.assertEqual(status_code, 200)

    def test_update_category(self):
        signup_response = self.client.post(
            "/auth/signup",
            json={
                "username": "testuser",
                "email": "testuser@mail.com",
                "password": "password",
            },
        )
        login_response = self.client.post(
            "/auth/login", json={"username": "testuser", "password": "password"}
        )
        access_token = login_response.json["access_token"]
        create_category_response = self.client.post(
            "/category/categories",
            json={"name": "Testname"},
            headers={"Authorization": f"Bearer {access_token}"},
        )
        id = 1
        update_response = self.client.put(
            f"/category/category/{id}",
            json={"name": "Testname3"},
            headers={"Authorization": f"Bearer {access_token}"},
        )
        status_code = update_response.status_code
        self.assertEqual(status_code, 200)

    def test_delete_products(self):
        signup_response = self.client.post(
            "/auth/signup",
            json={
                "username": "testuser",
                "email": "testuser@mail.com",
                "password": "password",
            },
        )
        login_response = self.client.post(
            "/auth/login", json={"username": "testuser", "password": "password"}
        )
        access_token = login_response.json["access_token"]
        create_product_response = self.client.post(
            "/product/products",
            json={
                "name": "Testname",
                "description": "Testdescription",
                "price": 10,
                "stock": 1,
                "category_id": 1,
            },
            headers={"Authorization": f"Bearer {access_token}"},
        )
        id = 1
        delete_response = self.client.delete(
            f"/product/product/{id}",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        status_code = delete_response.status_code
        self.assertEqual(status_code, 200)

    def test_delete_categories(self):
        signup_response = self.client.post(
            "/auth/signup",
            json={
                "username": "testuser",
                "email": "testuser@mail.com",
                "password": "password",
            },
        )
        login_response = self.client.post(
            "/auth/login", json={"username": "testuser", "password": "password"}
        )
        access_token = login_response.json["access_token"]
        create_product_response = self.client.post(
            "/category/categories",
            json={"name": "Testname"},
            headers={"Authorization": f"Bearer {access_token}"},
        )
        id = 1
        delete_response = self.client.delete(
            f"/category/category/{id}",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        status_code = delete_response.status_code
        self.assertEqual(status_code, 200)

    def test_search_products(self):
        signup_response = self.client.post(
            "/auth/signup",
            json={
                "username": "testuser",
                "email": "testuser@mail.com",
                "password": "password",
            },
        )
        login_response = self.client.post(
            "/auth/login", json={"username": "testuser", "password": "password"}
        )
        access_token = login_response.json["access_token"]
        search_response = self.client.post(
            "/product/search",
            json={"input": "test"},
            headers={"Authorization": f"Bearer {access_token}"},
        )
        status_code = search_response.status_code
        self.assertEqual(status_code, 200)

    def test_search_categories(self):
        signup_response = self.client.post(
            "/auth/signup",
            json={
                "username": "testuser",
                "email": "testuser@mail.com",
                "password": "password",
            },
        )
        login_response = self.client.post(
            "/auth/login", json={"username": "testuser", "password": "password"}
        )
        access_token = login_response.json["access_token"]
        search_response = self.client.post(
            "/category/search",
            json={"input": "test"},
            headers={"Authorization": f"Bearer {access_token}"},
        )
        status_code = search_response.status_code
        self.assertEqual(status_code, 200)

    def test_search_users(self):
        signup_response = self.client.post(
            "/auth/signup",
            json={
                "username": "testuser",
                "email": "testuser@mail.com",
                "password": "password",
            },
        )
        login_response = self.client.post(
            "/auth/login", json={"username": "testuser", "password": "password"}
        )
        access_token = login_response.json["access_token"]
        search_response = self.client.post(
            "/user/search",
            json={"input": "test"},
            headers={"Authorization": f"Bearer {access_token}"},
        )
        status_code = search_response.status_code
        self.assertEqual(status_code, 200)

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()


if __name__ == "__main__":
    unittest.main()
