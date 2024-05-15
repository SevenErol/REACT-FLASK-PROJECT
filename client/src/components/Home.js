import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth'
import Product from './Product'
import { Modal, Form, Button, Table } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import Searchbar from './Searchbar'

const LoggedInHome = () => {

    const [products, setProducts] = useState([])
    const [show, setShow] = useState(false)
    const [productId, setProductId] = useState(0)
    const [deleteshow, setDeleteShow] = useState(false)
    const [searchbar, setSearchbar] = useState('')
    const [categories, setCategories] = useState([])

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm()


    const inputChangeHandler = (e) => {
        const inputValue = e.target.value
        setSearchbar(inputValue)
    }

    const filteredProducts = (search) => {

        const object = {
            "input": search
        }

        const requestData = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            },
            body: JSON.stringify(object)
        }

        fetch('/product/search', requestData)
            .then(res => res.json())
            .then(data => {
                setProducts(data)
            })
            .catch(err => console.log(err))

    }

    const getAllProductsSearch = () => {
        return (
            filteredProducts(searchbar),
            setSearchbar('')
        )
    }

    useEffect(
        () => {
            fetch('/product/products')
                .then(res => res.json())
                .then(data => {
                    setProducts(data)
                })
                .catch(err => console.log(err))
        }, []
    )

    useEffect(
        () => {
            fetch('/category/categories')
                .then(res => res.json())
                .then(data => {
                    setCategories(data)
                })
                .catch(err => console.log(err))
        }, []
    )

    const closeModal = () => {
        setShow(false)
    }

    const closeModalDelete = () => {
        setDeleteShow(false)
    }

    const deleteModal = (id) => {
        setDeleteShow(true)
        setProductId(id)
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

    let token = localStorage.getItem('REACT_TOKEN_AUTH_KEY')

    const updateProduct = (data) => {

        console.log(data)

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

    const deleteProduct = (id) => {

        const getAllProducts = () => {
            return (
                fetch('/product/products')
                    .then(res => res.json())
                    .then(data => {
                        setProducts(data)
                        setDeleteShow(false)
                    })
                    .catch(err => console.log(err))
            )
        }

        const requestData = {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            }
        }

        fetch(`/product/product/${id}`, requestData)
            .then(res => res.json)
            .then(data => {
                getAllProducts()
            }
            )
            .catch(err => console.log(err))
    }


    return (
        <div className='products container-fluid lm_main'>

            <div className='row'>

                <div className='col-2 p-3 lm_menu d-flex flex-column'>
                    <h3 className='font-weight-bold mb-3 p-2 text-center'>Menù</h3>

                    <div className='mb-3 p-2 text-center'>
                        <Link className="col-2 lm_menu_voice" to="/categories">All categories</Link>
                    </div>

                    <div className='mb-3 p-2 text-center'>
                        <Link className="col-2 lm_menu_voice" to="/users">All users</Link>
                    </div>
                </div>
                <div className='col-10 h-100 lm_inner_menu'>
                    <div className='container p-2'>
                        <div className='row p-2 justify-content-between'>
                            <div className='col-2'>
                                <h1>Products</h1>
                            </div>

                            <Searchbar searchbar={searchbar} onChange={inputChangeHandler} onClick={getAllProductsSearch} />

                            <div className='col-2'>
                                <Link className='btn btn-success' to="/create_product">Add new product</Link>
                            </div>

                        </div>

                        <div className='row'>
                            <Table bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Product Name</th>
                                        <th>Product Description</th>
                                        <th>Product Price</th>
                                        <th>Product Stock</th>
                                        <th>Product Category</th>
                                        <th>Product Actions</th>
                                    </tr>
                                </thead>

                                {
                                    products.map(
                                        (product, key) => (
                                            <Product key={key} {...product} onClick={() => { showModal(product.id) }} onDelete={() => { deleteModal(product.id) }} />
                                        )
                                    )
                                }

                            </Table>


                        </div>
                    </div>
                </div>

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
                            <Form.Control type="number" min="1" step=".01" placheholder='Product price' {...register('price', { required: true })} />
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
                                <option disabled>Select a category</option>
                                {
                                    categories.map(
                                        (category, key) => (
                                            <option key={key} value={category.id}>{category.name}</option>
                                        )
                                    )
                                }
                            </Form.Select>
                        </Form.Group>

                        {errors.category_id && <p style={{ color: 'red' }}><small>Category is required</small></p>}

                        <Form.Group>
                            <Button as='sub' variant='primary' onClick={handleSubmit(updateProduct)}>Update product</Button>
                        </Form.Group>
                    </Modal.Body>
                </Modal>

                <Modal show={deleteshow} size='lg' onHide={closeModalDelete}>

                    <Modal.Header closeButton>
                        <Modal.Title>Warning: Irreversible Action</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>Are you sure you want to proceed? This action is irreversible and cannot be undone. Take a moment to consider the consequences before confirming. Once initiated, all associated data and changes will be permanent. If you're certain about your decision, proceed cautiously.</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeModalDelete}>Close</Button>
                        <Button variant="danger" onClick={() => { deleteProduct(productId) }}>Confirm delete</Button>
                    </Modal.Footer>

                </Modal>
            </div>
        </div>
    )
}

const LoggedOutHome = () => {
    return (
        <div className='products'>
            <div className='container-fluid lm_main'>
                <div className='row h-100 justify-content-center align-items-center'>
                    <h1 className='text-center'>Authentication Failed</h1>
                </div>
            </div>

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