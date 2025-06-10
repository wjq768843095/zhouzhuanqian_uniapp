<template>
	<view class="register-container">
		<!-- 背景装饰 -->
		<view class="bg-decoration">
			<view class="wave wave-1"></view>
			<view class="wave wave-2"></view>
		</view>

		<!-- 主要内容 -->
		<view class="main-content">
			<!-- 头部 -->
			<view class="header">
				<view class="back-btn" @click="goToLogin">
					<text class="back-icon">←</text>
				</view>
				<view class="header-content">
					<text class="title">创建账户</text>
					<text class="subtitle">填写信息完成注册</text>
				</view>
			</view>

			<!-- 表单 -->
			<view class="form-container">
				<view class="form-item">
					<view class="input-label">
						<text class="label-text">真实姓名</text>
						<text class="required">*</text>
					</view>
					<view class="input-wrapper" :class="{ 'input-focus': focusField === 'name', 'input-error': errors.name }">
						<view class="input-icon">
							<text class="icon">👤</text>
						</view>
						<input
							class="input-field"
							type="text"
							placeholder="请输入您的真实姓名"
							v-model="formData.name"
							maxlength="10"
							@focus="focusField = 'name'"
							@blur="focusField = ''"
						/>
					</view>
					<text v-if="errors.name" class="error-text">{{ errors.name }}</text>
				</view>

				<view class="form-item">
					<view class="input-label">
						<text class="label-text">身份证号</text>
						<text class="required">*</text>
					</view>
					<view class="input-wrapper" :class="{ 'input-focus': focusField === 'idCard', 'input-error': errors.idCard }">
						<view class="input-icon">
							<text class="icon">🆔</text>
						</view>
						<input
							class="input-field"
							type="text"
							placeholder="请输入18位身份证号"
							v-model="formData.idCard"
							maxlength="18"
							@focus="focusField = 'idCard'"
							@blur="focusField = ''"
						/>
					</view>
					<text v-if="errors.idCard" class="error-text">{{ errors.idCard }}</text>
				</view>

				<view class="form-item">
					<view class="input-label">
						<text class="label-text">登录账号</text>
						<text class="required">*</text>
					</view>
					<view class="input-wrapper" :class="{ 'input-focus': focusField === 'account', 'input-error': errors.account }">
						<view class="input-icon">
							<text class="icon">📱</text>
						</view>
						<input
							class="input-field"
							type="text"
							placeholder="大小写字母+数字，6-20位"
							v-model="formData.account"
							maxlength="20"
							@focus="focusField = 'account'"
							@blur="focusField = ''"
						/>
					</view>
					<text v-if="errors.account" class="error-text">{{ errors.account }}</text>
				</view>

				<view class="form-item">
					<view class="input-label">
						<text class="label-text">登录密码</text>
						<text class="required">*</text>
					</view>
					<view class="input-wrapper" :class="{ 'input-focus': focusField === 'password', 'input-error': errors.password }">
						<view class="input-icon">
							<text class="icon">🔒</text>
						</view>
						<input
							class="input-field"
							:type="showPassword ? 'text' : 'password'"
							placeholder="请设置登录密码，6-20位"
							v-model="formData.password"
							maxlength="20"
							@focus="focusField = 'password'"
							@blur="focusField = ''"
						/>
						<view class="toggle-password" @click="togglePassword">
							<text class="toggle-icon">{{ showPassword ? '👁️' : '👁️‍🗨️' }}</text>
						</view>
					</view>
					<text v-if="errors.password" class="error-text">{{ errors.password }}</text>
				</view>

				<view class="form-item">
					<view class="input-label">
						<text class="label-text">确认密码</text>
						<text class="required">*</text>
					</view>
					<view class="input-wrapper" :class="{ 'input-focus': focusField === 'confirmPassword', 'input-error': errors.confirmPassword }">
						<view class="input-icon">
							<text class="icon">🔐</text>
						</view>
						<input
							class="input-field"
							:type="showConfirmPassword ? 'text' : 'password'"
							placeholder="请再次输入登录密码"
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

				<view class="form-item">
					<view class="input-label">
						<text class="label-text">签约密码</text>
						<text class="required">*</text>
						<text class="label-tip">用于合同签署验证</text>
					</view>
					<PasswordInput v-model="formData.signPassword" />
					<text v-if="errors.signPassword" class="error-text">{{ errors.signPassword }}</text>
				</view>

				<view class="form-item">
					<view class="input-label">
						<text class="label-text">确认签约密码</text>
						<text class="required">*</text>
					</view>
					<PasswordInput v-model="formData.confirmSignPassword" />
					<text v-if="errors.confirmSignPassword" class="error-text">{{ errors.confirmSignPassword }}</text>
				</view>

				<button class="register-btn" @click="handleRegister" :disabled="isLoading">
					<text class="btn-text">{{ isLoading ? '注册中...' : '立即注册' }}</text>
					<view v-if="isLoading" class="loading-spinner"></view>
				</button>

				<view class="form-footer">
					<view class="login-section">
						<text class="login-text">已有账号？</text>
						<text class="login-link" @click="goToLogin">立即登录</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { register } from '@/api/auth'
	import { validateName, validateIdCard, validateAccount, validatePassword, validateSignPassword } from '@/utils/validate'
	import PasswordInput from '@/components/PasswordInput.vue'

	export default {
		components: {
			PasswordInput
		},
		data() {
			return {
				formData: {
					name: '',
					idCard: '',
					account: '',
					password: '',
					confirmPassword: '',
					signPassword: '',
					confirmSignPassword: ''
				},
				errors: {},
				showPassword: false,
				showConfirmPassword: false,
				isLoading: false,
				focusField: ''
			}
		},
		methods: {
			// 切换密码显示状态
			togglePassword() {
				this.showPassword = !this.showPassword
			},

			toggleConfirmPassword() {
				this.showConfirmPassword = !this.showConfirmPassword
			},


			
			// 表单验证
			validateForm() {
				this.errors = {}
				let isValid = true
				
				// 验证姓名
				if (!this.formData.name.trim()) {
					this.errors.name = '请输入姓名'
					isValid = false
				} else if (!validateName(this.formData.name.trim())) {
					this.errors.name = '请输入正确的中文姓名'
					isValid = false
				}
				
				// 验证身份证号
				if (!this.formData.idCard.trim()) {
					this.errors.idCard = '请输入身份证号'
					isValid = false
				} else if (!validateIdCard(this.formData.idCard.trim())) {
					this.errors.idCard = '请输入正确的身份证号'
					isValid = false
				}
				
				// 验证账号
				if (!this.formData.account.trim()) {
					this.errors.account = '请输入账号'
					isValid = false
				} else if (!validateAccount(this.formData.account.trim())) {
					this.errors.account = '账号必须包含大小写字母和数字，6-20位'
					isValid = false
				}
				
				// 验证登录密码
				if (!this.formData.password.trim()) {
					this.errors.password = '请输入登录密码'
					isValid = false
				} else if (!validatePassword(this.formData.password.trim())) {
					this.errors.password = '密码长度为6-20位'
					isValid = false
				}
				
				// 验证确认登录密码
				if (!this.formData.confirmPassword.trim()) {
					this.errors.confirmPassword = '请确认登录密码'
					isValid = false
				} else if (this.formData.password !== this.formData.confirmPassword) {
					this.errors.confirmPassword = '两次输入的密码不一致'
					isValid = false
				}
				
				// 验证签约密码
				if (!this.formData.signPassword.trim()) {
					this.errors.signPassword = '请输入签约密码'
					isValid = false
				} else if (!validateSignPassword(this.formData.signPassword.trim())) {
					this.errors.signPassword = '签约密码必须为6位数字'
					isValid = false
				}
				
				// 验证确认签约密码
				if (!this.formData.confirmSignPassword.trim()) {
					this.errors.confirmSignPassword = '请确认签约密码'
					isValid = false
				} else if (this.formData.signPassword !== this.formData.confirmSignPassword) {
					this.errors.confirmSignPassword = '两次输入的签约密码不一致'
					isValid = false
				}
				
				return isValid
			},
			
			// 处理注册
			async handleRegister() {
				if (!this.validateForm()) return
				
				this.isLoading = true
				
				try {
					const res = await register({
						name: this.formData.name.trim(),
						idCard: this.formData.idCard.trim(),
						account: this.formData.account.trim(),
						password: this.formData.password.trim(),
						signPassword: this.formData.signPassword.trim()
					})
					
					uni.showToast({
						title: '注册成功',
						icon: 'success'
					})
					
					// 跳转到登录页面
					setTimeout(() => {
						uni.navigateBack()
					}, 1500)
					
				} catch (error) {
					console.error('注册失败:', error)
				} finally {
					this.isLoading = false
				}
			},
			
			// 跳转到登录页面
			goToLogin() {
				uni.navigateBack()
			}
		}
	}
