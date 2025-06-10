// 合同相关API
import request from '@/utils/request'

// 获取合同列表
export const getContractList = (params) => {
  return request({
    url: '/contract/list',
    method: 'GET',
    data: params
  })
}

// 获取合同详情
export const getContractDetail = (id) => {
  return request({
    url: `/contract/detail/${id}`,
    method: 'GET'
  })
}

// 签署合同
export const signContract = (data) => {
  return request({
    url: '/contract/sign',
    method: 'POST',
    data
  })
}

// 支付签字费
export const paySignFee = (data) => {
  return request({
    url: '/contract/pay-sign-fee',
    method: 'POST',
    data
  })
}

// 创建借条
export const createBorrow = (data) => {
  return request({
    url: '/borrow/create',
    method: 'POST',
    data
  })
}

// 获取借条列表
export const getBorrowList = (params) => {
  return request({
    url: '/borrow/list',
    method: 'GET',
    data: params
  })
}
