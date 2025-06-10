// 认证相关API
import request from '@/utils/request'

// 用户登录
export const login = (data) => {
  return request({
    url: '/auth/login',
    method: 'POST',
    data
  })
}

// 用户注册
export const register = (data) => {
  return request({
    url: '/auth/register',
    method: 'POST',
    data
  })
}

// 获取用户信息
export const getUserInfo = () => {
  return request({
    url: '/auth/userinfo',
    method: 'GET'
  })
}

// 修改密码
export const changePassword = (data) => {
  return request({
    url: '/auth/change-password',
    method: 'POST',
    data
  })
}

// 修改签约密码
export const changeSignPassword = (data) => {
  return request({
    url: '/auth/change-sign-password',
    method: 'POST',
    data
  })
}
