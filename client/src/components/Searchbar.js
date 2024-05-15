import { Form, Button, Row, Col } from 'react-bootstrap';

const Searchbar = props => {
    return (
        <div className='col-4'>
            <Form>
                <Row className='p-2'>

                    <Col xs="auto">
                        <Form.Control type="text"
                            placeholder='Search'
                            className=" mr-sm-2" value={props.searchbar} onChange={props.onChange}>

                        </Form.Control>
                    </Col>
                    <Col xs="auto">
                        <Button variant='primary' onClick={props.onClick}>Search</Button>
                    </Col>
                </Row>
            </Form>

        </div>
    )
}

export default Searchbar