import React from 'react'
import { Form, Button } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../auth'

const CreateCategory = () => {

    const navigate = useNavigate()
    const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');

    const headers = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(token)}`,
        },
    };

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm()


    const createCategory = async (data) => {
        try {
            await axios.post('http://127.0.0.1:5000//category/categories', data, headers);
            reset()
            navigate('/categories')
        } catch (err) {
            console.error('Failed to update product:', err);
        }
    };


    return (
        <div className='create-category container lm_main'>
            <div className='row justify-content-center align-items-center'>
                <div className='form lm_form'>
                    <h1>Create category</h1>

                    {/* Campo name oggetto category */}
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control className='mb-2' type='text' placheholder='Category name' {...register('name', { required: true, maxLength: 25 })} />
                    </Form.Group>

                    {errors.name && <p style={{ color: 'red' }}><small>Name is required</small></p>}
                    {errors.name?.type === 'maxLength' && <p style={{ color: 'red' }}><small>Max characters should be 25</small> </p>}

                    <Form.Group>
                        <Button as='sub' variant='primary' onClick={handleSubmit(createCategory)}>Save new category</Button>
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

const CreateCategoryAuthPage = () => {

    const [logged] = useAuth()
    return (
        <div>
            {logged ? <CreateCategory /> : <LoggedOutHome />}
        </div>
    )
}

export default CreateCategoryAuthPage