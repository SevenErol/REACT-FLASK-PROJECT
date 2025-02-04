import Button from 'react-bootstrap/Button';
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Product = props => {

    const [category, setCategory] = useState('')

    const getCategoryName = async (category_id) => {

        try {

            if (category_id == null) {
                setCategory('Nessuna categoria')
            } else {

                const res = await axios.get(`http://127.0.0.1:5000/category/category/${category_id}`);
                setCategory(res.data.name)

            }

        } catch (err) {
            console.error('Failed to fetch category:', err);
        }
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
