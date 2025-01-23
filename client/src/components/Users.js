import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth'
import User from './User'
import { Modal, Button, Table } from 'react-bootstrap'
import Searchbar from './Searchbar'
import axios from 'axios'
import Pagination from 'react-bootstrap/Pagination';

const LoggedInHome = () => {

    let token = localStorage.getItem('REACT_TOKEN_AUTH_KEY')

    const [users, setUsers] = useState([])
    const [pages, setPage] = useState([])
    const [total, setTotal] = useState(2)
    const [lastPage, setLastPage] = useState(1)
    const [deleteshow, setDeleteShow] = useState(false)
    const [userId, setUserId] = useState(0)
    const [searchbar, setSearchbar] = useState('')
    const [page, setCurrentpage] = useState(1)
    const [active, setActive] = useState(1)


    const inputChangeHandler = (e) => {
        const inputValue = e.target.value
        setSearchbar(inputValue)
    }

    const getAllUsers = () => {
        return (
            axios.get('http://127.0.0.1:5000/user/users')
                .then(res => {

                    setUsers(res.data.items)
                })
                .catch(err => console.log(err))
        )
    }

    const pagedUsers = (page) => {
        return (

            axios.get('http://127.0.0.1:5000/user/users?page=' + page.toString())
                .then(res => {
                    setUsers(res.data.items)
                })
                .catch(err => console.log(err))
        )
    }

    const getPagedUsers = (page) => {
        return (
            setCurrentpage(page),
            pagedUsers(page),
            setActive(page)
        )
    }

    const getPages = () => {
        return (
            axios.get('http://127.0.0.1:5000/user/users')
                .then(res => {
                    setPage(res.data.all_pages)
                })
                .catch(err => console.log(err))
        )
    }

    const getTotal = () => {
        return (
            axios.get('http://127.0.0.1:5000/user/users')
                .then(res => {
                    setTotal(res.data.total)
                })
                .catch(err => console.log(err))
        )
    }

    const getLastPage = () => {
        return (
            axios.get('http://127.0.0.1:5000/user/users')
                .then(res => {
                    setLastPage(res.data.last_page)
                })
                .catch(err => console.log(err))
        )
    }

    const filteredUsers = (search) => {

        const object = {
            "input": search
        }

        const headers = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            }
        }

        axios.post('http://127.0.0.1:5000/user/search', object, headers)
            .then((response) => {
                setUsers(response.data);
            })
            .catch((error) => {
                console.error(error);
            });

    }

    const getAllUsersSearch = () => {
        return (
            filteredUsers(searchbar),
            setSearchbar('')
        )
    }

    useEffect(
        () => {
            getAllUsers()
            getPages()
            getTotal()
            getLastPage()
        }, []
    )

    const closeModalDelete = () => {
        setDeleteShow(false)
    }

    const deleteModal = (id) => {
        setDeleteShow(true)
        setUserId(id)
    }

    const deleteUser = (id) => {


        const headers = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            }
        }

        axios.delete(`http://127.0.0.1:5000/user/user/${id}`, headers)
            .then(res => res.json)
            .then(data => {
                getAllUsers()
                setDeleteShow(false)
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
                        <Link className="col-2 lm_menu_voice" to="/home">All products</Link>
                    </div>

                    <div className='mb-3 p-2 text-center'>
                        <Link className="col-2 lm_menu_voice" to="/categories">All categories</Link>
                    </div>
                </div>
                <div className='col-10 h-100 lm_inner_menu'>
                    <div className='container p-2'>
                        <div className='row p-2 justify-content-between'>
                            <div className='col-2'>
                                <h1>Users</h1>
                            </div>
                            <Searchbar searchbar={searchbar} onChange={inputChangeHandler} onClick={getAllUsersSearch} />
                        </div>

                        <div className='row'>
                            <Table bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>User Name</th>
                                        <th>User Email</th>
                                        <th>User Password</th>
                                        <th>User Actions</th>
                                    </tr>
                                </thead>

                                {
                                    users.map(
                                        (product, key) => (
                                            <User key={key} {...product} onDelete={() => { deleteModal(product.id) }} />
                                        )
                                    )
                                }

                            </Table>

                        </div>
                        <Pagination>
                            <Pagination.First page={1} onClick={() => getPagedUsers(1)} />

                            {pages.map((page, key) => (
                                <Pagination.Item active={active === page} page={page} onClick={() => getPagedUsers(page)}>{page}</Pagination.Item>
                            ))}


                            <Pagination.Last page={lastPage} onClick={() => getPagedUsers(lastPage)} />
                        </Pagination>
                    </div>
                </div>

                <Modal show={deleteshow} size='lg' onHide={closeModalDelete}>

                    <Modal.Header closeButton>
                        <Modal.Title>Warning: Irreversible Action</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>Are you sure you want to proceed? This action is irreversible and cannot be undone. Take a moment to consider the consequences before confirming. Once initiated, all associated data and changes will be permanent. If you're certain about your decision, proceed cautiously.</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeModalDelete}>Close</Button>
                        <Button variant="danger" onClick={() => { deleteUser(userId) }}>Confirm delete</Button>
                    </Modal.Footer>

                </Modal>

            </div>
        </div >
    )
}



const LoggedOutHome = () => {
    return (
        <div className='users'>
            <h1>Utenti Non Loggato</h1>
            <Link className="btn btn-primary btn-lg btn-submit" to="/signup">Signup</Link>
        </div>
    )
}

const Users = () => {

    const [logged] = useAuth()
    return (
        <div>
            {logged ? <LoggedInHome /> : <LoggedOutHome />}
        </div>
    )
}

export default Users


