import React, { useEffect, useState } from 'react'
import { Row, Col, PageHeader, Table, Pagination, Button, Modal, Form, Input, Checkbox } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PlusCircleOutlined } from '@ant-design/icons';
import { createBike, deleteBike, editBike, getBikes } from '../api/api';

const ManageBikes = (props) => {
  const [editForm] = Form.useForm()
  const [createForm] = Form.useForm()
  const navigate = useNavigate()

  const [pageNum, setPageNum] = useState(1)
  const [entryCount, setEntryCount] = useState(0)
  const [currentPageBikes, setCurrentPageBikes] = useState([])
  const [selectedEntry, setSelectedEntry] = useState(undefined)
  const [entryModified, setEntryModified] = useState(false)
  const [createModalVisible, setCreateModalVisible] = useState(false)
  
  const deleteBikeAttempt = (id) => {
    deleteBike(id).then((res) => {
      setEntryModified(!entryModified)
    }).catch((err) => {
      Modal.error({
        title: "Error",
        content: err.response.data,
      })
    })
  }

  const createBikeAttempt = () => {
    const formData = createForm.getFieldsValue(true)
    createBike(formData).then((res) => {
      Modal.success({
        title: "Success",
        content: "Successfully added a new bike to the system!",
        onOk: () => {
          setCreateModalVisible(false)
          setEntryModified(!entryModified)
        }
      })
    })
    .catch((err) => {
      console.log(err)
    });
  };

  const tableColumns = [
    {
      title: 'Bike ID',
      dataIndex: ['_id'],
      key: 'bikeId',
    },
    {
      title: 'Model',
      dataIndex: ['model'],
      key: 'model',
    },
    {
      title: 'Color',
      dataIndex: ['color'],
      key: 'color',
    },
    {
      title: 'Location',
      dataIndex: ['location'],
      key: 'location',
    },
    {
      title: 'Bike Rating',
      dataIndex: ['rating'],
      key: 'rating',
      render: rating => <span>{rating ? rating : 'Unavailable'}</span>,
    },
    {
      title: 'Availability',
      dataIndex: ['availability'],
      key: 'availability',
      render: availability => <Checkbox disabled checked={availability}></Checkbox>
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Row gutter={16}>
          <Col>
            <Button size='small' onClick={() => {navigate(`/bikes/${record._id}`, {state: {bike: record}})}}>History</Button>
          </Col>
          <Col>
            <Button 
              type='primary' 
              size='small' 
              onClick={() => {
                setSelectedEntry(record)
                editForm.setFieldsValue({
                  model: record.model,
                  color: record.color,
                  rating: record.rating,
                  location: record.location,
                  availability: record.availability
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
                content: "The bike will have to be added back to the system for rental!",
                onOk: () => {
                  deleteBikeAttempt(record._id)
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
    }
  ]

  useEffect(() => {
    getBikes(pageNum).then(({data}) => {
      setEntryCount(data.count)
      setCurrentPageBikes(data.bikes)
    }).catch((err) => {
      console.log(err)
    })
    // eslint-disable-next-line
  }, [pageNum, entryModified])

  const onEditFinish = async () => {
    const validation = await editForm.validateFields()
    if(!validation.errorFields){
      const formData = editForm.getFieldsValue(true)
      editBike(selectedEntry._id, formData).then((res) => {
        Modal.success({
          title: "Success",
          content: "Successfully edited bike information!",
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
              label="Model"
              name="model"
              rules={[
                {
                  required: true,
                  message: 'Please enter a model!',
                }
              ]}
            >
              <Input/>
            </Form.Item>
            <Form.Item
              label="Color"
              name="color"
              rules={[
                {
                  required: true,
                  message: 'Please enter a color!',
                }
              ]}
            >
              <Input/>
            </Form.Item>
            <Form.Item
              label="Location"
              name="location"
              rules={[
                {
                  required: true,
                  message: 'Please enter a location!',
                }
              ]}
            >
              <Input/>
            </Form.Item>
            <Form.Item
              label="Availability"
              name="availability"
              valuePropName='checked'
            >
              <Checkbox/>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          visible={createModalVisible}
          onCancel={() => setCreateModalVisible(false)}
          onOk={createBikeAttempt}
          okText='Create'
          okType='primary'
          closable={false}
        >
          <Form
            form={createForm}
            requiredMark={false}
            labelAlign='left'
            align='right'
            name="create"
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}
            onFinish={(values) => {}}
            onFinishFailed={(errors) => {}}
            autoComplete="on"
          >
            <Form.Item
              label="Model"
              name="model"
              rules={[
                {
                  required: true,
                  message: 'Please enter a model!',
                }
              ]}
            >
              <Input/>
            </Form.Item>
            <Form.Item
              label="Color"
              name="color"
              rules={[
                {
                  required: true,
                  message: 'Please enter a color!',
                }
              ]}
            >
              <Input/>
            </Form.Item>
            <Form.Item
              label="Location"
              name="location"
              rules={[
                {
                  required: true,
                  message: 'Please enter a location!',
                }
              ]}
            >
              <Input/>
            </Form.Item>
          </Form>
        </Modal>
        <PageHeader
          backIcon={false}
          title='Manage Bikes'
          subTitle={<Button icon={<PlusCircleOutlined/>} type='primary' onClick={() => {setCreateModalVisible(true)}}>Create New Bike</Button>}
        />
        <Row>
          <Table style={{width: '100%'}} pagination={false} columns={tableColumns} rowKey={(elem) => elem._id} dataSource={currentPageBikes}/>
        </Row>
        <Row justify='end'>
          <Pagination current={pageNum} onChange={setPageNum} total={entryCount}></Pagination>
        </Row>
      </Col>
    </Row>
  )
}

export default ManageBikes