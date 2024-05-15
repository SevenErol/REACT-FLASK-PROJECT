import Button from 'react-bootstrap/Button';



const User = props => {

    const truncate = (str, maxlength) => {
        return (str.length > maxlength) ?
            str.slice(0, maxlength - 1) + '…' : str;
    }
    return (
        <>
            <tbody>
                <tr>
                    <td>{props.id}</td>
                    <td>{props.username}</td>
                    <td>{props.email}</td>
                    <td>{truncate(props.password, 25)}</td>
                    <td>
                        <Button variant="danger" onClick={props.onDelete}>Delete</Button>
                    </td>

                </tr>
            </tbody >
        </>

    )

}

export default User