<template>
	<view class="container">
		<!-- 轮播图 -->
		<swiper class="banner-swiper" indicator-dots="true" autoplay="true" interval="3000" duration="500">
			<swiper-item v-for="(item, index) in bannerList" :key="index">
				<image :src="item.image" class="banner-image" mode="aspectFill"></image>
			</swiper-item>
		</swiper>

		<!-- 功能菜单 -->
		<view class="menu-grid">
			<view class="menu-item" @click="goToBorrow">
				<view class="menu-icon">
					<text class="iconfont icon-borrow">📝</text>
				</view>
				<text class="menu-text">打借条</text>
			</view>

			<view class="menu-item" @click="goToCustomerService">
				<view class="menu-icon">
					<text class="iconfont icon-service">💬</text>
				</view>
				<text class="menu-text">在线客服</text>
			</view>

			<view class="menu-item" @click="goToLegalConsult">
				<view class="menu-icon">
					<text class="iconfont icon-legal">⚖️</text>
				</view>
				<text class="menu-text">法律咨询</text>
			</view>

			<view class="menu-item" @click="goToContract">
				<view class="menu-icon">
					<text class="iconfont icon-contract">📄</text>
				</view>
				<text class="menu-text">我的合同</text>
			</view>
		</view>

		<!-- 最近合同 -->
		<view class="recent-section">
			<view class="section-title">
				<text>最近合同</text>
				<text class="more-btn" @click="goToContract">查看更多</text>
			</view>

			<view v-if="recentContracts.length > 0" class="contract-list">
				<view v-for="contract in recentContracts" :key="contract.id" class="contract-item" @click="goToContractDetail(contract.id)">
					<view class="contract-info">
						<text class="contract-name">{{ contract.name }}</text>
						<text class="contract-amount">¥{{ formatAmount(contract.amount) }}</text>
					</view>
					<view class="contract-meta">
						<text class="contract-date">{{ formatDate(contract.signDate) }}</text>
						<text class="contract-status" :class="getStatusClass(contract.status)">{{ getStatusText(contract.status) }}</text>
					</view>
				</view>
			</view>

			<view v-else class="empty-state">
				<text class="empty-text">暂无合同记录</text>
				<text class="empty-tip">点击上方"我的合同"查看更多</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { formatAmount, formatDate } from '@/utils/validate'
	import { getContractList } from '@/api/contract'

	export default {
		data() {
			return {
				bannerList: [
					{
						image: '/static/banner1.svg',
						title: '安全可靠的电子签约平台'
					},
					{
						image: '/static/banner2.svg',
						title: '专业的法律服务支持'
					},
					{
						image: '/static/banner3.svg',
						title: '便捷的借贷管理工具'
					}
				],
				recentContracts: []
			}
		},
		onLoad() {
			this.checkLoginStatus()
			this.loadRecentContracts()
		},
		onShow() {
			this.loadRecentContracts()
		},
		methods: {
			// 检查登录状态
			checkLoginStatus() {
				const token = uni.getStorageSync('token')
				if (!token) {
					uni.showModal({
						title: '提示',
						content: '请先登录',
						success: (res) => {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/auth/login'
								})
							}
						}
					})
				}
			},

			// 加载最近合同
			async loadRecentContracts() {
				try {
					const res = await getContractList({ page: 1, limit: 3 })
					this.recentContracts = res.data || []
				} catch (error) {
					console.error('加载合同列表失败:', error)
				}
			},

			// 跳转到打借条页面
			goToBorrow() {
				uni.navigateTo({
					url: '/pages/borrow/create'
				})
			},

			// 跳转到客服
			goToCustomerService() {
				uni.showModal({
					title: '在线客服',
					content: '客服电话：400-123-4567\n工作时间：9:00-18:00',
					showCancel: false
				})
			},

			// 跳转到法律咨询
			goToLegalConsult() {
				uni.showModal({
					title: '法律咨询',
					content: '如需法律咨询服务，请联系客服或访问我们的官方网站',
					showCancel: false
				})
			},

			// 跳转到合同列表
			goToContract() {
				uni.switchTab({
					url: '/pages/contract/list'
				})
			},

			// 跳转到合同详情
			goToContractDetail(id) {
				uni.navigateTo({
					url: `/pages/contract/detail?id=${id}`
				})
			},

			// 格式化金额
			formatAmount,

			// 格式化日期
			formatDate,

			// 获取状态样式类
			getStatusClass(status) {
				const statusMap = {
					'pending': 'status-pending',
					'signed': 'status-signed',
					'completed': 'status-completed',
					'cancelled': 'status-cancelled'
				}
				return statusMap[status] || 'status-pending'
			},

			// 获取状态文本
			getStatusText(status) {
				const statusMap = {
					'pending': '待签署',
					'signed': '已签署',
					'completed': '已完成',
					'cancelled': '已取消'
				}
				return statusMap[status] || '未知'
			}
		}
	}
