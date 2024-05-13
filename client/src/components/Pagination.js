import React from 'react'
import { Link } from 'react-router-dom'

const Pagination = (usersPerPage, users, paginate) => {

    const pageNumbers = []

    for (let i = 1; i <= Math.ceil(usersPerPage.users / usersPerPage.usersPerPage); i++) {
        pageNumbers.push(i)
    }

    return (
        <div>
            <nav>
                <ul>
                    {
                        pageNumbers.map(number => (
                            <li key={number} className='page-item'>
                                <Link className='page-link' onClick={() => usersPerPage.paginate(number)}>{number}</Link>
                            </li>
                        ))
                    }
                </ul>
            </nav>

        </div>
    )
}

export default Pagination