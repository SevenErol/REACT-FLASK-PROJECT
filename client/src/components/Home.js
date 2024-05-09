import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth'
import Product from './Product'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const LoggedInHome = () => {

    const [products, setProducts] = useState([])

    useEffect(
        () => {
            fetch('/product/products')
                .then(res => res.json())
                .then(data => {
                    //console.log(data)
                    setProducts(data)
                    console.log(products)
                })
                .catch(err => console.log(err))
        }
    )


    return (
        <div className='products'>
            <h1>Prodotti</h1>

            {products.map(
                (product, key) => (
                    < Card className="text-center" >
                        <Card.Header>Prodotto</Card.Header>
                        <Card.Body>
                            <Card.Title>{product.name}</Card.Title>
                            <Card.Text>
                                {product.description}
                            </Card.Text>
                            <Card.Text>
                                {product.price}
                            </Card.Text>
                            <Card.Text>
                                {product.stock}
                            </Card.Text>
                            <Button variant="primary">Go somewhere</Button>
                        </Card.Body>
                        <Card.Footer className="text-muted">2 days ago</Card.Footer>
                    </Card >
                )
            )}

            {
                products.map(
                    (product) => (
                        <Product id={product.id} name={product.name} description={product.description} price={product.price} stock={product.stock} category_id={product.category_id} />
                    )
                )
            }
        </div>
    )
}

const LoggedOutHome = () => {
    return (
        <div className='products'>
            <h1>Prodotti Non Loggato</h1>
            <Link className="btn btn-primary btn-lg btn-submit" to="/signup">Signup</Link>
        </div>
    )
}

const HomePage = () => {

    const [logged] = useAuth()
    return (
        <div>
            {logged ? <LoggedInHome /> : <LoggedOutHome />}
        </div>
    )
}

export default HomePage