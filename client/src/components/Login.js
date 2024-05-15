import React from 'react'
import { Form, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { login } from '../auth'


const Login = () => {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm()

    const navigate = useNavigate()

    // const [username, setUsername] = useState('')
    // const [password, setPassword] = useState('')

    const loginUser = (data) => {

        const requestData = {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        }

        fetch('/auth/login', requestData)
            .then(res => res.json())
            .then(data => {
                login(data.access_token)
                navigate('/home')

            })
            .catch(err => console.log(err))

        reset()
    }

    return (
        <div className='container lm_main'>
            <div className='row justify-content-center align-items-center'>
                <div className='form lm_form'>
                    <h1>Login</h1>
                    <form>
                        <Form.Group>
                            <Form.Label>Username</Form.Label>
                            <Form.Control type='text' placheholder='Your username' {...register('username', { required: true, maxLength: 25 })} />
                        </Form.Group>

                        {errors.username && <p style={{ color: 'red' }}><small>Username is required</small></p>}
                        {errors.username?.type === 'maxLength' && <p style={{ color: 'red' }}><small>Max characters should be 25</small> </p>}

                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control className='mb-2' type='password' placheholder='Your password' {...register('password', { required: true, minLength: 8 })} />
                        </Form.Group>

                        {errors.password && <p style={{ color: 'red' }}><small>Password is required</small></p>}
                        {errors.password?.type === 'minLength' && <p style={{ color: 'red' }}><small>Min characters should be 8</small></p>}

                        <Form.Group>
                            <Button className='mb-2' as='sub' variant='primary' onClick={handleSubmit(loginUser)}>Login</Button>
                        </Form.Group>

                        <Form.Group>
                            <small>Do not have an account? <Link to='/signup'>Create one</Link> </small>
                        </Form.Group>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login