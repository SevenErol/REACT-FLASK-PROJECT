import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth, logout } from '../auth'

const LoggedInLinks = () => {
    return (
        <>
            <Link className="nav-link active" to="/home">Home</Link>
            <a className="nav-link active" href='#' onClick={() => { logout() }}>Logout</a>
            <Link className="nav-link active" to="/create_product">Create Product</Link>
        </>
    )
}

const LoggedOutLinks = () => {
    return (
        <>
            <Link className="nav-link active" to="/signup">Signup</Link>
            <Link className="nav-link active" to="/login">Login</Link>
        </>
    )
}

const Navbar = () => {

    const [logged] = useAuth()

    return [
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">Products</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        {logged ? <LoggedInLinks /> : <LoggedOutLinks />}
                    </div>
                </div>
            </div>
        </nav>
    ]
}

export default Navbar