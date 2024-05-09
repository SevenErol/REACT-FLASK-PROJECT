import React from 'react'
import { Link } from 'react-router-dom'

const HomePage = () => {
    return (
        <div className='home container'>
            <h1>Home page</h1>
            <Link className="btn btn-primary btn-lg btn-submit" to="/signup">Signup</Link>
        </div>
    )
}

export default HomePage