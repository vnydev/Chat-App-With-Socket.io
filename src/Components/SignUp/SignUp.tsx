import React from "react";
import { Button, Form, Input } from "antd";

import { User } from '../../Interfaces/chatInterfaces'

interface SIGN_UP {
    onSubmit(values: any): void;
    onCanceled?(reason: any): void;
}
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const SignUp: React.FC<SIGN_UP> = ({ onSubmit, onCanceled }: SIGN_UP) => {

    const [form] = Form.useForm();

    /* eslint-disable no-template-curly-in-string */
    const validateMessages = {
        required: "${label} is required!",
        types: {
            email: "${label} is not a valid email!",
            number: "${label} is not a valid number!",
        },
        // number: {
        //   range: "${label} must be between ${min} and ${max}",
        // },
    };
    /* eslint-enable no-template-curly-in-string */
    
    const handleOnSubmit = (values: User) => {
        onSubmit(values)
        form.resetFields()
    }

    return (
        <Form
            form={form}
            {...layout}
            name="basic"
            style={{ maxWidth: 600, padding: '5%' }}
            //   initialValues={{ remember: true }}
            onFinish={handleOnSubmit}
            // onFinishFailed={onCanceled}
            autoComplete="off"
            layout="vertical"
            validateMessages={validateMessages}
        >
            <Form.Item
                label="Full Name"
                name={["user", "name"]}
                rules={[{ required: true }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name={["user", "email"]}
                label="Email"
                rules={[{ type: "email", required: true }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name={["user", "phone"]}
                label="Phone No."
                rules={[{ required: true }]}
            >
                <Input />
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default SignUp;
