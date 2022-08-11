import axios from 'axios'

const host = process.env.REACT_APP_HOST;
const port = process.env.REACT_APP_PORT;

export const getMyReservations = async (userId) => {
  return axios.get(`${host}:${port}/api/reservations`, {
    params: {
      reservedBy: userId
    }
  })
}

export const cancelReservation = async (reservationId) => {
  return axios.delete(`${host}:${port}/api/reservations/${reservationId}`)
}

export const rateReservation = async (reservation, rating, user) => {
  return axios.post(`${host}:${port}/api/ratings/`, {
    userId: user.id,
    bikeId: reservation.bike._id,
    reservation: reservation._id,
    rating: rating
  })
}

export const getBikesCustom = async (query) => {
  return axios.get(`${host}:${port}/api/bikes`, {
    params: query
  })
}

export const getBikes = async (pageNum) => {
  return axios.get(`${host}:${port}/api/bikes`, {
    params: {
      limit: 10,
      pageNum: pageNum,
    }
  })
}

export const reserveBike = async (dateRange, bikeId, user) => {
  return axios.post(`${host}:${port}/api/reservations`, {
    userId: user.id,
    bikeId: bikeId,
    dateRange: dateRange
  })
}

export const createBike = async (formData) => {
  return axios.post(`${host}:${port}/api/bikes`, formData)
}

export const editBike = async (bikeId, formData) => {
  return axios.patch(`${host}:${port}/api/bikes/${bikeId}`, formData)
}

export const deleteBike = async (bikeId) => {
  return axios.delete(`${host}:${port}/api/bikes/${bikeId}`)
}

export const getUsers = async (pageNum) => {
  return axios.get(`${host}:${port}/api/users`, {
    params: {
      pageNum: pageNum
    }
  })
}

export const createUser = async (formData) => {
  return axios.post(`${host}:${port}/api/users`, formData)
}

export const editUser = async (userId, formData) => {
  return axios.patch(`${host}:${port}/api/users/${userId}`, formData)
}

export const deleteUser = async (userId) => {
  return axios.delete(`${host}:${port}/api/users/${userId}`)
}

export const register = async (formData) => {
  return axios.post(`${host}:${port}/api/users/register`, formData)
}

export const login = async (formData) => {
  return axios.post(`${host}:${port}/api/users/login`, formData)
}

