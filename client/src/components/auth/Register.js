import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Button, Form, Input } from "antd";
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../../actions/authActions'
import { ArrowLeftOutlined } from '@ant-design/icons';

const Register = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const errors = useSelector(state => state.errors)
  const auth = useSelector(state => state.auth)

  const register = ({email, password, password2}) => {
    const registerData = {
      email: email,
      password: password,
      password2: password2,
    }
    dispatch(registerUser(registerData))
  }

  useEffect(() => {
    if(auth.isAuthenticated){
      navigate('/dashboard')
    }
    // eslint-disable-next-line
  }, [auth.isAuthenticated])

  return (
    <Row style={{height: '100%'}} justify='center' align='middle'>
      <Col span={10}>
        <Link to="/">
          <ArrowLeftOutlined/> Back to home
        </Link>
        <div style={{paddingBottom: '25px'}}>
          <h1>
            <b>Register</b> below
          </h1>
          <p>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
        <Form
          requiredMark={false}
          labelAlign='left'
          align='right'
          name="basic"
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 14,
          }}
          onFinish={register}
          onFinishFailed={(errors) => {}}
          autoComplete="on"
        >
          <Form.Item
            label="E-mail"
            name="email"
            extra={errors.email && <span style={{color: 'red'}}>{errors.email}</span>}
            rules={[
              {
                type: 'email',
                message: 'Please enter a correct email!',
              },
              {
                required: true,
                message: 'Please input your email!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
              {
                min: 8,
                message: 'Password must be at least 8 characters!'
              }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Re-enter Password"
            name="password2"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords that you entered do not match!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 14,
              span: 6,
            }}
          >
            <Button type="primary" htmlType="submit" shape='round'>
              Register
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>  
  )
}

export default Register;
