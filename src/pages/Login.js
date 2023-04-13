import React , { useState }from 'react';
import {
  MDBContainer,
  MDBInput,
  MDBBtn,
}
from 'mdb-react-ui-kit';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from "react-router-dom"

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

    try {
      await signInWithEmailAndPassword(auth, email, password);

      setSuccessfullLogin(true);
      setErr(false);

      setTimeout(() => {
        setSuccessfullLogin(false);
        navigate('/');

      }, 4000);
    } catch (error) {
      
      console.log(error);
      setErr(true);
      setLoading(false);

      setTimeout(() => {
        setErr(false);
      }, 3000);

    }

  }


  return (
    <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
      <h2 className='mb-5 text-center'>Login to manage your Expenses !</h2>

      <form onSubmit={handleSubmit}>
        <MDBInput wrapperClass='mb-4' label='Email address' id='form1' type='email'/>
        <MDBInput wrapperClass='mb-4' label='Password' id='form2' type='password'/>


        <button type="submit" className="btn btn-primary mb-2">Sign in</button>

        <br />
        {err && <span className='title text-danger' style={{fontSize:'1rem'}}>Wrong Credentials, Retry...</span>}
        {successfulLogin && <span className='title text-success' style={{fontSize:'1rem'}}>Successfull Login, Redirecting to Home Page ...</span>}

        <div className="text-center mt-2">
          <p>Not a member ? <a href="/user/register"> Register</a></p>
        </div>

      </form>

    </MDBContainer>
  );
}

export default App;