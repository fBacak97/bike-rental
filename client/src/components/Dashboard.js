import { useEffect, useState } from "react"
import { List, Card, Descriptions, Select, Row, Col, DatePicker, Divider, Button, Modal, PageHeader, Space, Checkbox, Pagination, Input } from "antd"
import { useNavigate } from "react-router-dom";
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { useSelector } from 'react-redux'
import { getBikesCustom, reserveBike } from "../api/api";

const moment = extendMoment(Moment);
const {RangePicker} = DatePicker

const Dashboard = (props) => {
  const {user} = useSelector(state => state.auth)
  const navigate = useNavigate()

  const ratings = [1,2,3,4,5]
  //Params
  const [searchInterval, setSearchInterval] = useState(undefined)
  const [colorInput, setColorInput] = useState(undefined)
  const [modelInput, setModelInput] = useState(undefined)
  const [locationInput, setLocationInput] = useState(undefined)
  const [selectedRating, setSelectedRating] = useState(undefined)
  const [paramsChanged, setParamsChanged] = useState(false)

  //Reserve Modal
  const [selectedBike, setSelectedBike] = useState(undefined)
  const [reservationInterval, setReservationInterval] = useState(undefined)
  
  //Pagination
  const [pageNum, setPageNum] = useState(1)
  const [entryCount, setEntryCount] = useState(0)
  const [currentPageBikes, setCurrentPageBikes] = useState([])

  useEffect(() => {
    const queryBuilder = {limit: 8, pageNum: pageNum}
    if(user.role === 'user'){
      queryBuilder.availability = true
    }

    locationInput && (queryBuilder.location = locationInput)
    colorInput && (queryBuilder.color = colorInput)
    modelInput && (queryBuilder.model = modelInput)
    searchInterval && (queryBuilder.interval = searchInterval)
    selectedRating && (queryBuilder.rating = selectedRating)

    getBikesCustom(queryBuilder).then(({data}) => {
      setEntryCount(data.count)
      setCurrentPageBikes(data.bikes)
    }).catch((err) => {
      console.log(err)
    })
    // eslint-disable-next-line
  }, [pageNum, paramsChanged])

  const onSearchIntervalChange = (dates) => {
    if(dates){
      setSearchInterval(moment.range(dates))
    }else{
      setSearchInterval(undefined)
    }
  };

  const onReservationIntervalChange = (dates) => {
    if(dates){
      setReservationInterval(moment.range(dates))
    }else{
      setReservationInterval(undefined)
    }
  };

  const reserveAttempt = () => {
    reserveBike(reservationInterval, selectedBike._id, user).then(({data}) => {
      setSelectedBike(undefined)
      Modal.success({
        title: "Success",
        content: data
      })
    }).catch((err) => {
      Modal.error({
        title: "Error",
        content: err.response.data
      })
    })
  }

  return (
    <div className="container">
      <PageHeader 
        backIcon={false}
        title="Dashboard"
        subTitle=""
      />
      <Row gutter={24}>
        <Col span={6}>
          <RangePicker
            allowClear={true}
            disabledDate={(current) => {
              return current && current < moment().startOf('day');
            }}
            showTime
            format="YYYY/MM/DD HH:mm:ss"
            onChange={onSearchIntervalChange}
          />
        </Col>
        <Col span={4}>
          <Input
            allowClear={true}
            className="capitalized-input"
            placeholder='Location'
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
          />
        </Col>
        <Col span={4}>
          <Input
            allowClear={true}
            className="capitalized-input"
            placeholder='Color'
            value={colorInput}
            onChange={(e) => setColorInput(e.target.value)}
          />
        </Col>
        <Col span={4}>
          <Input
            allowClear={true}
            className="capitalized-input"
            placeholder='Model'
            value={modelInput}
            onChange={(e) => setModelInput(e.target.value)}
          />
        </Col>
        <Col span={4}>
          <Select
            showSearch
            allowClear
            style={{width: '100%'}}
            placeholder="Rating"
            onSelect={setSelectedRating}
            onClear={() => {setSelectedRating(undefined)}}
            options={ratings.map(item => {
              return {label: 'Rated > ' + item, value: item}
            })}
            filterOption={(input, option) =>
              option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
          </Select>
        </Col>
        <Col span={2}>
          <Button 
            type='primary'
            style={{width: '100%'}}
            onClick={() => {setParamsChanged(!paramsChanged)}}
          >
            Search
          </Button>
        </Col>
      </Row>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 4,
          lg: 4,
          xl: 4,
          xxl: 4,
        }}
        dataSource={currentPageBikes}
        style={{paddingTop: '25px'}}
        renderItem={(item) => (        
          <List.Item>
            <Card>
              <Descriptions column={1}>
                <Descriptions.Item label='Model'>{item.model}</Descriptions.Item>
                <Descriptions.Item label='Color'>{item.color}</Descriptions.Item>
                <Descriptions.Item label='Location'>{item.location}</Descriptions.Item>
                <Descriptions.Item label='Rating'>{item.rating ? item.rating : 'Unrated'}</Descriptions.Item>
                <Descriptions.Item label='Availability'><Checkbox disabled defaultChecked={item.availability}></Checkbox></Descriptions.Item>
              </Descriptions>
              <Divider/>
              <Row justify="end">
                <Space>
                  {user.role === 'manager' && <Button onClick={() => {navigate(`/bikes/${item._id}`, {state: {bike: item}})}}>History</Button>}
                  <Button type='primary' onClick={() => (setSelectedBike(item))}>Reserve</Button>
                </Space>
              </Row>
            </Card>
          </List.Item>
        )}
      />
      <Row justify='end'>
        <Pagination current={pageNum} pageSize={8} onChange={setPageNum} total={entryCount}></Pagination>
      </Row>
      <Modal
        title={'Reserving ' + selectedBike?.model}
        visible={selectedBike}
        okButtonProps={{disabled: !reservationInterval}}
        onOk={reserveAttempt}
        onCancel={() => setSelectedBike(undefined)}
      >
        <RangePicker
          allowClear={true}
          disabledDate={(current) => {
            return current && current < moment().startOf('day');
          }}
          showTime
          format="YYYY/MM/DD HH:mm:ss"
          onChange={onReservationIntervalChange}
        />
      </Modal>
    </div>
  )
}

export default Dashboard