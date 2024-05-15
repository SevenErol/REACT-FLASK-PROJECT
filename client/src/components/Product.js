import Button from 'react-bootstrap/Button';
import React, { useEffect, useState } from 'react'


const Product = props => {

    const [categories, setCategories] = useState([])

    useEffect(
        () => {
            if (props.category_id !== null) {
                fetch(`/category/category/${props.category_id}`)
                    .then(res => res.json())
                    .then(data => {
                        setCategories(data)
                    })
                    .catch(err => console.log(err))
            } else {
                setCategories({ 'name': 'Nessuna categoria' })
            }
        }, []
    )


    return (
        <>
            <tbody>
                <tr>
                    <td >{props.id}</td>
                    <td>{props.name}</td>
                    <td>{props.description}</td>
                    <td>{props.price}</td>
                    <td>
                        <div className={props.stock === 1 ? 'dot_success' : 'dot_danger'}></div>
                    </td>
                    <td>{categories.name}</td>
                    <td>
                        <Button variant="warning me-2" onClick={props.onClick}>Edit</Button>
                        <Button variant="danger" onClick={props.onDelete}>Delete</Button>
                    </td>

                </tr>
            </tbody >
        </>

    )

}

export default Product