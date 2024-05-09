import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Login = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const loginUser = () => {
        console.log('User logged in')
        setUsername('')
        setPassword('')
    }

    return (
        <div className='container'>
            <div className='form'>
                <h1>Login</h1>
                <form>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control type='text' placheholder='Your username' value={username} name='username' onChange={(element) => { setUsername(element.target.value) }} />
                    </Form.Group>
                    <br></br>

                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password' placheholder='Your password' value={password} name='password' onChange={(element) => { setPassword(element.target.value) }} />
                    </Form.Group>
                    <br></br>

                    <Form.Group>
                        <Button as='sub' variant='primary' onClick={loginUser}>Login</Button>
                    </Form.Group>
                    <br></br>

                    <Form.Group>
                        <small>Do not have an account? <Link to='/signup'>Create one</Link> </small>
                    </Form.Group>
                </form>
            </div>
        </div>
    )
}

export default Login