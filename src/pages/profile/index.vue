<template>
	<view class="container">
		<!-- 宣传图 -->
		<view class="promo-banner">
			<image class="promo-image" src="/static/profile-banner.svg" mode="aspectFill"></image>
			<view class="promo-overlay">
				<text class="promo-text">专业可靠的金融服务平台</text>
			</view>
		</view>

		<!-- 用户信息卡片 -->
		<view class="user-card">
			<view class="user-avatar">
				<text class="avatar-text">{{ userInfo.name ? userInfo.name.charAt(0) : '用' }}</text>
			</view>
			<view class="user-info">
				<text class="user-name">{{ userInfo.name || '未登录' }}</text>
				<text class="user-id">ID: {{ formatIdCard(userInfo.idCard) || '***' }}</text>
			</view>
			<view class="user-amount">
				<text class="amount-label">已借金额</text>
				<text class="amount-value">¥{{ formatAmount(userInfo.borrowedAmount || 0) }}</text>
			</view>
		</view>

		<!-- 功能菜单 -->
		<view class="menu-section">
			<view class="menu-item" @click="goToContractList">
				<view class="menu-icon">
					<text class="icon">📄</text>
				</view>
				<text class="menu-text">我的合同</text>
				<text class="menu-arrow">></text>
			</view>

			<view class="menu-item" @click="goToChangePassword">
				<view class="menu-icon">
					<text class="icon">🔒</text>
				</view>
				<text class="menu-text">修改密码</text>
				<text class="menu-arrow">></text>
			</view>

			<view class="menu-item" @click="goToChangeSignPassword">
				<view class="menu-icon">
					<text class="icon">🔐</text>
				</view>
				<text class="menu-text">修改签约密码</text>
				<text class="menu-arrow">></text>
			</view>
		</view>

		<!-- 关于我们 -->
		<view class="about-section">
			<view class="about-item" @click="goToAbout">
				<view class="about-icon">
					<text class="icon">ℹ️</text>
				</view>
				<text class="about-text">关于我们</text>
				<text class="about-arrow">></text>
			</view>
			
			<view class="about-item" @click="contactService">
				<view class="about-icon">
					<text class="icon">📞</text>
				</view>
				<text class="about-text">联系客服</text>
				<text class="about-arrow">></text>
			</view>
		</view>

		<!-- 退出登录 -->
		<view class="logout-section">
			<button class="logout-btn" @click="handleLogout">退出登录</button>
		</view>
	</view>
</template>

<script>
	import { getUserInfo } from '@/api/auth'
	import { formatAmount, formatIdCard } from '@/utils/validate'
	
	export default {
		data() {
			return {
				userInfo: {}
			}
		},
		onLoad() {
			this.loadUserInfo()
		},
		onShow() {
			this.loadUserInfo()
		},
		methods: {
			// 加载用户信息
			async loadUserInfo() {
				try {
					// 先从本地存储获取
					const localUserInfo = uni.getStorageSync('userInfo')
					if (localUserInfo) {
						this.userInfo = localUserInfo
					}
					
					// 再从服务器获取最新信息
					const res = await getUserInfo()
					this.userInfo = res.data
					
					// 更新本地存储
					uni.setStorageSync('userInfo', res.data)
					
				} catch (error) {
					console.error('获取用户信息失败:', error)
					// 如果获取失败，检查是否有本地存储的信息
					const localUserInfo = uni.getStorageSync('userInfo')
					if (localUserInfo) {
						this.userInfo = localUserInfo
					}
				}
			},
			
			// 跳转到合同列表
			goToContractList() {
				uni.switchTab({
					url: '/pages/contract/list'
				})
			},
			

			
			// 跳转到修改密码
			goToChangePassword() {
				uni.navigateTo({
					url: '/pages/profile/change-password'
				})
			},

			// 跳转到修改签约密码
			goToChangeSignPassword() {
				uni.navigateTo({
					url: '/pages/profile/change-sign-password'
				})
			},
			
			// 跳转到关于我们
			goToAbout() {
				uni.navigateTo({
					url: '/pages/about/index'
				})
			},
			
			// 联系客服
			contactService() {
				uni.showModal({
					title: '联系客服',
					content: '客服电话：400-123-4567\n工作时间：9:00-18:00\n\n或者您可以通过首页的在线客服功能联系我们',
					showCancel: false
				})
			},
			
			// 退出登录
			handleLogout() {
				uni.showModal({
					title: '确认退出',
					content: '确定要退出登录吗？',
					success: (res) => {
						if (res.confirm) {
							// 清除本地存储
							uni.removeStorageSync('token')
							uni.removeStorageSync('userInfo')
							
							// 重置用户信息
							this.userInfo = {}
							
							uni.showToast({
								title: '已退出登录',
								icon: 'success'
							})
							
							// 跳转到登录页
							setTimeout(() => {
								uni.reLaunch({
									url: '/pages/auth/login'
								})
							}, 1500)
						}
					}
				})
			},
			
			// 格式化金额
			formatAmount,
			
			// 格式化身份证号
			formatIdCard
		}
	}