</script>

<style scoped>
	.register-container {
		min-height: 100vh;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		position: relative;
		overflow: hidden;
	}

	/* 背景装饰 */
	.bg-decoration {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		pointer-events: none;
	}

	.wave {
		position: absolute;
		width: 200%;
		height: 200rpx;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 50%;
		animation: wave 8s ease-in-out infinite;
	}

	.wave-1 {
		top: 20%;
		left: -50%;
		animation-delay: 0s;
	}

	.wave-2 {
		top: 60%;
		right: -50%;
		animation-delay: 4s;
	}

	@keyframes wave {
		0%, 100% { transform: translateX(0) rotate(0deg); }
		50% { transform: translateX(50px) rotate(180deg); }
	}

	/* 主要内容 */
	.main-content {
		position: relative;
		z-index: 1;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	/* 头部样式 */
	.header {
		display: flex;
		align-items: center;
		padding: 80rpx 60rpx 40rpx;
	}

	.back-btn {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.2);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 30rpx;
		backdrop-filter: blur(10px);
		border: 1rpx solid rgba(255, 255, 255, 0.3);
	}

	.back-icon {
		font-size: 32rpx;
		color: #fff;
		font-weight: bold;
	}

	.header-content {
		flex: 1;
	}

	.title {
		display: block;
		font-size: 48rpx;
		font-weight: 700;
		color: #fff;
		margin-bottom: 10rpx;
		text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
	}

	.subtitle {
		display: block;
		font-size: 28rpx;
		color: rgba(255, 255, 255, 0.8);
	}

	/* 表单容器 */
	.form-container {
		flex: 1;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(20px);
		border-radius: 40rpx 40rpx 0 0;
		padding: 60rpx 60rpx 80rpx;
		box-shadow: 0 -10rpx 40rpx rgba(0, 0, 0, 0.1);
		margin-top: 20rpx;
	}

	/* 表单项 */
	.form-item {
		margin-bottom: 45rpx;
	}

	.input-label {
		display: flex;
		align-items: center;
		margin-bottom: 15rpx;
	}

	.label-text {
		font-size: 28rpx;
		font-weight: 600;
		color: #333;
	}

	.required {
		color: #ff4757;
		font-size: 28rpx;
		margin-left: 5rpx;
	}

	.label-tip {
		font-size: 24rpx;
		color: #999;
		margin-left: 15rpx;
	}

	.input-wrapper {
		display: flex;
		align-items: center;
		background: #f8f9fa;
		border-radius: 20rpx;
		padding: 0 25rpx;
		height: 90rpx;
		border: 2rpx solid transparent;
		transition: all 0.3s ease;
		position: relative;
		overflow: hidden;
	}

	.input-wrapper::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg, #667eea, #764ba2);
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.input-wrapper.input-focus::before {
		opacity: 0.1;
	}

	.input-wrapper.input-focus {
		border-color: #667eea;
		background: #fff;
		box-shadow: 0 0 0 6rpx rgba(102, 126, 234, 0.1);
		transform: translateY(-2rpx);
	}

	.input-wrapper.input-error {
		border-color: #ff4757;
		background: #fff5f5;
	}

	.input-icon {
		width: 45rpx;
		height: 45rpx;
		border-radius: 50%;
		background: linear-gradient(135deg, #667eea, #764ba2);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 20rpx;
		position: relative;
		z-index: 1;
	}

	.input-icon .icon {
		font-size: 24rpx;
		color: #fff;
	}

	.input-field {
		flex: 1;
		font-size: 30rpx;
		color: #333;
		background-color: transparent;
		position: relative;
		z-index: 1;
	}

	.toggle-password {
		padding: 15rpx;
		position: relative;
		z-index: 1;
	}

	.toggle-icon {
		font-size: 28rpx;
		color: #666;
	}



	.error-text {
		display: block;
		font-size: 24rpx;
		color: #ff4757;
		margin-top: 15rpx;
		margin-left: 10rpx;
		animation: shake 0.5s ease-in-out;
	}

	@keyframes shake {
		0%, 100% { transform: translateX(0); }
		25% { transform: translateX(-5rpx); }
		75% { transform: translateX(5rpx); }
	}

	/* 注册按钮 */
	.register-btn {
		width: 100%;
		height: 100rpx;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 20rpx;
		border: none;
		margin-top: 50rpx;
		position: relative;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 8rpx 25rpx rgba(102, 126, 234, 0.3);
		transition: all 0.3s ease;
	}

	.register-btn:not(:disabled):active {
		transform: translateY(2rpx);
		box-shadow: 0 4rpx 15rpx rgba(102, 126, 234, 0.3);
	}

	.register-btn:disabled {
		opacity: 0.7;
	}

	.btn-text {
		font-size: 32rpx;
		font-weight: 600;
		color: #fff;
		margin-right: 15rpx;
	}

	.loading-spinner {
		width: 30rpx;
		height: 30rpx;
		border: 3rpx solid rgba(255, 255, 255, 0.3);
		border-top: 3rpx solid #fff;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	/* 表单底部 */
	.form-footer {
		margin-top: 50rpx;
		text-align: center;
	}

	.login-section {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.login-text {
		font-size: 28rpx;
		color: #666;
	}

	.login-link {
		font-size: 28rpx;
		color: #667eea;
		font-weight: 600;
		margin-left: 10rpx;
	}
</style>
