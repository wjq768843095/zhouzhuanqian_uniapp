// 密码修改功能测试
import { validatePassword, validateSignPassword } from '@/utils/validate'

describe('密码修改功能测试', () => {
  describe('登录密码验证', () => {
    test('应该接受有效的密码长度', () => {
      expect(validatePassword('123456')).toBe(true)
      expect(validatePassword('12345678901234567890')).toBe(true)
    })

    test('应该拒绝过短的密码', () => {
      expect(validatePassword('12345')).toBe(false)
      expect(validatePassword('')).toBe(false)
    })

    test('应该拒绝过长的密码', () => {
      expect(validatePassword('123456789012345678901')).toBe(false)
    })
  })

  describe('签约密码验证', () => {
    test('应该接受6位数字密码', () => {
      expect(validateSignPassword('123456')).toBe(true)
      expect(validateSignPassword('000000')).toBe(true)
      expect(validateSignPassword('999999')).toBe(true)
    })

    test('应该拒绝非6位数字密码', () => {
      expect(validateSignPassword('12345')).toBe(false)
      expect(validateSignPassword('1234567')).toBe(false)
      expect(validateSignPassword('')).toBe(false)
    })

    test('应该拒绝包含非数字字符的密码', () => {
      expect(validateSignPassword('12345a')).toBe(false)
      expect(validateSignPassword('12345!')).toBe(false)
      expect(validateSignPassword('abcdef')).toBe(false)
    })
  })

  describe('密码修改表单验证', () => {
    // 模拟修改登录密码的验证逻辑
    const validateChangePasswordForm = (currentPassword, newPassword, confirmPassword) => {
      const errors = {}
      
      if (!currentPassword.trim()) {
        errors.currentPassword = '请输入当前密码'
      }
      
      if (!newPassword.trim()) {
        errors.newPassword = '请输入新密码'
      } else if (!validatePassword(newPassword.trim())) {
        errors.newPassword = '密码长度为6-20位'
      } else if (newPassword === currentPassword) {
        errors.newPassword = '新密码不能与当前密码相同'
      }
      
      if (!confirmPassword.trim()) {
        errors.confirmPassword = '请确认新密码'
      } else if (newPassword !== confirmPassword) {
        errors.confirmPassword = '两次输入的密码不一致'
      }
      
      return {
        isValid: Object.keys(errors).length === 0,
        errors
      }
    }

    test('应该通过有效的密码修改表单', () => {
      const result = validateChangePasswordForm('oldpass123', 'newpass456', 'newpass456')
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })

    test('应该拒绝空的当前密码', () => {
      const result = validateChangePasswordForm('', 'newpass456', 'newpass456')
      expect(result.isValid).toBe(false)
      expect(result.errors.currentPassword).toBe('请输入当前密码')
    })

    test('应该拒绝无效的新密码', () => {
      const result = validateChangePasswordForm('oldpass123', '123', '123')
      expect(result.isValid).toBe(false)
      expect(result.errors.newPassword).toBe('密码长度为6-20位')
    })

    test('应该拒绝与当前密码相同的新密码', () => {
      const result = validateChangePasswordForm('samepass', 'samepass', 'samepass')
      expect(result.isValid).toBe(false)
      expect(result.errors.newPassword).toBe('新密码不能与当前密码相同')
    })

    test('应该拒绝不匹配的确认密码', () => {
      const result = validateChangePasswordForm('oldpass123', 'newpass456', 'different')
      expect(result.isValid).toBe(false)
      expect(result.errors.confirmPassword).toBe('两次输入的密码不一致')
    })
  })

  describe('签约密码修改表单验证', () => {
    // 模拟修改签约密码的验证逻辑
    const validateChangeSignPasswordForm = (currentPassword, newPassword, confirmPassword) => {
      const errors = {}
      
      if (!currentPassword.trim()) {
        errors.currentPassword = '请输入当前签约密码'
      } else if (!validateSignPassword(currentPassword.trim())) {
        errors.currentPassword = '签约密码必须为6位数字'
      }
      
      if (!newPassword.trim()) {
        errors.newPassword = '请输入新签约密码'
      } else if (!validateSignPassword(newPassword.trim())) {
        errors.newPassword = '签约密码必须为6位数字'
      } else if (newPassword === currentPassword) {
        errors.newPassword = '新签约密码不能与当前密码相同'
      }
      
      if (!confirmPassword.trim()) {
        errors.confirmPassword = '请确认新签约密码'
      } else if (newPassword !== confirmPassword) {
        errors.confirmPassword = '两次输入的密码不一致'
      }
      
      return {
        isValid: Object.keys(errors).length === 0,
        errors
      }
    }

    test('应该通过有效的签约密码修改表单', () => {
      const result = validateChangeSignPasswordForm('123456', '654321', '654321')
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })

    test('应该拒绝无效格式的当前签约密码', () => {
      const result = validateChangeSignPasswordForm('12345a', '654321', '654321')
      expect(result.isValid).toBe(false)
      expect(result.errors.currentPassword).toBe('签约密码必须为6位数字')
    })

    test('应该拒绝无效格式的新签约密码', () => {
      const result = validateChangeSignPasswordForm('123456', '12345', '12345')
      expect(result.isValid).toBe(false)
      expect(result.errors.newPassword).toBe('签约密码必须为6位数字')
    })

    test('应该拒绝与当前密码相同的新签约密码', () => {
      const result = validateChangeSignPasswordForm('123456', '123456', '123456')
      expect(result.isValid).toBe(false)
      expect(result.errors.newPassword).toBe('新签约密码不能与当前密码相同')
    })
  })
})
