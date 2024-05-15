import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth'
import User from './User'
import { Modal, Button, Table } from 'react-bootstrap'
import Searchbar from './Searchbar'

const LoggedInHome = () => {


    const [users, setUsers] = useState([])
    const [deleteshow, setDeleteShow] = useState(false)
    const [userId, setUserId] = useState(0)
    const [searchbar, setSearchbar] = useState('')


    const inputChangeHandler = (e) => {
        const inputValue = e.target.value
        setSearchbar(inputValue)
    }

    const getAllUsers = () => {
        return (
            fetch('/user/users')
                .then(res => res.json())
                .then(data => {
                    setUsers(data)
                })
                .catch(err => console.log(err))
        )
    }

    const filteredUsers = (search) => {

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

        fetch('/user/search', requestData)
            .then(res => res.json())
            .then(data => {
                setUsers(data)
            })
            .catch(err => console.log(err))

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
        }, []
    )



    const closeModalDelete = () => {
        setDeleteShow(false)
    }

    const deleteModal = (id) => {
        setDeleteShow(true)
        setUserId(id)
    }


    let token = localStorage.getItem('REACT_TOKEN_AUTH_KEY')

    const deleteUser = (id) => {


        const requestData = {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            }
        }

        fetch(`/user/user/${id}`, requestData)
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


