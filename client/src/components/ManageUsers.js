import React, { useEffect, useState } from 'react'
import {Row, Col, PageHeader, Table, Pagination, Button, Modal, Select, Form, Input} from 'antd';
import { GET_ERRORS } from '../actions/types';
import { useNavigate } from 'react-router-dom';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { createUser, deleteUser, editUser, getUsers } from '../api/api';

const ManageUsers = (props) => {
  const [editForm] = Form.useForm()
  const [registerForm] = Form.useForm()
  
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const errors = useSelector(state => state.errors)

  const [pageNum, setPageNum] = useState(1)
  const [entryCount, setEntryCount] = useState(0)
  const [currentPageUsers, setCurrentPageUsers] = useState([])
  const [selectedEntry, setSelectedEntry] = useState(undefined)
  const [entryModified, setEntryModified] = useState(false)
  const [registerModalVisible, setRegisterModalVisible] = useState(false)
  
  const deleteUserAttempt = (id) => {
    deleteUser(id).then(({data}) => {
      Modal.success({
        title: "Error",
        content: data,
      })
      setEntryModified(!entryModified)
    }).catch((err) => {
      Modal.error({
        title: "Error",
        content: err.response.data,
      })
    })
  }

  const createUserAttempt = () => {
    const formData = registerForm.getFieldsValue(true)
    createUser(formData).then((res) => {
      Modal.success({
        title: "Success",
        content: "Successfully created a new user!",
        onOk: () => {
          setRegisterModalVisible(false)
          setEntryModified(!entryModified)
        }
      })
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    });
  };

  const tableColumns = [
    {
      title: 'E-mail',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Hashed Password',
      dataIndex: 'password',
      key: 'password',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Row gutter={16}>
          <Col>
            <Button size='small' onClick={() => {navigate(`/users/${record._id}`, {state: {user: record}})}}>History</Button>
          </Col>
          <Col>
            <Button 
              type='primary' 
              size='small' 
              onClick={() => {
                setSelectedEntry(record)
                editForm.setFieldsValue({
                  email: record.email,
                  password: record.password,
                  role: record.role
                })
              }}
            >
              Edit
            </Button>
          </Col>
          <Col>
            <Button type='primary' size='small' danger onClick={() => {
              Modal.confirm({
                title: "Are you sure?",
                content: "The user will have to register again if they want to login to the system!",
                onOk: () => {
                  deleteUserAttempt(record._id)
                },
                okText: 'Confirm',
                maskClosable: true
              })
            }}>
              Delete
            </Button>
          </Col>
        </Row>
      )
    },
  ]

  useEffect(() => {
    getUsers(pageNum).then(({data}) => {
      setEntryCount(data.count)
      setCurrentPageUsers(data.users)
    }).catch((err) => {
      console.log(err)
    })
    // eslint-disable-next-line
  }, [pageNum, entryModified])

  const onEditFinish = async () => {
    const validation = await editForm.validateFields()
    if(!validation.errorFields){
      const formData = editForm.getFieldsValue(true)
      editUser(selectedEntry._id, formData).then((res) => {
        Modal.success({
          title: "Success",
          content: "Successfully changed user credentials!",
          onOk: () => {
            setSelectedEntry(undefined)
            setEntryModified(!entryModified)
          }
        })
      })
      .catch((err) => {
        Modal.error({
          title: "Error",
          content: err.response.data,
        })
      })
    }
  }

  return (
    <Row className='container'>
      <Col span={24}>
        <Modal 
          visible={selectedEntry}
          onCancel={() => setSelectedEntry(undefined)}
          onOk={onEditFinish}
          okText='Edit'
          okType='danger primary'
          closable={false}
        >
          <Form
            form={editForm}
            name='edit'
            labelAlign='left'
            labelCol={{span: 6}}
            wrapperCol={{span: 18}}
            onFinish={(values) => {}}
            onFinishFailed={(values) => {}}
            requiredMark={false}
          >
            <Form.Item
              label="E-mail"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please input an e-mail address!',
                },
                {
                  type: 'email',
                  message: 'Please input a valid e-mail address!'
                }
              ]}
            >
              <Input/>
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please enter a password!',
                },
                {
                  min: 8,
                  message: 'Password must be at least 8 characters!'
                }
              ]}
            >
              <Input/>
            </Form.Item>
            <Form.Item
              label="Role"
              name="role"
              rules={[
                {
                  required: true,
                  message: 'Please select a role for the user!',
                }
              ]}
            >
              <Select options={[{label: 'User', value: 'user'}, {label: 'Manager', value: 'manager'}]}/>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          visible={registerModalVisible}
          onCancel={() => setRegisterModalVisible(false)}
          onOk={createUserAttempt}
          okText='Create'
          okType='primary'
          closable={false}
        >
          <Form
            form={registerForm}
            requiredMark={false}
            labelAlign='left'
            align='right'
            name="register"
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}
            onFinish={(values) => {}}
            onFinishFailed={(errors) => {}}
            autoComplete="on"
            initialValues={{role: 'user'}}
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
              <Input onChange={(value) => {
                if(errors.email){
                  dispatch({
                    type: GET_ERRORS,
                    payload: {email: ''},
                  })
                }
              }}/>
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
              <Input.Password/>
            </Form.Item>
            <Form.Item
              label="Role"
              name="role"
              rules={[
                {
                  required: true,
                  message: 'Please select a role for the user!',
                }
              ]}
            >
              <Select options={[{label: 'User', value: 'user'}, {label: 'Manager', value: 'manager'}]}/>
            </Form.Item>
          </Form>
        </Modal>
        <PageHeader
          backIcon={false}
          title='Manage Users'
          subTitle={<Button icon={<PlusCircleOutlined/>} type='primary' onClick={() => {setRegisterModalVisible(true)}}>Create New User</Button>}
        />
        <Row>
          <Table style={{width: '100%'}} pagination={false} columns={tableColumns} rowKey={(elem) => elem._id} dataSource={currentPageUsers}/>
        </Row>
        <Row justify='end'>
          <Pagination current={pageNum} onChange={setPageNum} total={entryCount}></Pagination>
        </Row>
      </Col>
    </Row>
  )
}

export default ManageUsers