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
    const [userId, setUserId] = useState(0)
    const [deleteShow, setDeleteShow] = useState(false);
    const [searchbar, setSearchbar] = useState('');
    const [activePage, setActivePage] = useState(1);
    const [pages, setPages] = useState([]);
    const [lastPage, setLastPage] = useState(1);

    const headers = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(token)}`,
        },
    };

    useEffect(
        () => {
            fetchUsers()
        }, []
    );

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:5000/user/users');
            setUsers(res.data.items);
            setPages(res.data.all_pages);
            setLastPage(res.data.last_page);
            setActivePage(1);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        }
    };

    const searchUsers = async () => {

        try {
            const res = await axios.post('http://127.0.0.1:5000/user/search', { input: searchbar }, headers);
            setUsers(res.data.items);
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

                const res = await axios.get(`http://127.0.0.1:5000/user/users?page=${page}`);
                setUsers(res.data.items);

            } else {
                const res = await axios.post(`http://127.0.0.1:5000/user/search?page=${page}`, { input: searchbar }, headers);
                setUsers(res.data.items);
                setPages(res.data.all_pages);
                setLastPage(res.data.last_page);
            }


        } catch (err) {
            console.error('Pagination failed:', err);
        }
    };

    const deleteUser = async () => {
        try {
            await axios.delete(`http://127.0.0.1:5000/user/user/${userId}`, headers);
            setDeleteShow(false);
            fetchUsers();
        } catch (err) {
            console.error('Failed to delete user:', err);
        }
    };

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

                    <div className='mb-3 p-2 text-center'>
                        <Link className="col-2 lm_menu_voice" to="/analytics">Analytics</Link>
                    </div>
                </div>
                <div className='col-10 h-100 lm_inner_menu'>
                    <div className='container p-2'>
                        <div className='row p-2 justify-content-between'>
                            <div className='col-2'>
                                <h1>Users</h1>
                            </div>
                            <Searchbar searchbar={searchbar} onChange={(e) => setSearchbar(e.target.value)} onClick={searchUsers} />
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
                                        (user, key) => (
                                            <User key={key} {...user} onDelete={() => { setUserId(user.id); setDeleteShow(true); }} />
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

                <Modal show={deleteShow} size='lg' onHide={() => setDeleteShow(false)}>

                    <Modal.Header closeButton>
                        <Modal.Title>Warning: Irreversible Action</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>Are you sure you want to proceed? This action is irreversible and cannot be undone. Take a moment to consider the consequences before confirming. Once initiated, all associated data and changes will be permanent. If you're certain about your decision, proceed cautiously.</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setDeleteShow(false)}>Close</Button>
                        <Button variant="danger" onClick={deleteUser}>Confirm delete</Button>
                    </Modal.Footer>

                </Modal>

            </div>
        </div >
    )
}



const LoggedOutHome = () => {
    return (
        <div className='users'>
            <h1>Utente Non Loggato</h1>
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


