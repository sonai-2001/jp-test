import React from 'react';
import { Modal } from 'react-bootstrap';
// import SignUpBody from './SignUpBody';


function SignUpModel({ showSignUpModel, signUpModelClose }: { showSignUpModel: boolean, signUpModelClose: () => void }) {


    return (
        <Modal size='lg' centered show={showSignUpModel}>
            <Modal.Header className='border-0' closeButton onHide={() => { signUpModelClose() }
            }>
                <Modal.Title>Sign-Up</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* <SignUpBody  /> */}
            </Modal.Body>
        </Modal>
    );
}

export default SignUpModel;