import React, { useEffect, useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../auth'

const CreateProduct = () => {

    const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY')

    const headers = {
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(token)}`
        }
    }


    const [categories, setCategories] = useState([])

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm()

    const navigate = useNavigate()

    const createProduct = async (data) => {

        try {
            await axios.post('http://127.0.0.1:5000/product/products', data, headers);
            reset()
            navigate('/home')
        } catch (err) {
            console.error('Failed to update product:', err);
        }


    }

    useEffect(
        () => {
            axios.get('http://127.0.0.1:5000/category/allcategories')
                .then(res => {
                    setCategories(res.data)
                })
                .catch(err => console.log(err))
        }, []
    )


    return (
        <div className='create-product container lm_main'>
            <div className='row justify-content-center align-items-center'>
                <div className='form lm_form'>
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
                        <Form.Control type="number" name="price" min="1" step=".01" {...register('price', { required: true })} />
                    </Form.Group>

                    {errors.price && <p style={{ color: 'red' }}><small>Price is required</small></p>}

                    {/* Campo stock oggetto product */}
                    <Form.Group>
                        <Form.Label>Stock</Form.Label>
                        <Form.Select placheholder='Product stock' {...register('stock', { required: true })} >
                            <option disabled>The product is in stock?</option>
                            <option value='1'>Yes</option>
                            <option value='0'>No</option>
                        </Form.Select>
                    </Form.Group>

                    {errors.stock && <p style={{ color: 'red' }}><small>Stock needs a value</small></p>}

                    {/* Campo category_id oggetto product */}
                    <Form.Group className='mb-2'>
                        <Form.Label>Category</Form.Label>
                        <Form.Select {...register('category_id', { required: true })} >
                            <option disabled>Select a category</option>
                            {
                                categories.map(
                                    (category, key) => (
                                        <option value={category.id}>{category.name}</option>
                                    )
                                )
                            }
                        </Form.Select>
                    </Form.Group>

                    {errors.category_id && <p style={{ color: 'red' }}><small>Category is required</small></p>}

                    <Form.Group>
                        <Button as='sub' variant='primary' onClick={handleSubmit(createProduct)}>Save new product</Button>
                    </Form.Group>
                </div>
            </div>
        </div >
    )
}

const LoggedOutHome = () => {
    return (
        <div className='products'>
            <div className='container-fluid lm_main'>
                <div className='row h-100 justify-content-center align-items-center'>
                    <h1 className='text-center'>Authentication Failed</h1>
                </div>
            </div>


        </div>
    )
}

const CreateProductAuthPage = () => {

    const [logged] = useAuth()
    return (
        <div>
            {logged ? <CreateProduct /> : <LoggedOutHome />}
        </div>
    )
}

export default CreateProductAuthPage