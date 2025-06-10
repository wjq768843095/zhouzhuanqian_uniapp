<template>
	<view class="login-container">
		<!-- 背景装饰 -->
		<view class="bg-decoration">
			<view class="circle circle-1"></view>
			<view class="circle circle-2"></view>
			<view class="circle circle-3"></view>
		</view>

		<!-- 主要内容 -->
		<view class="main-content">
			<!-- 头部 -->
			<view class="header">
				<view class="logo-container">
					<image class="logo" src="/static/logo.svg" mode="aspectFit"></image>
				</view>
				<text class="welcome-text">欢迎回来</text>
				<text class="subtitle">登录您的账户继续使用</text>
			</view>

			<!-- 表单 -->
			<view class="form-container">
				<view class="form-item">
					<view class="input-label">
						<text class="label-text">账号</text>
					</view>
					<view class="input-wrapper" :class="{ 'input-focus': focusField === 'account' }">
						<view class="input-icon">
							<text class="icon">👤</text>
						</view>
						<input
							class="input-field"
							type="text"
							placeholder="请输入您的账号"
							v-model="formData.account"
							maxlength="20"
							@focus="focusField = 'account'"
							@blur="focusField = ''"
						/>
					</view>
				</view>

				<view class="form-item">
					<view class="input-label">
						<text class="label-text">密码</text>
					</view>
					<view class="input-wrapper" :class="{ 'input-focus': focusField === 'password' }">
						<view class="input-icon">
							<text class="icon">🔒</text>
						</view>
						<input
							class="input-field"
							:type="showPassword ? 'text' : 'password'"
							placeholder="请输入您的密码"
							v-model="formData.password"
							maxlength="20"
							@focus="focusField = 'password'"
							@blur="focusField = ''"
						/>
						<view class="toggle-password" @click="togglePassword">
							<text class="toggle-icon">{{ showPassword ? '👁️' : '👁️‍🗨️' }}</text>
						</view>
					</view>
				</view>

				<button class="login-btn" @click="handleLogin" :disabled="isLoading">
					<text class="btn-text">{{ isLoading ? '登录中...' : '立即登录' }}</text>
					<view v-if="isLoading" class="loading-spinner"></view>
				</button>

				<view class="form-footer">
					<view class="divider">
						<view class="divider-line"></view>
						<text class="divider-text">或</text>
						<view class="divider-line"></view>
					</view>
					<view class="register-section">
						<text class="register-text">还没有账号？</text>
						<text class="register-link" @click="goToRegister">立即注册</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { login } from '@/api/auth'
	import { validateAccount, validatePassword } from '@/utils/validate'
	
	export default {
		data() {
			return {
				formData: {
					account: '',
					password: ''
				},
				showPassword: false,
				isLoading: false,
				focusField: ''
			}
		},
		methods: {
			// 切换密码显示状态
			togglePassword() {
				this.showPassword = !this.showPassword
			},
			
			// 表单验证
			validateForm() {
				if (!this.formData.account.trim()) {
					uni.showToast({
						title: '请输入账号',
						icon: 'none'
					})
					return false
				}
				
				if (!this.formData.password.trim()) {
					uni.showToast({
						title: '请输入密码',
						icon: 'none'
					})
					return false
				}
				
				return true
			},
			
			// 处理登录
			async handleLogin() {
				if (!this.validateForm()) return
				
				this.isLoading = true
				
				try {
					const res = await login({
						account: this.formData.account.trim(),
						password: this.formData.password.trim()
					})
					
					// 保存token和用户信息
					uni.setStorageSync('token', res.data.token)
					uni.setStorageSync('userInfo', res.data.userInfo)
					
					uni.showToast({
						title: '登录成功',
						icon: 'success'
					})
					
					// 跳转到首页
					setTimeout(() => {
						uni.switchTab({
							url: '/pages/index/index'
						})
					}, 1500)
					
				} catch (error) {
					console.error('登录失败:', error)
				} finally {
					this.isLoading = false
				}
			},
			
			// 跳转到注册页面
			goToRegister() {
				uni.navigateTo({
					url: '/pages/auth/register'
				})
			}
		}
	}