</script>

<style scoped>
	.container {
		background-color: #f5f5f5;
		min-height: 100vh;
		padding-bottom: 60rpx;
	}

	/* 宣传图样式 */
	.promo-banner {
		position: relative;
		height: 300rpx;
		overflow: hidden;
	}

	.promo-image {
		width: 100%;
		height: 100%;
	}

	.promo-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
		padding: 40rpx 30rpx 30rpx;
	}

	.promo-text {
		color: #fff;
		font-size: 32rpx;
		font-weight: 600;
		text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
	}

	/* 用户信息卡片样式 */
	.user-card {
		background-color: #fff;
		margin: 30rpx;
		border-radius: 20rpx;
		padding: 40rpx 30rpx;
		display: flex;
		align-items: center;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
	}

	.user-avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 30rpx;
	}

	.avatar-text {
		color: #fff;
		font-size: 48rpx;
		font-weight: 600;
	}

	.user-info {
		flex: 1;
	}

	.user-name {
		display: block;
		font-size: 36rpx;
		font-weight: 600;
		color: #333;
		margin-bottom: 10rpx;
	}

	.user-id {
		display: block;
		font-size: 26rpx;
		color: #666;
	}

	.user-amount {
		text-align: right;
	}

	.amount-label {
		display: block;
		font-size: 24rpx;
		color: #666;
		margin-bottom: 8rpx;
	}

	.amount-value {
		display: block;
		font-size: 32rpx;
		font-weight: 700;
		color: #ff6b35;
	}

	/* 功能菜单样式 */
	.menu-section {
		background-color: #fff;
		margin: 30rpx;
		border-radius: 20rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
	}

	.menu-item {
		display: flex;
		align-items: center;
		padding: 35rpx 30rpx;
		border-bottom: 1rpx solid #f5f5f5;
		transition: background-color 0.3s ease;
	}

	.menu-item:last-child {
		border-bottom: none;
	}

	.menu-item:active {
		background-color: #f8f9fa;
	}

	.menu-icon {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		background-color: #f8f9fa;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 30rpx;
	}

	.menu-icon .icon {
		font-size: 36rpx;
	}

	.menu-text {
		flex: 1;
		font-size: 30rpx;
		color: #333;
		font-weight: 500;
	}

	.menu-arrow {
		font-size: 28rpx;
		color: #ccc;
	}

	/* 关于我们样式 */
	.about-section {
		background-color: #fff;
		margin: 30rpx;
		border-radius: 20rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
	}

	.about-item {
		display: flex;
		align-items: center;
		padding: 35rpx 30rpx;
		border-bottom: 1rpx solid #f5f5f5;
		transition: background-color 0.3s ease;
	}

	.about-item:last-child {
		border-bottom: none;
	}

	.about-item:active {
		background-color: #f8f9fa;
	}

	.about-icon {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		background-color: #f8f9fa;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 30rpx;
	}

	.about-icon .icon {
		font-size: 36rpx;
	}

	.about-text {
		flex: 1;
		font-size: 30rpx;
		color: #333;
		font-weight: 500;
	}

	.about-arrow {
		font-size: 28rpx;
		color: #ccc;
	}

	/* 退出登录样式 */
	.logout-section {
		margin: 30rpx;
		margin-bottom: 0;
	}

	.logout-btn {
		width: 100%;
		height: 88rpx;
		background-color: #fff;
		color: #ff4757;
		font-size: 32rpx;
		font-weight: 600;
		border: 2rpx solid #ff4757;
		border-radius: 12rpx;
		transition: all 0.3s ease;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
	}

	.logout-btn:active {
		background-color: #ff4757;
		color: #fff;
	}
</style>
