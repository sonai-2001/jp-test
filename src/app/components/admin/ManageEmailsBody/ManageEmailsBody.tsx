//src\app\(screens)\my-enquiry\[id]\page.tsx
"use client"
import { createManageEmails, updateManageEmails, getManageEmails } from '@/app/services/manageEmails/ManageEmails';
import { increment } from '@/app/services/redux/features/counterSlice';
import React, { useEffect } from 'react'
import { Button, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

function ManageEmailsBody() {
    const dispatch = useDispatch();
    const counter = useSelector((state: any) => state.counter?.value);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<any>();

    const onSubmit = async (data: any) => {
        try {
            const response = data._id ? await updateManageEmails(data._id, data) : await createManageEmails(data);
            if (response) {
                dispatch(increment());
            }
        } catch (error) {
            console.error("Error in POST /api/ManageEmail:", error);
        }
    };

    const getManageEmail = async () => {
        try {
            const data = await getManageEmails();
            reset(data?.data);
        } catch (error) {
            console.error("Error fetching Manage Email:", error);
        }
    };

    useEffect(() => {
        getManageEmail();
    }, [counter]);

    return (
        <section>
            <div className="container">
                <Form onSubmit={handleSubmit(onSubmit)} className='boxShadow_curve'>
                    <Row>
                        <div className="col-md-5">
                            <Form.Group className="mb-3" controlId="primaryEmail">
                                <Form.Label>Primary Email</Form.Label>
                                <Form.Control
                                    type="text"
                                    {...register('primaryEmail', { required: true })}
                                    placeholder="Enter primary Email"
                                />
                                {errors.primaryEmail && <span className="text-danger">This field is required</span>}
                            </Form.Group>
                        </div>
                        <div className="col-md-5">
                            <Form.Group className="mb-3" controlId="secondaryEmail">
                                <Form.Label>Secondary Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    {...register('secondaryEmail', { required: true })}
                                    placeholder="Enter secondary email"
                                />
                                {errors.secondaryEmail && <span className="text-danger">This field is required</span>}
                            </Form.Group>
                        </div>
                        <div className="col-md-12">
                            <div className="viewAll_box mb-1">
                                <Button variant="primary" type="submit">
                                    Update
                                </Button>
                            </div>
                        </div>
                    </Row>
                </Form>
            </div>
        </section>
    )
}

export default ManageEmailsBody;