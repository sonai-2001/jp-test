import { createEnquiry } from '@/app/services/Enquiry/EnquiryApi';
import { setUser } from '@/app/services/redux/features/userSlice';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Modal, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

function EnquiryModel({ show, handleClose, model, productName, models, productId, category, getQuantity, }: { getQuantity: number, category: any, model: any, productName: string, models: any[], productId: string, show: boolean, handleClose: () => void }) {

    const dispatch = useDispatch();
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
    const { userData } = useSelector((state: any) => state.user);
    const router = useRouter();
    const [quantity, setQuantity] = React.useState<any>(getQuantity || 1);
    const [userInputs, setUserInputs] = React.useState<any>(userData);

    const onSubmit = async (data: any) => {
        const selectedModel = models.find((item: any) => item._id === data.productModel);
        const body = {
            ...data,
            category: category,
            status: 'Pending',
            userId: localStorage.getItem("jid"),
            productId: productId,
            productModel: {
                modelName: selectedModel?.modelName,
                basePrice: selectedModel?.basePrice
            }
        };

        try {
            const result = await createEnquiry(body);
            if (result) {
                if (localStorage.getItem("jid")) {
                    router.push("/my-enquiry")
                } else {
                    // localStorage.setItem("jid", result.data._doc.userId);
                    // localStorage.setItem("jtoken", result.data.token);
                    // localStorage.setItem("type", "user");
                    router.push("/my-enquiry");
                    // dispatch(setUser({
                    //     "_id": result.data._doc.userId,
                    //     "email": result.data._doc.email,
                    //     name:result.data._doc.customerName,
                    //     companyName:result.data._doc.companyName,
                    //     mobile:result.data._doc.phone,
                    //     "type": "user",
                    // }));
                }
            }
        } catch (error: any) {
            console.error(error);
        }
    };

    const addQuantity = () => {
        setQuantity(quantity + 1);
        setValue('quantity', quantity + 1);
    }

    const removeQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
            setValue('quantity', quantity - 1);
        }
    }

    useEffect(() => {
        reset({
            productName: productName,
            productModel: model._id,
            quantity: quantity,
            customerName: userInputs?.name,
            phone: userInputs?.mobile,
            ...userInputs,
        });
    }, [model, productName, userInputs]);

    const logOut = () => {
        localStorage.removeItem('jtoken');
        localStorage.removeItem('jid');
        localStorage.removeItem('type');
        localStorage.removeItem('image');
        dispatch(setUser(null));
    }

    useEffect(() => {
        setUserInputs(userData)
    }, [userInputs])

    return (
        <Modal size='lg' scrollable centered show={show} className="signInUp_modal">
            <Modal.Header className='border-0' closeButton onHide={() => {
                handleClose();
                reset();
            }}>
                <Modal.Title>Product Enquiry</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="col-12 w-100 d-sm-flex gap-3">
                        <Form.Group className="mb-3 w-100 form-group" controlId="productName">
                            <Form.Label>Product Name</Form.Label>
                            <Form.Control
                                type="text"
                                readOnly
                                {...register('productName', { required: true })}
                                placeholder="Enter product name"
                            />
                            {errors.productName && <span className="text-danger">This field is required</span>}
                        </Form.Group>

                        <Form.Group className="mb-3 w-100 form-group" controlId="model">
                            <Form.Label>Model</Form.Label>
                            <Form.Select {...register('productModel', { required: true })}>
                                <option value="">Select a model</option>
                                {
                                    models.map((item: any, index: number) => (
                                        <option key={index} value={item._id}>{item?.modelName}</option>
                                    ))
                                }
                            </Form.Select>
                            {errors.productModel && <span className="text-danger">This field is required</span>}
                        </Form.Group>
                    </div>

                    <div className="col-12 w-100 d-sm-flex gap-3">
                        <Form.Group className="mb-3 w-100 form-group" controlId="customerName">
                            <Form.Label>Customer Name</Form.Label>
                            <Form.Control
                                type="text"
                                {...register('customerName', { required: true })}
                                placeholder="Enter customer name"
                            />
                            {errors.customerName && <span className="text-danger">This field is required</span>}
                        </Form.Group>
                        <Form.Group className="mb-3 w-100 form-group" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                disabled={userData?.email}
                                {...register('email', { required: true })}
                                placeholder="Enter email"
                            />
                            {userData?.email && <span>
                                <small>Do you want to change your mail?</small> <button onClick={logOut} className='btn btn-sm btn-danger mt-1' style={{ background: '#e50e0e' }} >Sign Out</button>
                            </span>}
                            {errors.email && <span className="text-danger">This field is required</span>}
                        </Form.Group>
                    </div>

                    <div className="col-12 w-100 d-sm-flex gap-3">
                        <Form.Group className="mb-3 w-100 form-group" controlId="phone">
                            <Form.Label>Phone</Form.Label>
                            {/* <Form.Control
                                type="number"
                                {...register('phone', { required: true })}
                                placeholder="Enter phone number"
                            />
                            {errors.phone && <span className="text-danger">This field is required</span>}
                         */}
                            <Form.Control
                                type="tel"
                                maxLength={10}
                                {...register('phone', {
                                    required: true,
                                    pattern: /^[0-9]{10}$/
                                })}
                                placeholder="Enter phone number"
                            />
                            {errors.phone && errors.phone.type === "required" && (
                                <span className="text-danger">This field is required</span>
                            )}
                            {errors.phone && errors.phone.type === "pattern" && (
                                <span className="text-danger">Phone number must be 10 digits</span>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3 w-100 form-group" controlId="quantity">
                            <Form.Label>Quantity</Form.Label>
                            <div className="d-flex gap-3">
                                <button type="button" className="btn btn-secondary px-3" onClick={removeQuantity}>-</button>
                                <Form.Control
                                    type="number"
                                    className='text-center'
                                    {...register('quantity', {
                                        required: 'Quantity is required',
                                        min: {
                                            value: 1,
                                            message: 'Quantity must be greater than 0'
                                        },
                                        onChange: (e: any) => setQuantity(e.target.value)
                                    })}
                                    placeholder="Enter quantity"
                                />
                                <button type="button" className="btn btn-secondary px-3" onClick={addQuantity}>+</button>
                            </div>
                            {errors.quantity && <span className="text-danger">{errors.quantity.message as String}</span>}
                        </Form.Group>
                    </div>

                    <Form.Group className="mb-3 form-group" controlId="companyName">
                        <Form.Label>Company Name</Form.Label>
                        <Form.Control
                            type="text"
                            {...register('companyName', { required: true })}
                            placeholder="Enter company name"
                        />
                        {errors.companyName && <span className="text-danger">This field is required</span>}
                    </Form.Group>

                    <Form.Group className="mb-3 form-group" controlId="comment">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                            as="textarea"
                            {...register('comment')}
                            placeholder="Enter your comments"
                            rows={3}
                        />
                    </Form.Group>
                    <div className="col-12 text-end">
                        <div className='btn_box'>
                            <button className='btn w-auto px-5' type="submit">
                                Enquiry
                            </button>
                        </div>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default EnquiryModel;