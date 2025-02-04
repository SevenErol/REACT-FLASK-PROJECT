import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth'
import Category from './Category'
import { Modal, Form, Button, Table } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import Searchbar from './Searchbar'
import axios from 'axios'
import Pagination from 'react-bootstrap/Pagination';

const LoggedInHome = () => {

    const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');

    const [categories, setCategories] = useState([]);
    const [show, setShow] = useState(false);
    const [categoryId, setCategoryId] = useState(null);
    const [deleteShow, setDeleteShow] = useState(false);
    const [searchbar, setSearchbar] = useState('');
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

    useEffect(
        () => {
            fetchCategories()
        }, []
    );

    const fetchCategories = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:5000/category/categories');
            setCategories(res.data.items);
            setPages(res.data.all_pages);
            setLastPage(res.data.last_page);
            setActivePage(1);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    };

    const searchCategories = async () => {
        try {
            const res = await axios.post('http://127.0.0.1:5000/category/search', { input: searchbar }, headers);
            setCategories(res.data.items);
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

                const res = await axios.get(`http://127.0.0.1:5000/category/categories?page=${page}`);
                setCategories(res.data.items);

            } else {
                const res = await axios.post(`http://127.0.0.1:5000/category/search?page=${page}`, { input: searchbar }, headers);
                setCategories(res.data.items);
                setPages(res.data.all_pages);
                setLastPage(res.data.last_page);
            }


        } catch (err) {
            console.error('Pagination failed:', err);
        }
    };

    const showModal = (id) => {
        const category = categories.find((p) => p.id === id);
        if (category) {
            setShow(true);
            setCategoryId(id);
            setValue('name', category.name);
        }
    };

    const updateCategory = async (data) => {
        try {
            await axios.put(`http://127.0.0.1:5000/category/category/${categoryId}`, data, headers);
            setShow(false);
            fetchCategories();
        } catch (err) {
            console.error('Failed to update category:', err);
        }
    };

    const deleteCategory = async () => {
        try {
            await axios.delete(`http://127.0.0.1:5000/category/category/${categoryId}`, headers);
            setDeleteShow(false);
            fetchCategories();
        } catch (err) {
            console.error('Failed to delete product:', err);
        }
    };



    return (
        <div className='categories container-fluid lm_main'>

            <div className='row'>

                <div className='col-2 p-3 lm_menu d-flex flex-column'>
                    <h3 className='font-weight-bold mb-3 p-2 text-center'>Menù</h3>
                    <div className='mb-3 p-2 text-center'>
                        <Link className="col-2 lm_menu_voice" to="/home">All products</Link>
                    </div>

                    <div className='mb-3 p-2 text-center'>
                        <Link className="col-2 lm_menu_voice" to="/users">All users</Link>
                    </div>
                </div>
                <div className='col-10 h-100 lm_inner_menu'>
                    <div className='container p-2'>
                        <div className='row p-2 justify-content-between'>
                            <div className='col-2'>
                                <h1>Categories</h1>
                            </div>
                            <Searchbar searchbar={searchbar} onChange={(e) => setSearchbar(e.target.value)} onClick={searchCategories} />
                            <div className='col-2'>
                                <Link className='btn btn-success' to="/create_category">Add new category</Link>
                            </div>
                        </div>

                        <div className='row'>
                            <Table bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Category Name</th>
                                        <th>Category Actions</th>
                                    </tr>
                                </thead>

                                {
                                    categories.map(
                                        (category) => (
                                            <Category name={category.name} key={category.id} {...category} onClick={() => { showModal(category.id) }} onDelete={() => { setCategoryId(category.id); setDeleteShow(true); }} />
                                        )
                                    )
                                }

                            </Table>

                        </div>
                        <Pagination>
                            <Pagination.First page={1} onClick={() => handlePagination(1)} />

                            {pages.map((page, key) => (
                                <Pagination.Item active={activePage === page} key={page} onClick={() => handlePagination(page)}>{page}</Pagination.Item>
                            ))}


                            <Pagination.Last onClick={() => handlePagination(lastPage)} />
                        </Pagination>
                    </div>
                </div>


                <Modal show={show} size='lg' onHide={() => setShow(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Update Category
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* Campo name oggetto category */}
                        <Form onSubmit={handleSubmit(updateCategory)}>
                            <Form.Group>
                                <Form.Label>Name</Form.Label>
                                <Form.Control className='mb-2' type='text' placheholder='Category name' {...register('name', { required: true, maxLength: 25 })} />
                            </Form.Group>

                            {errors.name && <p style={{ color: 'red' }}><small>Category name is required</small></p>}
                            {errors.name?.type === 'maxLength' && <p style={{ color: 'red' }}><small>Max characters should be 25</small> </p>}


                            <Form.Group>
                                <Button variant='primary' type='submit'>Update category</Button>
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
                        <Button variant="danger" onClick={deleteCategory}>Confirm delete</Button>
                    </Modal.Footer>

                </Modal>

            </div>
        </div >
    )
}







const LoggedOutHome = () => {
    return (
        <div className='users'>
            <h1>Categorie Non Loggato</h1>
            <Link className="btn btn-primary btn-lg btn-submit" to="/signup">Signup</Link>
        </div>
    )
}

const Categories = () => {

    const [logged] = useAuth()
    return (
        <div>
            {logged ? <LoggedInHome /> : <LoggedOutHome />}
        </div>
    )
}

export default Categories


