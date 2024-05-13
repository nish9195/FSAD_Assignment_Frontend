import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Validation from './SignUpValidation'
import axios from 'axios';

function SignUp() {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: ''
    })

    const navigate = useNavigate();

    const [errors, setErrors] = useState({})
    
    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: [event.target.value]}))
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors(Validation(values));
        if(errors.name === "" && errors.email === "" && errors.password === "") {
            axios.post('http://localhost:8081/signup', values)
            .then(res => {
                alert("User Created Successfully. Transferring to Login!");
                navigate('/');
            })
            .catch(err => console.log(err));
        }
    }

  return (
    <div className='d-flex justify-content-center align-items-center bg-success vh-100'>
        <div className='bg-white p-3 rounded w-25'>
            <h2 className='text-center'>Sign Up</h2>
            <form action="" onSubmit={handleSubmit}>
                <div className='mb-3'>
                    <label htmlFor='name'><strong>Name</strong></label>
                    <input type='text' placeholder='Enter Name' onChange={handleInput} 
                    name='name' className='form-control rounded-0'></input>
                    {errors.name && <span className='text-danger'>{errors.name}</span>}
                </div>
                <div className='mb-3'>
                    <label htmlFor='email'><strong>Email</strong></label>
                    <input type='email' placeholder='Enter Email Address' onChange={handleInput} 
                    name='email' className='form-control rounded-0'></input>
                    {errors.email && <span className='text-danger'>{errors.email}</span>}
                </div>
                <div className='mb-3'>
                    <label htmlFor='password'><strong>Password</strong></label>
                    <input type='password' placeholder='Enter Password' onChange={handleInput} 
                    name='password' className='form-control rounded-0'></input>
                    {errors.password && <span className='text-danger'>{errors.password}</span>}
                </div>
                <button type='submit' className='btn btn-success w-100 rounded-0'>Sign Up</button>
                <p></p>
                <Link to="/" className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'>Already have an Account? Login</Link>
            </form>
        </div>
    </div>
  )
}

export default SignUp