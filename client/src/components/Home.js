import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth'
import Product from './Product'
import { Modal, Form, Button, Table } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import Searchbar from './Searchbar'
import axios from 'axios'
import Pagination from 'react-bootstrap/Pagination';

const LoggedInHome = () => {

    const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');

    const [products, setProducts] = useState([]);
    const [show, setShow] = useState(false);
    const [productId, setProductId] = useState(null);
    const [deleteShow, setDeleteShow] = useState(false);
    const [searchbar, setSearchbar] = useState('');
    const [categories, setCategories] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const [pages, setPages] = useState([]);
    const [lastPage, setLastPage] = useState(1);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    const headers = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(token)}`,
        },
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:5000/product/products');
            setProducts(res.data.items);
            setPages(res.data.all_pages);
            setLastPage(res.data.last_page);
        } catch (err) {
            console.error('Failed to fetch products:', err);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:5000/category/allcategories');
            setCategories(res.data);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    };

    const searchProducts = async () => {
        try {
            const res = await axios.post('http://127.0.0.1:5000/product/search', { input: searchbar }, headers);
            setProducts(res.data.items);
            setPages(res.data.all_pages);
            setLastPage(res.data.last_page);
        } catch (err) {
            console.error('Search failed:', err);
        }
    };

    const handlePagination = async (page) => {
        try {
            setActivePage(page);
            if (searchbar === '') {

                const res = await axios.get(`http://127.0.0.1:5000/product/products?page=${page}`);
                setProducts(res.data.items);

            } else {
                const res = await axios.post(`http://127.0.0.1:5000/product/search?page=${page}`, { input: searchbar }, headers);
                setProducts(res.data.items);
                setPages(res.data.all_pages);
                setLastPage(res.data.last_page);
            }


        } catch (err) {
            console.error('Pagination failed:', err);
        }
    };

    const showModal = (id) => {
        const product = products.find((p) => p.id === id);
        if (product) {
            setShow(true);
            setProductId(id);
            setValue('name', product.name);
            setValue('description', product.description);
            setValue('price', product.price);
            setValue('stock', product.stock);
            setValue('category_id', product.category_id);
        }
    };

    const updateProduct = async (data) => {
        try {
            await axios.put(`http://127.0.0.1:5000/product/product/${productId}`, data, headers);
            setShow(false);
            fetchProducts();
        } catch (err) {
            console.error('Failed to update product:', err);
        }
    };

    const deleteProduct = async () => {
        try {
            await axios.delete(`http://127.0.0.1:5000/product/product/${productId}`, headers);
            setDeleteShow(false);
            fetchProducts();
        } catch (err) {
            console.error('Failed to delete product:', err);
        }
    };


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

                            <Searchbar searchbar={searchbar} onChange={(e) => setSearchbar(e.target.value)} onClick={searchProducts} />

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
                                    products.map((product) => (
                                        <Product categoryname={product.categoryname} key={product.id} {...product} onClick={() => showModal(product.id)} onDelete={() => { setProductId(product.id); setDeleteShow(true); }} />
                                    ))
                                }


                            </Table>


                        </div>
                        <Pagination>
                            <Pagination.First onClick={() => handlePagination(1)} />

                            {pages.map((page, key) => (
                                <Pagination.Item key={page} active={activePage === page} onClick={() => handlePagination(page)}>{page}</Pagination.Item>
                            ))}


                            <Pagination.Last onClick={() => handlePagination(lastPage)} />
                        </Pagination>
                    </div>
                </div>

                <Modal show={show} size='lg' onHide={() => setShow(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Update Product
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* Campo name oggetto product */}
                        <Form onSubmit={handleSubmit(updateProduct)}>
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
                                <Button variant='primary' type='submit'>Update product</Button>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                </Modal>

                <Modal show={deleteShow} size='lg' onHide={() => setDeleteShow(false)}>

                    <Modal.Header closeButton>
                        <Modal.Title>Warning: Irreversible Action</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>Are you sure you want to proceed? This action is irreversible and cannot be undone. Take a moment to consider the consequences before confirming. Once initiated, all associated data and changes will be permanent. If you're certain about your decision, proceed cautiously.</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setDeleteShow(false)}>Close</Button>
                        <Button variant="danger" onClick={deleteProduct}>Confirm delete</Button>
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