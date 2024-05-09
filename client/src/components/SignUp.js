import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const SignUp = () => {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const submitForm = () => {
        console.log('Form submitted')
        setUsername('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
    }
    return (
        <div className='container'>
            <div className='form'>
                <h1>Signup</h1>
                <form>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control type='text' placheholder='Your username' value={username} name='username' onChange={(element) => { setUsername(element.target.value) }} />
                    </Form.Group>
                    <br></br>

                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type='email' placheholder='Your email' value={email} name='email' onChange={(element) => { setEmail(element.target.value) }} />
                    </Form.Group>
                    <br></br>

                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password' placheholder='Your password' value={password} name='password' onChange={(element) => { setPassword(element.target.value) }} />
                    </Form.Group>
                    <br></br>

                    <Form.Group>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type='password' placheholder='Confirm Your password' value={confirmPassword} name='confirmPassword' onChange={(element) => { setConfirmPassword(element.target.value) }} />
                    </Form.Group>
                    <br></br>

                    <Form.Group>
                        <Button as='sub' variant='primary' onClick={submitForm}>Signup</Button>
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