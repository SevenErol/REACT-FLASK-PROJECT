import { Card, Table } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';


const Product = props => {
    return (
        <>
            <tbody>
                <tr>
                    <td >{props.id}</td>
                    <td>{props.name}</td>
                    <td>{props.description}</td>
                    <td>{props.price}</td>
                    <td>{props.stock}</td>
                    <td>{props.category_id}</td>
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