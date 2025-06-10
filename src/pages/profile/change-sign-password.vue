<template>
	<view class="container">
		<view class="content">
			<view class="header">
				<text class="title">修改签约密码</text>
				<text class="subtitle">签约密码用于合同签署验证，请妥善保管</text>
			</view>

			<view class="form-container">
				<view class="form-item">
					<view class="input-label">
						<text class="label-text">当前签约密码</text>
						<text class="required">*</text>
					</view>
					<PasswordInput v-model="formData.currentPassword" />
					<text v-if="errors.currentPassword" class="error-text">{{ errors.currentPassword }}</text>
				</view>

				<view class="form-item">
					<view class="input-label">
						<text class="label-text">新签约密码</text>
						<text class="required">*</text>
						<text class="label-tip">请设置6位数字密码</text>
					</view>
					<PasswordInput v-model="formData.newPassword" />
					<text v-if="errors.newPassword" class="error-text">{{ errors.newPassword }}</text>
				</view>

				<view class="form-item">
					<view class="input-label">
						<text class="label-text">确认新签约密码</text>
						<text class="required">*</text>
					</view>
					<PasswordInput v-model="formData.confirmPassword" />
					<text v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</text>
				</view>

				<button class="submit-btn" @click="handleSubmit" :disabled="isLoading">
					<text class="btn-text">{{ isLoading ? '修改中...' : '确认修改' }}</text>
					<view v-if="isLoading" class="loading-spinner"></view>
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	import { changeSignPassword } from '@/api/auth'
	import { validateSignPassword } from '@/utils/validate'
	import PasswordInput from '@/components/PasswordInput.vue'

	export default {
		components: {
			PasswordInput
		},
		data() {
			return {
				formData: {
					currentPassword: '',
					newPassword: '',
					confirmPassword: ''
				},
				errors: {},
				isLoading: false
			}
		},
		methods: {
			// 验证表单
			validateForm() {
				this.errors = {}
				let isValid = true
				
				// 验证当前签约密码
				if (!this.formData.currentPassword.trim()) {
					this.errors.currentPassword = '请输入当前签约密码'
					isValid = false
				} else if (!validateSignPassword(this.formData.currentPassword.trim())) {
					this.errors.currentPassword = '签约密码必须为6位数字'
					isValid = false
				}
				
				// 验证新签约密码
				if (!this.formData.newPassword.trim()) {
					this.errors.newPassword = '请输入新签约密码'
					isValid = false
				} else if (!validateSignPassword(this.formData.newPassword.trim())) {
					this.errors.newPassword = '签约密码必须为6位数字'
					isValid = false
				} else if (this.formData.newPassword === this.formData.currentPassword) {
					this.errors.newPassword = '新签约密码不能与当前密码相同'
					isValid = false
				}
				
				// 验证确认签约密码
				if (!this.formData.confirmPassword.trim()) {
					this.errors.confirmPassword = '请确认新签约密码'
					isValid = false
				} else if (this.formData.newPassword !== this.formData.confirmPassword) {
					this.errors.confirmPassword = '两次输入的密码不一致'
					isValid = false
				}
				
				return isValid
			},
			
			// 提交表单
			async handleSubmit() {
				if (!this.validateForm()) {
					return
				}
				
				this.isLoading = true
				
				try {
					await changeSignPassword({
						currentSignPassword: this.formData.currentPassword.trim(),
						newSignPassword: this.formData.newPassword.trim()
					})
					
					uni.showToast({
						title: '签约密码修改成功',
						icon: 'success'
					})
					
					// 延迟返回上一页
					setTimeout(() => {
						uni.navigateBack()
					}, 1500)
					
				} catch (error) {
					console.error('修改签约密码失败:', error)
					
					// 处理特定错误
					if (error.message && error.message.includes('当前密码')) {
						this.errors.currentPassword = '当前签约密码错误'
					} else {
						uni.showToast({
							title: error.message || '修改失败，请重试',
							icon: 'none'
						})
					}
				} finally {
					this.isLoading = false
				}
			}
		}
	}
</script>

<style scoped>
	.container {
		background-color: #f5f5f5;
		min-height: 100vh;
	}

	.content {
		padding: 40rpx 30rpx;
	}

	.header {
		text-align: center;
		margin-bottom: 60rpx;
	}

	.title {
		font-size: 48rpx;
		font-weight: 600;
		color: #333;
		display: block;
		margin-bottom: 20rpx;
	}

	.subtitle {
		font-size: 28rpx;
		color: #666;
		line-height: 1.5;
	}

	.form-container {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 40rpx 30rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
	}

	.form-item {
		margin-bottom: 40rpx;
	}

	.form-item:last-child {
		margin-bottom: 0;
	}

	.input-label {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
		flex-wrap: wrap;
	}

	.label-text {
		font-size: 32rpx;
		color: #333;
		font-weight: 500;
	}

	.required {
		color: #ff4757;
		margin-left: 8rpx;
		font-size: 32rpx;
	}

	.label-tip {
		font-size: 24rpx;
		color: #999;
		margin-left: 20rpx;
	}

	.error-text {
		color: #ff4757;
		font-size: 24rpx;
		margin-top: 10rpx;
		display: block;
	}

	.submit-btn {
		width: 100%;
		height: 100rpx;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 16rpx;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 40rpx;
		transition: all 0.3s ease;
	}

	.submit-btn:disabled {
		opacity: 0.6;
	}

	.submit-btn:not(:disabled):active {
		transform: scale(0.98);
	}

	.btn-text {
		color: #fff;
		font-size: 32rpx;
		font-weight: 600;
	}

	.loading-spinner {
		width: 32rpx;
		height: 32rpx;
		border: 4rpx solid rgba(255, 255, 255, 0.3);
		border-top: 4rpx solid #fff;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-left: 20rpx;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
</style>
