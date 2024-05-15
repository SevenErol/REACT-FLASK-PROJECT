import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth, logout } from '../auth'


const LoggedInLinks = () => {
    return (
        <>
            <Link key='1' className="nav-link active" to="/home">Home</Link>
            <Link key='2' className="nav-link active" to="/login" onClick={() => { logout() }}>Logout</Link>
            {/* <Link className="nav-link active" to="/create_product">Create Product</Link> */}
        </>
    )
}

const LoggedOutLinks = () => {
    return (
        <>
            <Link key='3' className="nav-link active" to="/signup">Signup</Link>
            <Link key='4' className="nav-link active" to="/login">Login</Link>
        </>
    )
}

const Navbar = () => {

    const [logged] = useAuth()

    return [
        <nav className="navbar navbar-expand-lg navbar-light shadow-sm lm_header justify-content-between">

            <div className='col-2 ms-3'>
                <Link key='5' className="navbar-brand me-auto" to='/home'>E-commerce back office</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
            </div>
            <div className='col-2'>
                <div className="collapse navbar-collapse justify-content-center" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        {logged ? <LoggedInLinks /> : <LoggedOutLinks />}
                    </div>
                </div>
            </div>
        </nav>
    ]
}

export default Navbar