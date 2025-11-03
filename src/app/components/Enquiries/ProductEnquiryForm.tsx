import React, { useEffect } from 'react'
import { Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';

function ProductEnquiryForm({ reset, register, setValue, watch, errors, sameAsAddress }: {
    setValue: any,
    watch: any, register: any, errors: any, sameAsAddress: boolean, reset: any
}) {
    const add = watch("address")
    const { userData } = useSelector((state: any) => state.user);

    useEffect(() => {
        if (sameAsAddress) {
            setValue("deliveryAddress", add)
        }
    }, [sameAsAddress, add])
    useEffect(() => {
        userData && reset({ ...userData })
    }, [])

    return (
        <>
            <Form.Group className="mb-3 form-group" controlId="companyName">
                <Form.Label>Company Name<span className='text-danger'>*</span></Form.Label>
                <Form.Control
                    type="text"
                    {...register('companyName', { required: true })}
                    placeholder="Enter company name"
                />
                {errors.companyName && <span className="text-danger">This field is required</span>}
            </Form.Group>

            <Form.Group className="mb-3 form-group" controlId="gstNumber">
                <Form.Label>GST Number<span className='text-danger'>*</span></Form.Label>
                <Form.Control
                    type="text"
                    {...register('gstNumber', { required: true })}
                    placeholder="Enter GST number"
                />
                {errors.gstNumber && <span className="text-danger">This field is required</span>}
            </Form.Group>

            <Form.Group className="mb-3 form-group" controlId="address">
                <Form.Label>Address<span className='text-danger'>*</span></Form.Label>
                <Form.Control
                    type="text"
                    {...register('address', { required: true })}
                    placeholder="Enter address"
                />
                {errors.address && <span className="text-danger">This field is required</span>}
            </Form.Group>

            <Form.Group className="mb-3 form-group" controlId="sameAsAddress">
                <Form.Check
                    type="checkbox"
                    {...register('sameAsAddress')}
                    label="Delivery Address is the same"
                />
            </Form.Group>

            <Form.Group className="mb-3 form-group" controlId="deliveryAddress">
                <Form.Label>Delivery Address<span className='text-danger'>*</span></Form.Label>
                <Form.Control
                    type="text"
                    {...register('deliveryAddress', { required: true, onChange: () => { setValue("sameAsAddress", false) } })}
                    placeholder="Enter delivery address"
                />
                {errors.deliveryAddress && <span className="text-danger">This field is required</span>}
            </Form.Group>

        </>
    )
}

export default ProductEnquiryForm