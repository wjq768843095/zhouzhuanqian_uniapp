// 表单验证工具

// 验证身份证号
export const validateIdCard = (idCard) => {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return reg.test(idCard)
}

// 验证手机号
export const validatePhone = (phone) => {
  const reg = /^1[3-9]\d{9}$/
  return reg.test(phone)
}

// 验证账号格式（包含大写字母、小写字母和数字）
export const validateAccount = (account) => {
  const hasUpper = /[A-Z]/.test(account)
  const hasLower = /[a-z]/.test(account)
  const hasNumber = /\d/.test(account)
  const validLength = account.length >= 6 && account.length <= 20
  
  return hasUpper && hasLower && hasNumber && validLength
}

// 验证密码强度
export const validatePassword = (password) => {
  return password.length >= 6 && password.length <= 20
}

// 验证签约密码（6位数字）
export const validateSignPassword = (password) => {
  const reg = /^\d{6}$/
  return reg.test(password)
}

// 验证姓名
export const validateName = (name) => {
  const reg = /^[\u4e00-\u9fa5]{2,10}$/
  return reg.test(name)
}

// 验证金额
export const validateAmount = (amount) => {
  const reg = /^\d+(\.\d{1,2})?$/
  return reg.test(amount) && parseFloat(amount) > 0
}

// 格式化金额显示
export const formatAmount = (amount) => {
  return parseFloat(amount).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// 格式化日期
export const formatDate = (date) => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 格式化身份证号显示（中间部分用*代替）
export const formatIdCard = (idCard) => {
  if (!idCard || idCard.length < 8) return idCard
  return idCard.substring(0, 4) + '****' + idCard.substring(idCard.length - 4)
}
