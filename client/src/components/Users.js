import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth'
import User from './User'
import { Modal, Form, Button, Table } from 'react-bootstrap'
import { useForm } from 'react-hook-form'

const LoggedInHome = () => {


    const [users, setUsers] = useState([])
    const [show, setShow] = useState(false)
    const [userId, setUserId] = useState(0)

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm()



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


    useEffect(
        () => {
            getAllUsers()
        }, []
    )


    const closeModal = () => {
        setShow(false)
    }

    const showModal = (id) => {
        setShow(true)
        setUserId(id)

        users.map(
            (user, key) => {
                if (user.id === id) {
                    setValue('username', user.username)
                    setValue('email', user.email)
                    setValue('password', user.password)

                }
            }
        )
    }

    let token = localStorage.getItem('REACT_TOKEN_AUTH_KEY')

    const updateProduct = (data) => {

        console.log(data)
        console.log(token)

        const requestData = {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            },
            body: JSON.stringify(data)
        }

        fetch(`/user/user/${userId}`, requestData)
            .then(res => res.json)
            .then(data => {
                const reload = window.location.reload()
                reload()

            }
            )
            .catch(err => console.log(err))
    }

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
                        <Link className="col-2 lm_menu_voice" to="/create_product">Create Product</Link>
                    </div>

                    <div className='mb-3 p-2 text-center'>
                        <Link className="col-2 lm_menu_voice" to="/create_product">Create Product</Link>
                    </div>
                </div>
                <div className='col-10 h-100 lm_inner_menu'>
                    <div className='container p-2'>
                        <div className='row p-2 justify-content-between'>
                            <div className='col-2'>
                                <h1>Users</h1>
                            </div>
                            <div className='col-2'>

                            </div>
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
                                            <User key={key} {...product} onClick={() => { showModal(product.id) }} onDelete={() => { deleteUser(product.id) }} />
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
                            Update User
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* Campo name oggetto user */}
                        <Form.Group>
                            <Form.Label>Username</Form.Label>
                            <Form.Control type='text' placheholder='Product name' {...register('username', { required: true, maxLength: 25 })} />
                        </Form.Group>

                        {errors.username && <p style={{ color: 'red' }}><small>Username is required</small></p>}
                        {errors.name?.type === 'maxLength' && <p style={{ color: 'red' }}><small>Max characters should be 25</small> </p>}

                        {/* Campo email oggetto user */}
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type='text' {...register('email', { required: true, maxLength: 255 })} />
                        </Form.Group>

                        {errors.email && <p style={{ color: 'red' }}><small>Email is required</small></p>}

                        <Form.Group>
                            <Button as='sub' variant='primary'>Update user</Button>
                        </Form.Group>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
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


