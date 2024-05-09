import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'

const SignUp = () => {

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors }
    } = useForm()


    const submitForm = (data) => {
        console.log(data)
        reset()
    }

    return (
        <div className='container'>
            <div className='form'>
                <h1>Signup</h1>
                <form>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control type='text' placheholder='Your username' {...register('username', { required: true, maxLength: 25 })} />
                    </Form.Group>
                    {errors.username && <small style={{ color: 'red' }}>Username is required</small>}
                    <br></br>
                    {errors.username?.type === 'maxLength' && <small style={{ color: 'red' }}>Max characters should be 25</small>}
                    <br></br>

                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type='email' placheholder='Your email' name='email' {...register('email', { required: true, maxLength: 80 })} />
                    </Form.Group>
                    {errors.email && <small style={{ color: 'red' }}>Email is required</small>}
                    <br></br>
                    {errors.email?.type === 'maxLength' && <small style={{ color: 'red' }}>Max characters should be 80</small>}
                    <br></br>

                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password' placheholder='Your password' name='password' {...register('password', { required: true, minLength: 8 })} />
                    </Form.Group>
                    {errors.password && <small style={{ color: 'red' }}>Password is required</small>}
                    <br></br>
                    {errors.password?.type === 'minLength' && <small style={{ color: 'red' }}>Min characters should be 8</small>}
                    <br></br>

                    <Form.Group>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type='password' placheholder='Confirm Your password' name='confirmPassword' {...register('confirmPassword', { required: true, minLength: 8 })} />
                    </Form.Group>
                    {errors.confirmPassword && <small style={{ color: 'red' }}>Confirm Password is required</small>}
                    <br></br>
                    {errors.confirmPassword?.type === 'minLength' && <small style={{ color: 'red' }}>Min characters should be 25</small>}
                    <br></br>

                    <Form.Group>
                        <Button as='sub' variant='primary' onClick={handleSubmit(submitForm)}>Signup</Button>
                    </Form.Group>
                    <br></br>

                    <Form.Group>
                        <small>Already have an account? <Link to='/login'>Login</Link> </small>
                    </Form.Group>
                </form>
            </div>
        </div>
    )
}

export default SignUp