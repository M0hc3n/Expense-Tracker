import React , { useState }from 'react';
import {
  MDBContainer,
  MDBInput,
  MDBBtn,
}
from 'mdb-react-ui-kit';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from "react-router-dom"

import { auth } from '../database/firebase'

function App() {

  const [ err , setErr ] = useState(false);
  const [successfulLogin , setSuccessfullLogin ] = useState(false);
  const [ loading , setLoading ] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;

    console.log({
      email, 
      password
    });

    try {
      await signInWithEmailAndPassword(auth, email, password);

      setSuccessfullLogin(true);
      setErr(false);

      setInterval(() => {
        setSuccessfullLogin(false);
        navigate('/');

      }, 4000);
    } catch (error) {
      
      console.log(error);
      setErr(true);
      setLoading(false);

      setInterval(() => {
        setErr(false);
      }, 3000);

    }

    console.log('done done london');
  }


  return (
    <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
      <h2 className='mb-5 text-center'>Login to view your Expenses !</h2>

      <form onSubmit={handleSubmit}>
        <MDBInput wrapperClass='mb-4' label='Email address' id='form1' type='email'/>
        <MDBInput wrapperClass='mb-4' label='Password' id='form2' type='password'/>

        <MDBBtn className="mb-4">Sign in</MDBBtn>

        
        {err && <span className='title' style={{color: 'red',fontSize:'1rem'}}>Wrong Credentials, retry...</span>}
        {successfulLogin && <span className='title' style={{color: 'green', fontSize:'1rem'}}>redirecting to home page ...</span>}

        <div className="text-center">
          <p>Not a member ? <a href="/user/register"> Register</a></p>
        </div>

      </form>

    </MDBContainer>
  );
}

export default App;