'use client'
import axios from 'axios'
import Cookies from 'js-cookie'
const BASE_URL = 'https://apis.rentelligence.biz/api';
export const IMAGE_BASE_URL = 'https://apis.rentelligence.biz/TicketImage';

const isLoggedIn = () => {
  return Cookies.get('userDetail') !== undefined
}

export const setToken = (token) => {
  if (token) {
    Cookies.set('token', token, {
      expires: 7,
      secure: true,
      sameSite: 'Strict',
    })
  }
}

//  Token Retrieve  function
export const getToken = () => {
  const token = Cookies.get('token')
  return token ? token : null
}

//  Admin User ID store  function
export const setAdminUserId = (adminUserId) => {
  if (adminUserId) {
    Cookies.set('adminUserId', adminUserId, {
      expires: 7,
      secure: true,
      sameSite: 'Strict',
    })
  }
}

export const setUsername = (username) => {
  if (username) {
    Cookies.set('username', username, {
      expires: 7,
      secure: true,
      sameSite: 'Strict',
    })
  }
}

// Admin User ID get  function
export const getAdminUserId = () => {
  const adminUserId = Cookies.get('adminUserId')
  return adminUserId ? adminUserId : null
}

export const getUsername = () => {
  const username = Cookies.get('username')
  return username ? username : null
}

export const setUserDetails = (user) => {
  if (user) {
    Cookies.set('userDetails', user, {
      expires: 7,
      secure: true,
      sameSite: 'Strict',
    })
  }
}

//  User ID get function
export const getUserDetails = () => {
  if (isLoggedIn()) {
    const userData = Cookies.get('userDetails')
    if (userData) {
      const data = JSON.parse(userData)
      return data?.userId ?? null
    }
  }
  return null
}

// API Requests
export const getRequest = async (endpoint) => {
  try {
    const token = getToken()

    if (!token) {
      throw new Error('No token found')
    }
  
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error(' API Call Failed:', error)
    throw error
  }
}

export const getRequestLoginId = async (endpoint, data) => {
  try {
    const token = getToken()

    if (!token) {
      throw new Error('No token found')
    }
  
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error(' API Call Failed:', error)
    throw error
  }
}

export const postRequest = async (endpoint, data) => {
  try {
    const token = getToken()
    const headers = token ? { Authorization: `Bearer ${token}`, } : {}
    const response = await axios.post(`${BASE_URL}${endpoint}`, data, {
      headers,
    })
    return response.data
  } catch (error) {
    console.error(' API Call Failed:', error.response?.data || error.message)
    throw error
  }
}


export const postformRequest = async (endpoint, data) => {
  try {
    const token = getToken()

    const headers = {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'multipart/form-data',
    }

    const response = await axios.post(`${BASE_URL}${endpoint}`, data, {
      headers,
    })

    return response.data
  } catch (error) {
    console.error('API Call Failed:', error.response?.data || error.message)
    throw error
  }
}

export const postCreate = async (endpoint, data) => {
  const token = getToken()
  if (!token) {
    throw new Error('No token found')
  }

  const dataWithCreatedBy = {
    ...data,
    createdBy: getAdminUserId(),
  }

  const response = await axios.post(
    `${BASE_URL}${endpoint}`,
    dataWithCreatedBy,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return response.data
}

export const postSetup = async (endpoint, data) => {
  const response = await axios.post(`${BASE_URL}${endpoint}`, data)
  return response.data
}

export const postUpdate = async (endpoint, data) => {
  const token = getToken()
  if (!token) {
    throw new Error('No token found')
  }

  const dataWithUpdatedBy = {
    ...data,
    updatedBy: getAdminUserId(),
  }
  const response = await axios.post(
    `${BASE_URL}${endpoint}`,
    dataWithUpdatedBy,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        
      },
    },
  )
  return response.data
}

export const postImageRequest = async (endpoint, data) => {
  const token = getToken()
  if (!token) {
    throw new Error('No token found')
  }

  const dataWithCreatedBy = {
    ...data,
    createdBy: getAdminUserId(),
  }

  const response = await axios.post(
    `${BASE_URL}${endpoint}`,
    dataWithCreatedBy,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    },
  )
  return response.data
}