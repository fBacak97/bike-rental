import setAuthToken from "../utils/setAuthToken"
import jwt_decode from "jwt-decode"
import { GET_ERRORS, SET_CURRENT_USER } from "./types"
import { login, register } from "../api/api"

export const registerUser = (userData) => (dispatch) => {
  register(userData).then((res) => {
    if(res.status === 200){
      dispatch(loginUser({  // Login the user as well
        email: userData.email,
        password: userData.password
      }))
    }
  }).catch((err) => {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data,
    })
  })
}

export const loginUser = (userData) => (dispatch) => {
  login(userData).then((res) => {
    // Save token to local storage
    const { token } = res.data
    localStorage.setItem("jwtToken", token)
    // Set axios auth header
    setAuthToken(token)
    // Decode token to get user data
    const decoded = jwt_decode(token)
    // Set current user
    dispatch(setCurrentUser(decoded))
  }).catch((err) =>
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data,
    })
  )
}

export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  }
}

export const logoutUser = () => (dispatch) => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken")
  // Remove auth header for future requests
  setAuthToken(false)
  dispatch(setCurrentUser({}))
}
