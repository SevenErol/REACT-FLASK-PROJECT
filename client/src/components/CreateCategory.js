import React from 'react'
import { Form, Button } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

const CreateCategory = () => {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm()

    const navigate = useNavigate()

    const createCategory = (data) => {
        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY')

        const requestData = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            },
            body: JSON.stringify(data)
        }



        fetch('/category/categories', requestData)
            .then(res => res.json)
            .then(data => {
                reset()
                navigate('/categories')
            }
            )
            .catch(err => console.log(err))


    }


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

export default CreateCategory