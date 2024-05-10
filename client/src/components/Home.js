import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth'
import Product from './Product'

const LoggedInHome = () => {

    const [products, setProducts] = useState([])

    useEffect(
        () => {
            fetch('/product/products')
                .then(res => res.json())
                .then(data => {
                    setProducts(data)
                })
                .catch(err => console.log(err))
        }
    )


    return (
        <div className='products'>
            <h1>Prodotti</h1>
            <div className='container'>
                <div className='row'>
                    {
                        products.map(
                            (product, key) => (
                                <Product key={key} {...product} />
                            )
                        )
                    }

                </div>
            </div>
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