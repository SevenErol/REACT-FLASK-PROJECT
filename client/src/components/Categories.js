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

    let token = localStorage.getItem('REACT_TOKEN_AUTH_KEY')

    const [categories, setCategories] = useState([])
    const [show, setShow] = useState(false)
    const [deleteshow, setDeleteShow] = useState(false)
    const [categoryId, setCategoryId] = useState(0)
    const [searchbar, setSearchbar] = useState('')

    const [pages, setPage] = useState([])
    const [active, setActive] = useState(1)
    const [page, setCurrentpage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [total, setTotal] = useState(2)


    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors }
    } = useForm()

    const inputChangeHandler = (e) => {
        const inputValue = e.target.value
        setSearchbar(inputValue)
    }

    const getAllCategories = () => {
        return (
            axios.get('http://127.0.0.1:5000/category/categories')
                .then(res => {
                    setCategories(res.data.items)
                })
                .catch(err => console.log(err))
        )
    }

    const filteredCategories = (search) => {

        const object = {
            "input": search
        }

        const headers = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            }
        }

        axios
            .post('http://127.0.0.1:5000/category/search', object, headers)
            .then((response) => {
                setCategories(response.data.items);
            })
            .catch((error) => {
                console.error(error);
            });

    }

    const getAllCategoriesSearch = () => {
        return (
            filteredCategories(searchbar),
            setSearchbar('')
        )
    }

    const pagedCategories = (page) => {
        return (

            axios.get('http://127.0.0.1:5000/category/categories?page=' + page.toString())
                .then(res => {
                    setCategories(res.data.items)
                })
                .catch(err => console.log(err))
        )
    }

    const getPagedCategories = (page) => {
        return (
            setCurrentpage(page),
            pagedCategories(page),
            setActive(page)
        )
    }

    const getPages = () => {
        return (
            axios.get('http://127.0.0.1:5000/category/categories')
                .then(res => {
                    setPage(res.data.all_pages)
                })
                .catch(err => console.log(err))
        )
    }

    const getTotal = () => {
        return (
            axios.get('http://127.0.0.1:5000/category/categories')
                .then(res => {
                    setTotal(res.data.total)
                })
                .catch(err => console.log(err))
        )
    }

    const getLastPage = () => {
        return (
            axios.get('http://127.0.0.1:5000/category/categories')
                .then(res => {
                    setLastPage(res.data.last_page)
                })
                .catch(err => console.log(err))
        )
    }

    useEffect(
        () => {
            getAllCategories()
            getPages()
            getTotal()
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
        setCategoryId(id)
    }

    const showModal = (id) => {
        setShow(true)
        setCategoryId(id)

        categories.map(
            (category, key) => {
                if (category.id === id) {
                    setValue('name', category.name)

                }
            }
        )
    }


    const updateCategory = (data) => {

        const headers = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            }
        }

        axios.put(`http://127.0.0.1:5000/category/category/${categoryId}`, data, headers)
            .then(res => res.json)
            .then(data => {
                const reload = window.location.reload()
                reload()

            }
            )
            .catch(err => console.log(err))
    }

    const deleteCategory = (id) => {


        const headers = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            }
        }

        axios.delete(`http://127.0.0.1:5000/category/category/${id}`, headers)
            .then(res => res.json)
            .then(data => {
                getAllCategories()
                setDeleteShow(false)
            }
            )
            .catch(err => console.log(err))
    }



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
                            <Searchbar searchbar={searchbar} onChange={inputChangeHandler} onClick={getAllCategoriesSearch} />
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
                                        (category, key) => (
                                            <Category key={key} {...category} onClick={() => { showModal(category.id) }} onDelete={() => { deleteModal(category.id) }} />
                                        )
                                    )
                                }

                            </Table>

                        </div>
                        <Pagination>
                            <Pagination.First page={1} onClick={() => getPagedCategories(1)} />

                            {pages.map((page, key) => (
                                <Pagination.Item active={active === page} page={page} onClick={() => getPagedCategories(page)}>{page}</Pagination.Item>
                            ))}


                            <Pagination.Last page={lastPage} onClick={() => getPagedCategories(lastPage)} />
                        </Pagination>
                    </div>
                </div>


                <Modal show={show} size='lg' onHide={closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Update Category
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* Campo name oggetto category */}
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control className='mb-2' type='text' placheholder='Category name' {...register('name', { required: true, maxLength: 25 })} />
                        </Form.Group>

                        {errors.name && <p style={{ color: 'red' }}><small>Category name is required</small></p>}
                        {errors.name?.type === 'maxLength' && <p style={{ color: 'red' }}><small>Max characters should be 25</small> </p>}


                        <Form.Group>
                            <Button as='sub' variant='primary' onClick={handleSubmit(updateCategory)}>Update category</Button>
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
                        <Button variant="danger" onClick={() => { deleteCategory(categoryId) }}>Confirm delete</Button>
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


