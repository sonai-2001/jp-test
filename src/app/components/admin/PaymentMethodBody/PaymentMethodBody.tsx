"use client"
import { createPaymentMethod, getPaymentMethods, updatePaymentMethod } from '@/app/services/PaymentMethod/paymentMethodApi';
import { increment } from '@/app/services/redux/features/counterSlice';
import React, { useEffect } from 'react'
import { Button, Form } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

function PaymentMethodBody() {
    const dispatch = useDispatch();
    const counter = useSelector((state: any) => state.counter?.value);
    const { handleSubmit, control, reset, formState: { errors } } = useForm<any>();

    const onSubmit = async (data: any) => {
        const formData = {
            UPI: data.UPI,
            NetBanking: data.NetBanking
        };
        try {
            const response = data._id ? await updatePaymentMethod({ ...formData, id: data._id, }) : await createPaymentMethod(formData);
            if (response) {
                dispatch(increment());
            }
        } catch (error) {
            console.error("Error in POST /api/payment:", error);
        }
    };

    const getPaymentData = async () => {
        try {
            const data = await getPaymentMethods();
            reset(data?.data[0]);
        } catch (error) {
            console.error("Error fetching payment:", error);
        }
    };

    useEffect(() => {
        getPaymentData();
    }, [counter]);

        const MyEditor = ({ value, onChange }:any) => {
            return (
                <SunEditor
                    defaultValue={value}
                    onChange={onChange}
                    setOptions={{
                        height: "300",
                        
                        buttonList: [
                            ['undo', 'redo'],
                            ['formatBlock', 'fontSize'],
                            ['bold', 'underline', 'italic', 'strike'],
                            ['fontColor', 'hiliteColor', 'textStyle'],
                            ['removeFormat'],
                            ['outdent', 'indent'],
                            ['align', 'horizontalRule', 'list', 'table'],
                            ['link', 'image', 'video'],
                            ['codeView']
                        ]
                    }}
                />
            );
        };

    return (
        <section>
            <div className="container">
                <div className="row ">
                    <div className="col-lg-12 m-auto">
                        <div className="hero_banner_title py-0">
                            <div className="container position-relative">
                                <div className="row">
                                    <div className="col-lg-8 m-auto">
                                        <div className="title">
                                            <h2>Payment Form</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Form.Group className="mb-3" controlId="UPI">
                                <Form.Label>UPI</Form.Label>
                                <Controller
                                    name="UPI"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <MyEditor value={field.value} onChange={field.onChange} />
                                    )}
                                />
                                {errors.UPI && <span className="text-danger">This field is required</span>}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="NetBanking">
                                <Form.Label>Net-Banking</Form.Label>
                                <Controller
                                    name="NetBanking"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <MyEditor value={field.value} onChange={field.onChange} />
                                    )}
                                />
                                {errors.NetBanking && <span className="text-danger">This field is required</span>}
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PaymentMethodBody;