import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth'
import Product from './Product'
import { Modal, Form, Button } from 'react-bootstrap'
import { useForm } from 'react-hook-form'

const LoggedInHome = () => {

    const [products, setProducts] = useState([])
    const [show, setShow] = useState(false)
    const [productId, setProductId] = useState(0)

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm()

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



    const closeModal = () => {
        setShow(false)
    }

    const showModal = (id) => {
        setShow(true)
        setProductId(id)

        products.map(
            (product, key) => {
                if (product.id === id) {
                    setValue('name', product.name)
                    setValue('description', product.description)
                    setValue('price', product.price)
                    setValue('stock', product.stock)
                    setValue('category_id', product.category_id)
                }
            }
        )
    }


    const updateProduct = (data) => {

        let token = localStorage.getItem('REACT_TOKEN_AUTH_KEY')

        const requestData = {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            },
            body: JSON.stringify(data)
        }

        fetch(`/product/product/${productId}`, requestData)
            .then(res => res.json)
            .then(data => {
                const reload = window.location.reload()
                reload()
            }
            )
            .catch(err => console.log(err))
    }


    return (
        <div className='products'>

            <Modal show={show} size='lg' onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Update Product
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Campo name oggetto product */}
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type='text' placheholder='Product name' {...register('name', { required: true, maxLength: 25 })} />
                    </Form.Group>

                    {errors.name && <p style={{ color: 'red' }}><small>Name is required</small></p>}
                    {errors.name?.type === 'maxLength' && <p style={{ color: 'red' }}><small>Max characters should be 25</small> </p>}

                    {/* Campo description oggetto product */}
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control as='textarea' rows={5} placheholder='Product description' {...register('description', { required: true, maxLength: 255 })} />
                    </Form.Group>

                    {errors.description && <p style={{ color: 'red' }}><small>Description is required</small></p>}
                    {errors.description?.type === 'maxLength' && <p style={{ color: 'red' }}><small>Description should be less than 255 characters</small> </p>}

                    {/* Campo price oggetto product */}
                    <Form.Group>
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="number" min="1" step="any" placheholder='Product price' {...register('price', { required: true })} />
                    </Form.Group>

                    {errors.price && <p style={{ color: 'red' }}><small>Price is required</small></p>}

                    {/* Campo stock oggetto product */}
                    <Form.Group>
                        <Form.Label>Stock</Form.Label>
                        <Form.Select placheholder='Product stock' {...register('stock', { required: true })} >
                            <option value='1'>Yes</option>
                            <option value='0'>No</option>
                        </Form.Select>
                    </Form.Group>

                    {errors.stock && <p style={{ color: 'red' }}><small>Stock needs a value</small></p>}

                    {/* Campo category_id oggetto product */}
                    <Form.Group>
                        <Form.Label>Category</Form.Label>
                        <Form.Select placheholder='Product stock' {...register('category_id', { required: true })} >
                            <option value='1'>Yes</option>
                            <option value='0'>No</option>
                        </Form.Select>
                    </Form.Group>

                    {errors.category_id && <p style={{ color: 'red' }}><small>Category is required</small></p>}

                    <Form.Group>
                        <Button as='sub' variant='primary' onClick={handleSubmit(updateProduct)}>Update product</Button>
                    </Form.Group>
                </Modal.Body>
            </Modal>

            <h1>Prodotti</h1>
            <div className='container'>
                <div className='row'>
                    {
                        products.map(
                            (product, key) => (
                                <Product key={key} {...product} onClick={() => { showModal(product.id) }} />
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