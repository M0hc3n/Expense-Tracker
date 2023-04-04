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
    <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
      <h2 className='mb-5 text-center'>Expense Tracker Application</h2>

      <MDBInput wrapperClass='mb-4' label='Email address' id='form1' type='email'/>
      <MDBInput wrapperClass='mb-4' label='Password' id='form2' type='password'/>

      <MDBBtn className="mb-4">Sign in</MDBBtn>

      <div className="text-center">
        <p>Not a member ? <a href="/user/register"> Register</a></p>
      </div>

    </MDBContainer>
  );
}

export default App;