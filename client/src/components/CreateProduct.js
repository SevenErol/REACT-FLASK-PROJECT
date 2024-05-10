import React from 'react'
import { Form, Button } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

const CreateProduct = () => {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm()

    const navigate = useNavigate()

    const createProduct = (data) => {
        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY')

        const requestData = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            },
            body: JSON.stringify(data)
        }



        fetch('/product/products', requestData)
            .then(res => res.json)
            .then(data =>
                console.log(data),
                navigate('/home')
            )
            .catch(err => console.log(err))

        reset()
    }


    return (
        <div className='create-product'>
            <h1>Create product</h1>

            {/* Campo name oggetto product */}
            <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control type='text' placheholder='Product name' {...register('name', { required: true, maxLength: 25 })} />
            </Form.Group>

            {errors.name && <p style={{ color: 'red' }}><small>Name is required</small></p>}
            {errors.name?.type === 'maxLength' && <p style={{ color: 'red' }}><small>Max characters should be 25</small> </p>}

            {/* Campo description oggetto product */}
            <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control as='textarea' rows={5} placheholder='Product description' {...register('description', { required: true, maxLength: 255 })} />
            </Form.Group>

            {errors.description && <p style={{ color: 'red' }}><small>Description is required</small></p>}
            {errors.description?.type === 'maxLength' && <p style={{ color: 'red' }}><small>Description should be less than 255 characters</small> </p>}

            {/* Campo price oggetto product */}
            <Form.Group>
                <Form.Label>Price</Form.Label>
                <Form.Control type="number" min="1" step="any" placheholder='Product price' {...register('price', { required: true })} />
            </Form.Group>

            {errors.price && <p style={{ color: 'red' }}><small>Price is required</small></p>}

            {/* Campo stock oggetto product */}
            <Form.Group>
                <Form.Label>Stock</Form.Label>
                <Form.Select placheholder='Product stock' {...register('stock', { required: true })} >
                    <option value="" disabled selected>The product is in stock?</option>
                    <option value='1'>Yes</option>
                    <option value='0'>No</option>
                </Form.Select>
            </Form.Group>

            {errors.stock && <p style={{ color: 'red' }}><small>Stock needs a value</small></p>}

            {/* Campo category_id oggetto product */}
            <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Select placheholder='Product stock' {...register('category_id', { required: true })} >
                    <option value="" disabled selected>Select a category</option>
                    <option value='1'>Yes</option>
                    <option value='0'>No</option>
                </Form.Select>
            </Form.Group>

            {errors.category_id && <p style={{ color: 'red' }}><small>Category is required</small></p>}

            <Form.Group>
                <Button as='sub' variant='primary' onClick={handleSubmit(createProduct)}>Save new product</Button>
            </Form.Group>
        </div>
    )
}

export default CreateProduct