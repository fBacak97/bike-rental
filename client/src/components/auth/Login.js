import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GET_ERRORS } from '../../actions/types'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../../actions/authActions'
import { Row, Col, Button, Form, Input } from "antd";
import { ArrowLeftOutlined } from '@ant-design/icons';

const Login = (props) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const errors = useSelector(state => state.errors)
  const auth = useSelector(state => state.auth)

  const login = (values) => {
    const userData = {
      email: values.email,
      password: values.password,
    };
    dispatch(loginUser(userData))
  };

  useEffect(() => {
    dispatch({
      type: GET_ERRORS,
      payload: {},
    })
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
            <b>Login</b> below
          </h1>
          <p>
            Don't have an account? <Link to="/register">Register</Link>
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
          onFinish={login}
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
            extra={errors.password && <span style={{color: 'red'}}>{errors.password}</span>}
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
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
              Login
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>  
  )
}

export default Login;
