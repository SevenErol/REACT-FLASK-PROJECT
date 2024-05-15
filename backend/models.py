from exts import db
from datetime import datetime


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(25), unique=True, nullable=False)
    email = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.Text(), nullable=False)
    # created_at = db.Column(db.DateTime, default=datetime.utcnow)
    # orders = db.relationship('Order', backref='user', lazy=True)

    def __repr__(self):
        return f"<User {self.username}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self, password):
        self.password = password


class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    stock = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    category_id = db.Column(db.Integer, db.ForeignKey("category.id"), nullable=True)
    category = db.relationship("Category", backref=db.backref("products", lazy=True))

    def __repr__(self):
        return f"<Product {self.name} {self.description} {self.price} {self.stock} {self.category_id}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self, name, description, price, stock, category_id):
        self.name = name
        self.description = description
        self.price = price
        self.stock = stock
        self.category_id = category_id

        db.session.commit()


class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Category {self.name}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def update(self, name):
        self.name = name
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


product_category = db.Table(
    "product_categories",
    db.Column("product_id", db.Integer, db.ForeignKey("product.id"), primary_key=True),
    db.Column(
        "category_id", db.Integer, db.ForeignKey("category.id"), primary_key=True
    ),
)


# Define the ProductCategory model to represent the association table
class ProductCategory(db.Model):
    __tablename__ = "product_category"
    product_id = db.Column(db.Integer, db.ForeignKey("product.id"), primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey("category.id"), primary_key=True)


class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    total_price = db.Column(db.Numeric(10, 2), nullable=False)
    order_date = db.Column(db.DateTime, default=datetime.utcnow)
    items = db.relationship("OrderItem", backref="order", lazy=True)


class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("order.id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("product.id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