</script>

<style scoped>
	.login-container {
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

	.circle {
		position: absolute;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.1);
		animation: float 6s ease-in-out infinite;
	}

	.circle-1 {
		width: 200rpx;
		height: 200rpx;
		top: 10%;
		right: -50rpx;
		animation-delay: 0s;
	}

	.circle-2 {
		width: 150rpx;
		height: 150rpx;
		top: 60%;
		left: -30rpx;
		animation-delay: 2s;
	}

	.circle-3 {
		width: 100rpx;
		height: 100rpx;
		top: 30%;
		left: 20%;
		animation-delay: 4s;
	}

	@keyframes float {
		0%, 100% { transform: translateY(0px) rotate(0deg); }
		50% { transform: translateY(-20px) rotate(180deg); }
	}

	/* 主要内容 */
	.main-content {
		position: relative;
		z-index: 1;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		padding: 0 60rpx;
	}

	/* 头部样式 */
	.header {
		text-align: center;
		padding: 120rpx 0 80rpx;
	}

	.logo-container {
		width: 140rpx;
		height: 140rpx;
		margin: 0 auto 40rpx;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		backdrop-filter: blur(10px);
		border: 2rpx solid rgba(255, 255, 255, 0.3);
	}

	.logo {
		width: 80rpx;
		height: 80rpx;
	}

	.welcome-text {
		display: block;
		font-size: 52rpx;
		font-weight: 700;
		color: #fff;
		margin-bottom: 15rpx;
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
		padding: 80rpx 60rpx;
		box-shadow: 0 -10rpx 40rpx rgba(0, 0, 0, 0.1);
	}

	/* 表单项 */
	.form-item {
		margin-bottom: 50rpx;
	}

	.input-label {
		margin-bottom: 20rpx;
	}

	.label-text {
		font-size: 28rpx;
		font-weight: 600;
		color: #333;
	}

	.input-wrapper {
		display: flex;
		align-items: center;
		background: #f8f9fa;
		border-radius: 20rpx;
		padding: 0 30rpx;
		height: 100rpx;
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
		box-shadow: 0 0 0 8rpx rgba(102, 126, 234, 0.1);
		transform: translateY(-2rpx);
	}

	.input-icon {
		width: 50rpx;
		height: 50rpx;
		border-radius: 50%;
		background: linear-gradient(135deg, #667eea, #764ba2);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 25rpx;
		position: relative;
		z-index: 1;
	}

	.input-icon .icon {
		font-size: 28rpx;
		color: #fff;
	}

	.input-field {
		flex: 1;
		font-size: 32rpx;
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
		font-size: 32rpx;
		color: #666;
	}

	/* 登录按钮 */
	.login-btn {
		width: 100%;
		height: 100rpx;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 20rpx;
		border: none;
		margin-top: 40rpx;
		position: relative;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 8rpx 25rpx rgba(102, 126, 234, 0.3);
		transition: all 0.3s ease;
	}

	.login-btn:not(:disabled):active {
		transform: translateY(2rpx);
		box-shadow: 0 4rpx 15rpx rgba(102, 126, 234, 0.3);
	}

	.login-btn:disabled {
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
		margin-top: 60rpx;
	}

	.divider {
		display: flex;
		align-items: center;
		margin-bottom: 40rpx;
	}

	.divider-line {
		flex: 1;
		height: 1rpx;
		background: #e0e0e0;
	}

	.divider-text {
		margin: 0 30rpx;
		font-size: 24rpx;
		color: #999;
	}

	.register-section {
		text-align: center;
	}

	.register-text {
		font-size: 28rpx;
		color: #666;
	}

	.register-link {
		font-size: 28rpx;
		color: #667eea;
		font-weight: 600;
		margin-left: 10rpx;
	}
</style>
