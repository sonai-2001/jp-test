"use client"
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import SignInBody from './SignInBody';
import SignUpBody from '../SignUp/SignUpBody';

function SignInModel({ data, showModel, closeModel }: { data: string, showModel: boolean, closeModel: () => void }) {
    const [getData, setData] = useState(data);
    const [intervalTime, setIntervalTime] = useState<NodeJS.Timeout | null>(null);

    const changeData = (data: string) => {
        setData(data)
    }

    useEffect(() => {
        setData(data)
    }, [data])

    const handleClose = () => {
        if (intervalTime) {
            clearInterval(intervalTime);
        }
        closeModel();   
    };

    return (
        <Modal centered show={showModel} className="signInUp_modal">
            <Modal.Header className='border-0' closeButton onHide={handleClose}>
                <Modal.Title>{getData === "SignIn" ? 'Sign-In' : "Sign-Up"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    getData === "SignIn" ?
                        <SignInBody closeModel={closeModel} changeData={changeData} />
                        :
                        <SignUpBody
                            intervalTime={intervalTime}
                            setIntervalTime={setIntervalTime}
                            closeModel={handleClose}
                            changeData={changeData}
                        />
                }
            </Modal.Body>
        </Modal>
    );
}

export default SignInModel;
