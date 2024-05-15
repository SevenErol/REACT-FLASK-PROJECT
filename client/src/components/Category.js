import Button from 'react-bootstrap/Button';



const Category = props => {
    return (
        <>
            <tbody>
                <tr>
                    <td>{props.id}</td>
                    <td>{props.name}</td>

                    <td>
                        <Button variant="warning me-2" onClick={props.onClick}>Edit</Button>
                        <Button variant="danger" onClick={props.onDelete}>Delete</Button>
                    </td>

                </tr>
            </tbody >
        </>

    )

}

export default Category