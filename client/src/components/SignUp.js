import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Alert from 'react-bootstrap/Alert';

const SignUp = () => {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm()

    const [show, setShow] = useState(false);
    const [serverResponse, setServerResponse] = useState('')

    const submitForm = (data) => {

        if (data.password === data.confirmPassword) {

            const body = {
                'username': data.username,
                'email': data.email,
                'password': data.password
            }

            const requestData = {
                method: 'post',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(body)
            }

            fetch('/auth/signup', requestData)
                .then(res => res.json())
                .then(data => {
                    setServerResponse(data.message)
                    setShow(true)
                })
                .catch(err => console.log(err))

            reset()
        } else {
            alert('Passwords does not match')
        }


    }

    return (
        <div className='container'>
            <div className='row justify-content-center align-items-center'>
                <div className='form lm_form'>
                    {show ?
                        <>
                            <Alert variant={serverResponse.includes('already') ? 'danger' : 'success'} onClose={() => setShow(false)} dismissible>
                                <p>{serverResponse}</p>
                            </Alert>

                            <h1>Signup</h1>
                        </>
                        :
                        <h1>Signup</h1>
                    }

                    <form>
                        <Form.Group>
                            <Form.Label>Username</Form.Label>
                            <Form.Control type='text' placheholder='Your username' {...register('username', { required: true, maxLength: 25 })} />
                        </Form.Group>

                        {errors.username && <p style={{ color: 'red' }}><small>Username is required</small></p>}
                        {errors.username?.type === 'maxLength' && <p style={{ color: 'red' }}><small>Max characters should be 25</small> </p>}


                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type='email' placheholder='Your email' name='email' {...register('email', { required: true, maxLength: 80 })} />
                        </Form.Group>

                        {errors.email && <p style={{ color: 'red' }}><small>Email is required</small> </p>}
                        {errors.email?.type === 'maxLength' && <p style={{ color: 'red' }}><small>Max characters should be 80</small></p>}


                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type='password' placheholder='Your password' name='password' {...register('password', { required: true, minLength: 8 })} />
                        </Form.Group>

                        {errors.password && <p style={{ color: 'red' }}><small>Password is required</small></p>}
                        {errors.password?.type === 'minLength' && <p style={{ color: 'red' }}><small>Min characters should be 8</small></p>}


                        <Form.Group>
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control className='mb-2' type='password' placheholder='Confirm Your password' name='confirmPassword' {...register('confirmPassword', { required: true, minLength: 8 })} />
                        </Form.Group>

                        {errors.confirmPassword && <p style={{ color: 'red' }}><small>Confirm Password is required</small></p>}
                        {errors.confirmPassword?.type === 'minLength' && <p style={{ color: 'red' }}><small>Min characters should be 8</small></p>}

                        <Form.Group>
                            <Button className='mb-2' as='sub' variant='primary' onClick={handleSubmit(submitForm)}>Signup</Button>
                        </Form.Group>


                        <Form.Group>
                            <small>Already have an account? <Link to='/login'>Login</Link> </small>
                        </Form.Group>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignUp