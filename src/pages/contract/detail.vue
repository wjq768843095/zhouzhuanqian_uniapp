<template>
	<view class="container">
		<view v-if="contract" class="contract-detail">
			<!-- 合同基本信息 -->
			<view class="info-section">
				<view class="section-title">
					<text class="title-icon">📄</text>
					<text class="title-text">合同信息</text>
				</view>
				
				<view class="info-grid">
					<view class="info-item">
						<text class="info-label">合同名称</text>
						<text class="info-value">{{ contract.name }}</text>
					</view>
					<view class="info-item">
						<text class="info-label">合同金额</text>
						<text class="info-value amount">¥{{ formatAmount(contract.amount) }}</text>
					</view>
					<view class="info-item">
						<text class="info-label">签署日期</text>
						<text class="info-value">{{ formatDate(contract.signDate) }}</text>
					</view>
					<view class="info-item">
						<text class="info-label">签字费</text>
						<text class="info-value">¥{{ formatAmount(contract.signFee) }}</text>
					</view>
					<view class="info-item">
						<text class="info-label">合同状态</text>
						<text class="info-value status" :class="getStatusClass(contract.status)">
							{{ getStatusText(contract.status) }}
						</text>
					</view>
				</view>
			</view>

			<!-- 签约人信息 -->
			<view class="info-section">
				<view class="section-title">
					<text class="title-icon">👤</text>
					<text class="title-text">签约人信息</text>
				</view>
				
				<view class="info-grid">
					<view class="info-item">
						<text class="info-label">签约人姓名</text>
						<text class="info-value">{{ contract.signerName }}</text>
					</view>
					<view class="info-item">
						<text class="info-label">身份证号</text>
						<text class="info-value">{{ formatIdCard(contract.signerIdCard) }}</text>
					</view>
				</view>
			</view>

			<!-- 合同内容 -->
			<view class="info-section">
				<view class="section-title">
					<text class="title-icon">📝</text>
					<text class="title-text">合同内容</text>
				</view>
				
				<view class="contract-content">
					<text class="content-text">{{ contract.content || '暂无合同内容' }}</text>
				</view>
			</view>

			<!-- 签署记录 -->
			<view v-if="contract.signRecords && contract.signRecords.length > 0" class="info-section">
				<view class="section-title">
					<text class="title-icon">✍️</text>
					<text class="title-text">签署记录</text>
				</view>
				
				<view class="sign-records">
					<view v-for="record in contract.signRecords" :key="record.id" class="record-item">
						<view class="record-header">
							<text class="record-action">{{ record.action }}</text>
							<text class="record-time">{{ formatDateTime(record.time) }}</text>
						</view>
						<text class="record-desc">{{ record.description }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 加载状态 -->
		<view v-else-if="isLoading" class="loading-state">
			<text class="loading-text">加载中...</text>
		</view>

		<!-- 错误状态 -->
		<view v-else class="error-state">
			<text class="error-icon">❌</text>
			<text class="error-text">加载失败</text>
			<button class="retry-btn" @click="loadContractDetail">重试</button>
		</view>

		<!-- 底部操作按钮 -->
		<view v-if="contract" class="bottom-actions">
			<button 
				v-if="contract.status === 'pending'" 
				class="action-btn sign-btn" 
				@click="goToSign"
			>
				立即签署
			</button>
			<button 
				v-else-if="contract.status === 'signed'" 
				class="action-btn download-btn" 
				@click="downloadContract"
			>
				下载合同
			</button>
		</view>
	</view>
</template>

<script>
	import { getContractDetail } from '@/api/contract'
	import { formatAmount, formatDate, formatIdCard } from '@/utils/validate'
	
	export default {
		data() {
			return {
				contractId: '',
				contract: null,
				isLoading: false
			}
		},
		onLoad(options) {
			this.contractId = options.id
			if (this.contractId) {
				this.loadContractDetail()
			}
		},
		methods: {
			// 加载合同详情
			async loadContractDetail() {
				if (!this.contractId) return
				
				this.isLoading = true
				
				try {
					const res = await getContractDetail(this.contractId)
					this.contract = res.data
				} catch (error) {
					console.error('加载合同详情失败:', error)
					uni.showToast({
						title: '加载失败',
						icon: 'none'
					})
				} finally {
					this.isLoading = false
				}
			},
			
			// 跳转到签署页面
			goToSign() {
				uni.navigateTo({
					url: `/pages/contract/sign?id=${this.contractId}`
				})
			},
			
			// 下载合同
			downloadContract() {
				uni.showModal({
					title: '下载合同',
					content: '合同下载功能正在开发中',
					showCancel: false
				})
			},
			
			// 格式化金额
			formatAmount,
			
			// 格式化日期
			formatDate,
			
			// 格式化身份证号
			formatIdCard,
			
			// 格式化日期时间
			formatDateTime(datetime) {
				const d = new Date(datetime)
				const year = d.getFullYear()
				const month = String(d.getMonth() + 1).padStart(2, '0')
				const day = String(d.getDate()).padStart(2, '0')
				const hour = String(d.getHours()).padStart(2, '0')
				const minute = String(d.getMinutes()).padStart(2, '0')
				return `${year}-${month}-${day} ${hour}:${minute}`
			},
			
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
		padding-bottom: 120rpx;
	}

	.contract-detail {
		padding: 30rpx;
	}

	/* 信息区块样式 */
	.info-section {
		background-color: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
	}

	.section-title {
		display: flex;
		align-items: center;
		margin-bottom: 30rpx;
		padding-bottom: 20rpx;
		border-bottom: 1rpx solid #eee;
	}

	.title-icon {
		font-size: 32rpx;
		margin-right: 15rpx;
	}

	.title-text {
		font-size: 32rpx;
		font-weight: 600;
		color: #333;
	}

	.info-grid {
		display: flex;
		flex-direction: column;
		gap: 25rpx;
	}

	.info-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #f5f5f5;
	}

	.info-item:last-child {
		border-bottom: none;
	}

	.info-label {
		font-size: 28rpx;
		color: #666;
		flex-shrink: 0;
		width: 200rpx;
	}

	.info-value {
		font-size: 28rpx;
		color: #333;
		font-weight: 500;
		flex: 1;
		text-align: right;
	}

	.info-value.amount {
		color: #ff6b35;
		font-weight: 700;
		font-size: 32rpx;
	}

	.info-value.status {
		padding: 8rpx 16rpx;
		border-radius: 20rpx;
		font-size: 24rpx;
		text-align: center;
		min-width: 120rpx;
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

	/* 合同内容样式 */
	.contract-content {
		background-color: #f8f9fa;
		border-radius: 12rpx;
		padding: 30rpx;
		min-height: 200rpx;
	}

	.content-text {
		font-size: 28rpx;
		line-height: 1.6;
		color: #333;
		white-space: pre-wrap;
	}

	/* 签署记录样式 */
	.sign-records {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.record-item {
		background-color: #f8f9fa;
		border-radius: 12rpx;
		padding: 25rpx;
		border-left: 6rpx solid #667eea;
	}

	.record-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15rpx;
	}

	.record-action {
		font-size: 28rpx;
		font-weight: 600;
		color: #333;
	}

	.record-time {
		font-size: 24rpx;
		color: #666;
	}

	.record-desc {
		font-size: 26rpx;
		color: #666;
		line-height: 1.5;
	}

	/* 加载和错误状态样式 */
	.loading-state,
	.error-state {
		text-align: center;
		padding: 120rpx 40rpx;
	}

	.loading-text {
		font-size: 32rpx;
		color: #666;
	}

	.error-icon {
		display: block;
		font-size: 120rpx;
		margin-bottom: 30rpx;
	}

	.error-text {
		display: block;
		font-size: 32rpx;
		color: #999;
		margin-bottom: 40rpx;
	}

	.retry-btn {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: #fff;
		font-size: 28rpx;
		padding: 20rpx 40rpx;
		border-radius: 50rpx;
		border: none;
	}

	/* 底部操作按钮样式 */
	.bottom-actions {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #fff;
		padding: 30rpx;
		border-top: 1rpx solid #eee;
		box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.1);
	}

	.action-btn {
		width: 100%;
		height: 88rpx;
		border-radius: 12rpx;
		font-size: 32rpx;
		font-weight: 600;
		border: none;
		transition: all 0.3s ease;
	}

	.sign-btn {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: #fff;
	}

	.download-btn {
		background-color: #28a745;
		color: #fff;
	}

	.action-btn:active {
		transform: scale(0.98);
	}
</style>
