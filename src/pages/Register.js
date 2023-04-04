import React from 'react';
import {
  MDBContainer,
  MDBInput,
  MDBCheckbox,
  MDBBtn,
  MDBIcon
}
from 'mdb-react-ui-kit';

function App() {
  return (
    <MDBContainer className="p-3 my-2 d-flex flex-column w-50">
      <h2 className='mb-5 text-center'>Join Us !</h2>

      <MDBInput wrapperClass='mb-4' label='First Name' id='form-first-name' type='text'/>
      
      <MDBInput wrapperClass='mb-4' label='Name' id='form-last-name' type='text'/>
      
      <MDBInput wrapperClass='mb-4' label='User Name' id='form-user-name' type='text'/>
    
      <MDBInput wrapperClass='mb-4' label='Email address' id='form-email' type='email'/>
      <MDBInput wrapperClass='mb-4' label='Password' id='form-pass' type='password'/>

      <MDBInput wrapperClass='mb-4' label='Country' id='form-country' type='text'/>

      <MDBInput wrapperClass='mb-4' label='Country' id='form-city' type='text'/>


      <MDBBtn className="mb-4">Sign up</MDBBtn>

      <div className="text-center">
        <p>Already have an account ? <a href="/user/login"> Login</a></p>
      </div>

    </MDBContainer>
  );
}

export default App;