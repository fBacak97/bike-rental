import React, { useEffect, useState } from 'react'
import {Row, Col, PageHeader, Collapse, Modal, Table, Button, Select, Form} from 'antd'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { getMyReservations, cancelReservation, rateReservation } from '../api/api'

const {Panel} = Collapse

const tableColumns = [
  {
    title: 'Model',
    dataIndex: ['bike', 'model'],
    key: 'model',
    render: model => <span>{model ? model : 'Unavailable'}</span>,
  },
  {
    title: 'Start Date',
    dataIndex: 'startDate',
    key: 'startDate',
    render: date => <span>{moment(date).format("MMMM Do YYYY, HH:mm:ss")}</span>,
  },
  {
    title: 'End Date',
    dataIndex: 'endDate',
    key: 'endDate',
    render: date => <span>{moment(date).format("MMMM Do YYYY, HH:mm:ss")}</span>,
  },
  {
    title: 'Color',
    dataIndex: ['bike', 'color'],
    key: 'color',
    render: color => <span>{color ? color : 'Unavailable'}</span>,
  },
  {
    title: 'Location',
    dataIndex: ['bike', 'location'],
    key: 'location',
    render: location => <span>{location ? location : 'Unavailable'}</span>,
  },
  {
    title: 'Bike Rating',
    dataIndex: ['bike', 'rating'],
    key: 'rating',
    render: rating => <span>{rating ? rating : 'Unavailable'}</span>,
  },
]

const Reservations = () => {
  const {user} = useSelector(state => state.auth)

  const [pastReservations, setPastReservations] = useState([])
  const [currentReservations, setCurrentReservations] = useState([]) 
  const [futureReservations, setFutureReservations] = useState([])
  const [entriesModified, setEntriesModified] = useState(false)

  useEffect(() => {
    getMyReservations(user.id).then(({data: reservations}) => {
      let pastReservations = []
      let currentReservations = []
      let futureReservations = []
      reservations.forEach((elem) => {
        if(moment().isAfter(moment(elem.endDate))){
          pastReservations.push(elem)
        }else if(moment().isBefore(moment(elem.startDate))){
          futureReservations.push(elem)
        }else{
          currentReservations.push(elem)
        }
      })
      setPastReservations(pastReservations)
      setFutureReservations(futureReservations)
      setCurrentReservations(currentReservations)
    })
    // eslint-disable-next-line
  }, [entriesModified])

  const cancelAttempt = (reservation) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "You might not be able to reserve the same time slot again!",
      onOk: () => {
        cancelReservation(reservation._id).then(({data}) => {
          Modal.success({
            title: "Success",
            content: data,
            onOk: () => {setEntriesModified(!entriesModified)}
          })
        }).catch((err) => {
          Modal.error({
            title: "Error",
            content: err.response.data
          })
        })
      },
      okText: 'Confirm',
      maskClosable: true
    })
  }

  const rateAttempt = (reservation, rating) => {
    rateReservation(reservation, rating, user).then(({data}) => {
      Modal.success({
        title: "Success",
        content: data,
        onOk: () => {setEntriesModified(!entriesModified)}
      })
    }).catch((err) => {
      Modal.error({
        title: "Error",
        content: err.response.data
      })
    })
  }


  const actions = {
    cancel: {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type='primary' onClick={() => {cancelAttempt(record)}}>Cancel</Button>
      )
    },
    rate: {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        return record.bike ? (
            <Form initialValues={{rating: 1}} layout='inline' onFinish={(values) => {rateAttempt(record, values.rating)}}>
              <Form.Item name='rating'>
                <Select options={[1,2,3,4,5].map((elem) => {return {label: elem, value: elem}})}></Select>
              </Form.Item>
              <Form.Item>
                <Button type='primary' htmlType='submit'>Rate</Button>
              </Form.Item>
            </Form>
        ) : null
      }
    }
  }

  return (
    <Row className='container'>
      <Col span={24}>
        <PageHeader 
          backIcon={false}
          title="My Reservations"
          subTitle=""
        />
        <Collapse>
          <Panel header="Past Reservations" key="1">
            <Table columns={tableColumns.concat([actions.rate])} rowKey={(elem) => elem._id} dataSource={pastReservations}/>
          </Panel>
          <Panel header="Current Reservations" key="2">
            <Table columns={tableColumns.concat([actions.rate])} rowKey={(elem) => elem._id} dataSource={currentReservations}/>
          </Panel>
          <Panel header="Future Reservations" key="3">
            <Table columns={tableColumns.concat([actions.cancel])} rowKey={(elem) => elem._id} dataSource={futureReservations}/>
          </Panel>
        </Collapse>
      </Col>
    </Row>
  )
}

export default Reservations;