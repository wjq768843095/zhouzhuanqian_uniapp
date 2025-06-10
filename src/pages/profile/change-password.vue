<template>
	<view class="container">
		<view class="content">
			<view class="header">
				<text class="title">修改登录密码</text>
				<text class="subtitle">为了您的账户安全，请定期修改密码</text>
			</view>

			<view class="form-container">
				<view class="form-item">
					<view class="input-label">
						<text class="label-text">当前密码</text>
						<text class="required">*</text>
					</view>
					<view class="input-wrapper" :class="{ 'input-focus': focusField === 'currentPassword', 'input-error': errors.currentPassword }">
						<view class="input-icon">
							<text class="icon">🔒</text>
						</view>
						<input
							class="input-field"
							:type="showCurrentPassword ? 'text' : 'password'"
							placeholder="请输入当前密码"
							v-model="formData.currentPassword"
							maxlength="20"
							@focus="focusField = 'currentPassword'"
							@blur="focusField = ''"
						/>
						<view class="toggle-password" @click="toggleCurrentPassword">
							<text class="toggle-icon">{{ showCurrentPassword ? '👁️' : '👁️‍🗨️' }}</text>
						</view>
					</view>
					<text v-if="errors.currentPassword" class="error-text">{{ errors.currentPassword }}</text>
				</view>

				<view class="form-item">
					<view class="input-label">
						<text class="label-text">新密码</text>
						<text class="required">*</text>
					</view>
					<view class="input-wrapper" :class="{ 'input-focus': focusField === 'newPassword', 'input-error': errors.newPassword }">
						<view class="input-icon">
							<text class="icon">🔐</text>
						</view>
						<input
							class="input-field"
							:type="showNewPassword ? 'text' : 'password'"
							placeholder="请设置新密码，6-20位"
							v-model="formData.newPassword"
							maxlength="20"
							@focus="focusField = 'newPassword'"
							@blur="focusField = ''"
						/>
						<view class="toggle-password" @click="toggleNewPassword">
							<text class="toggle-icon">{{ showNewPassword ? '👁️' : '👁️‍🗨️' }}</text>
						</view>
					</view>
					<text v-if="errors.newPassword" class="error-text">{{ errors.newPassword }}</text>
				</view>

				<view class="form-item">
					<view class="input-label">
						<text class="label-text">确认新密码</text>
						<text class="required">*</text>
					</view>
					<view class="input-wrapper" :class="{ 'input-focus': focusField === 'confirmPassword', 'input-error': errors.confirmPassword }">
						<view class="input-icon">
							<text class="icon">🔐</text>
						</view>
						<input
							class="input-field"
							:type="showConfirmPassword ? 'text' : 'password'"
							placeholder="请再次输入新密码"
							v-model="formData.confirmPassword"
							maxlength="20"
							@focus="focusField = 'confirmPassword'"
							@blur="focusField = ''"
						/>
						<view class="toggle-password" @click="toggleConfirmPassword">
							<text class="toggle-icon">{{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}</text>
						</view>
					</view>
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
	import { changePassword } from '@/api/auth'
	import { validatePassword } from '@/utils/validate'

	export default {
		data() {
			return {
				formData: {
					currentPassword: '',
					newPassword: '',
					confirmPassword: ''
				},
				errors: {},
				focusField: '',
				showCurrentPassword: false,
				showNewPassword: false,
				showConfirmPassword: false,
				isLoading: false
			}
		},
		methods: {
			// 切换当前密码可见性
			toggleCurrentPassword() {
				this.showCurrentPassword = !this.showCurrentPassword
			},
			
			// 切换新密码可见性
			toggleNewPassword() {
				this.showNewPassword = !this.showNewPassword
			},
			
			// 切换确认密码可见性
			toggleConfirmPassword() {
				this.showConfirmPassword = !this.showConfirmPassword
			},
			
			// 验证表单
			validateForm() {
				this.errors = {}
				let isValid = true
				
				// 验证当前密码
				if (!this.formData.currentPassword.trim()) {
					this.errors.currentPassword = '请输入当前密码'
					isValid = false
				}
				
				// 验证新密码
				if (!this.formData.newPassword.trim()) {
					this.errors.newPassword = '请输入新密码'
					isValid = false
				} else if (!validatePassword(this.formData.newPassword.trim())) {
					this.errors.newPassword = '密码长度为6-20位'
					isValid = false
				} else if (this.formData.newPassword === this.formData.currentPassword) {
					this.errors.newPassword = '新密码不能与当前密码相同'
					isValid = false
				}
				
				// 验证确认密码
				if (!this.formData.confirmPassword.trim()) {
					this.errors.confirmPassword = '请确认新密码'
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
					await changePassword({
						currentPassword: this.formData.currentPassword.trim(),
						newPassword: this.formData.newPassword.trim()
					})
					
					uni.showToast({
						title: '密码修改成功',
						icon: 'success'
					})
					
					// 延迟返回上一页
					setTimeout(() => {
						uni.navigateBack()
					}, 1500)
					
				} catch (error) {
					console.error('修改密码失败:', error)
					
					// 处理特定错误
					if (error.message && error.message.includes('当前密码')) {
						this.errors.currentPassword = '当前密码错误'
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

	.input-wrapper {
		display: flex;
		align-items: center;
		background-color: #f8f9fa;
		border-radius: 16rpx;
		padding: 0 20rpx;
		height: 100rpx;
		transition: all 0.3s ease;
	}

	.input-wrapper.input-focus {
		background-color: #fff;
		border: 2rpx solid #667eea;
		box-shadow: 0 0 0 6rpx rgba(102, 126, 234, 0.1);
	}

	.input-wrapper.input-error {
		border: 2rpx solid #ff4757;
		background-color: #fff5f5;
	}

	.input-icon {
		margin-right: 20rpx;
	}

	.icon {
		font-size: 36rpx;
		color: #667eea;
	}

	.input-field {
		flex: 1;
		font-size: 32rpx;
		color: #333;
		background: transparent;
		border: none;
		outline: none;
	}

	.toggle-password {
		margin-left: 20rpx;
		padding: 10rpx;
	}

	.toggle-icon {
		font-size: 32rpx;
		color: #999;
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
