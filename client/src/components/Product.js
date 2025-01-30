import Button from 'react-bootstrap/Button';
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Product = props => {

    const [category, setCategory] = useState('')

    const getCategoryName = (category_id) => {
        return (
            axios.get(`http://127.0.0.1:5000/category/category/${category_id}`)
                .then(res => {
                    setCategory(res.data.name)
                })
                .catch(err => console.log(err))
        )
    }

    useEffect(
        () => {
            getCategoryName(props.category_id)
        }, [props.category_id]  // Adding dependency on props.category_id to refetch when it changes.
    )

    return (
        <>
            <tbody>
                <tr>
                    <td>{props.id}</td>
                    <td>{props.name}</td>
                    <td>{props.description}</td>
                    <td>{props.price}</td>
                    <td>
                        <div className={props.stock === 1 ? 'dot_success' : 'dot_danger'}></div>
                    </td>
                    <td>{category}</td> {/* Using the 'category' state variable here */}
                    <td>
                        <Button variant="warning me-2" onClick={props.onClick}>Edit</Button>
                        <Button variant="danger" onClick={props.onDelete}>Delete</Button>
                    </td>
                </tr>
            </tbody>
        </>
    )
}

export default Product