</script>

<style scoped>
	.container {
		background-color: #f5f5f5;
		min-height: 100vh;
	}

	/* 轮播图样式 */
	.banner-swiper {
		height: 400rpx;
		width: 100%;
	}

	.banner-image {
		width: 100%;
		height: 100%;
	}

	/* 功能菜单样式 */
	.menu-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 30rpx;
		padding: 40rpx 30rpx;
		background-color: #fff;
		margin-top: 20rpx;
	}

	.menu-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 50rpx 20rpx;
		background-color: #f8f9fa;
		border-radius: 20rpx;
		transition: all 0.3s ease;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
	}

	.menu-item:active {
		transform: scale(0.95);
		background-color: #e9ecef;
	}

	.menu-icon {
		width: 100rpx;
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 50%;
		margin-bottom: 25rpx;
		box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
	}

	.menu-icon text {
		font-size: 45rpx;
		color: #fff;
	}

	.menu-text {
		font-size: 28rpx;
		color: #333;
		font-weight: 500;
	}

	/* 最近合同样式 */
	.recent-section {
		background-color: #fff;
		margin-top: 20rpx;
		padding: 30rpx;
	}

	.section-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
		padding-bottom: 20rpx;
		border-bottom: 1rpx solid #eee;
	}

	.section-title text {
		font-size: 32rpx;
		font-weight: 600;
		color: #333;
	}

	.more-btn {
		font-size: 26rpx !important;
		color: #007aff !important;
		font-weight: 400 !important;
	}

	.contract-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.contract-item {
		padding: 30rpx;
		background-color: #f8f9fa;
		border-radius: 12rpx;
		border-left: 6rpx solid #007aff;
	}

	.contract-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15rpx;
	}

	.contract-name {
		font-size: 30rpx;
		font-weight: 600;
		color: #333;
		flex: 1;
	}

	.contract-amount {
		font-size: 32rpx;
		font-weight: 700;
		color: #ff6b35;
	}

	.contract-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.contract-date {
		font-size: 24rpx;
		color: #666;
	}

	.contract-status {
		font-size: 24rpx;
		padding: 8rpx 16rpx;
		border-radius: 20rpx;
		font-weight: 500;
	}

	.status-pending {
		background-color: #fff3cd;
		color: #856404;
	}

	.status-signed {
		background-color: #d1ecf1;
		color: #0c5460;
	}

	.status-completed {
		background-color: #d4edda;
		color: #155724;
	}

	.status-cancelled {
		background-color: #f8d7da;
		color: #721c24;
	}

	/* 空状态样式 */
	.empty-state {
		text-align: center;
		padding: 80rpx 40rpx;
	}

	.empty-text {
		display: block;
		font-size: 28rpx;
		color: #999;
		margin-bottom: 20rpx;
	}

	.empty-tip {
		display: block;
		font-size: 24rpx;
		color: #ccc;
	}
</style>
