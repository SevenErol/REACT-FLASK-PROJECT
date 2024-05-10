import { Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';


const Product = props => {
    return (
        <div className="col-4">
            < Card className="text-center" >
                <Card.Header>Prodotto</Card.Header>
                <Card.Body>
                    <Card.Title>{props.name}</Card.Title>
                    <Card.Text>
                        {props.description}
                    </Card.Text>
                    <Card.Text>
                        {props.price}
                    </Card.Text>
                    <Card.Text>
                        {props.stock}
                    </Card.Text>
                    <Card.Text>
                        {props.category_id}
                    </Card.Text>
                    <Button variant="primary" onClick={props.onClick}>Update</Button>
                </Card.Body>
                <Card.Footer className="text-muted">2 days ago</Card.Footer>
            </Card >

        </div>
    )

}

export default Product