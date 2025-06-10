<template>
	<view class="container">
		<!-- 筛选标签 -->
		<view class="filter-tabs">
			<view 
				v-for="(tab, index) in filterTabs" 
				:key="index"
				class="filter-tab"
				:class="{ active: currentTab === tab.value }"
				@click="switchTab(tab.value)"
			>
				{{ tab.label }}
			</view>
		</view>

		<!-- 合同列表 -->
		<view class="contract-list">
			<view 
				v-for="contract in filteredContracts" 
				:key="contract.id"
				class="contract-item"
				@click="goToDetail(contract.id)"
			>
				<view class="contract-header">
					<text class="contract-name">{{ contract.name }}</text>
					<text class="contract-status" :class="getStatusClass(contract.status)">
						{{ getStatusText(contract.status) }}
					</text>
				</view>
				
				<view class="contract-info">
					<view class="info-row">
						<text class="info-label">合同金额：</text>
						<text class="info-value amount">¥{{ formatAmount(contract.amount) }}</text>
					</view>
					<view class="info-row">
						<text class="info-label">签署日期：</text>
						<text class="info-value">{{ formatDate(contract.signDate) }}</text>
					</view>
					<view class="info-row">
						<text class="info-label">签字费：</text>
						<text class="info-value">¥{{ formatAmount(contract.signFee) }}</text>
					</view>
					<view class="info-row">
						<text class="info-label">签约人：</text>
						<text class="info-value">{{ contract.signerName }}</text>
					</view>
					<view class="info-row">
						<text class="info-label">身份证号：</text>
						<text class="info-value">{{ formatIdCard(contract.signerIdCard) }}</text>
					</view>
				</view>
				
				<view class="contract-actions">
					<button 
						class="action-btn detail-btn" 
						@click.stop="goToDetail(contract.id)"
					>
						查看详情
					</button>
					<button 
						v-if="contract.status === 'pending'" 
						class="action-btn sign-btn" 
						@click.stop="goToSign(contract.id)"
					>
						立即签署
					</button>
				</view>
			</view>
		</view>

		<!-- 空状态 -->
		<view v-if="filteredContracts.length === 0" class="empty-state">
			<text class="empty-icon">📄</text>
			<text class="empty-text">暂无合同记录</text>
			<text class="empty-tip">您的合同信息将在这里显示</text>
		</view>

		<!-- 加载更多 -->
		<view v-if="hasMore && filteredContracts.length > 0" class="load-more" @click="loadMore">
			<text class="load-more-text">{{ isLoading ? '加载中...' : '加载更多' }}</text>
		</view>
	</view>
</template>

<script>
	import { getContractList } from '@/api/contract'
	import { formatAmount, formatDate, formatIdCard } from '@/utils/validate'
	
	export default {
		data() {
			return {
				currentTab: 'all',
				filterTabs: [
					{ label: '全部', value: 'all' },
					{ label: '待签署', value: 'pending' },
					{ label: '已签署', value: 'signed' },
					{ label: '已完成', value: 'completed' }
				],
				contracts: [],
				isLoading: false,
				hasMore: true,
				page: 1,
				pageSize: 10
			}
		},
		computed: {
			filteredContracts() {
				let result = this.contracts

				// 按状态筛选
				if (this.currentTab !== 'all') {
					result = result.filter(contract => contract.status === this.currentTab)
				}

				return result
			}
		},
		onLoad() {
			this.loadContracts()
		},
		onShow() {
			this.loadContracts()
		},
		onPullDownRefresh() {
			this.refreshData()
		},
		onReachBottom() {
			if (this.hasMore && !this.isLoading) {
				this.loadMore()
			}
		},
		methods: {
			// 加载合同列表
			async loadContracts(isRefresh = false) {
				if (this.isLoading) return
				
				this.isLoading = true
				
				try {
					const res = await getContractList({
						page: isRefresh ? 1 : this.page,
						limit: this.pageSize
					})
					
					if (isRefresh) {
						this.contracts = res.data.list || []
						this.page = 1
					} else {
						this.contracts = [...this.contracts, ...(res.data.list || [])]
					}
					
					this.hasMore = res.data.hasMore || false
					
				} catch (error) {
					console.error('加载合同列表失败:', error)
					uni.showToast({
						title: '加载失败',
						icon: 'none'
					})
				} finally {
					this.isLoading = false
					if (isRefresh) {
						uni.stopPullDownRefresh()
					}
				}
			},
			
			// 刷新数据
			refreshData() {
				this.page = 1
				this.hasMore = true
				this.loadContracts(true)
			},
			
			// 加载更多
			loadMore() {
				if (this.hasMore && !this.isLoading) {
					this.page++
					this.loadContracts()
				}
			},
			
			// 切换筛选标签
			switchTab(value) {
				this.currentTab = value
			},
			
			// 跳转到合同详情
			goToDetail(id) {
				uni.navigateTo({
					url: `/pages/contract/detail?id=${id}`
				})
			},
			
			// 跳转到签署页面
			goToSign(id) {
				uni.navigateTo({
					url: `/pages/contract/sign?id=${id}`
				})
			},
			
			// 格式化金额
			formatAmount,
			
			// 格式化日期
			formatDate,
			
			// 格式化身份证号
			formatIdCard,
			
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

	/* 筛选标签样式 */
	.filter-tabs {
		display: flex;
		background-color: #fff;
		padding: 20rpx 30rpx;
		border-bottom: 1rpx solid #eee;
	}

	.filter-tab {
		flex: 1;
		text-align: center;
		padding: 20rpx 0;
		font-size: 28rpx;
		color: #666;
		border-radius: 40rpx;
		transition: all 0.3s ease;
	}

	.filter-tab.active {
		background-color: #667eea;
		color: #fff;
	}

	/* 合同列表样式 */
	.contract-list {
		padding: 20rpx 30rpx;
	}

	.contract-item {
		background-color: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
	}

	.contract-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
		padding-bottom: 20rpx;
		border-bottom: 1rpx solid #eee;
	}

	.contract-name {
		font-size: 32rpx;
		font-weight: 600;
		color: #333;
		flex: 1;
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

	.contract-info {
		margin-bottom: 30rpx;
	}

	.info-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15rpx;
	}

	.info-label {
		font-size: 26rpx;
		color: #666;
	}

	.info-value {
		font-size: 26rpx;
		color: #333;
		font-weight: 500;
	}

	.info-value.amount {
		color: #ff6b35;
		font-weight: 700;
	}

	.contract-actions {
		display: flex;
		gap: 20rpx;
	}

	.action-btn {
		flex: 1;
		height: 70rpx;
		border-radius: 8rpx;
		font-size: 26rpx;
		font-weight: 500;
		border: none;
		transition: all 0.3s ease;
	}

	.detail-btn {
		background-color: #f8f9fa;
		color: #666;
	}

	.sign-btn {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: #fff;
	}

	.action-btn:active {
		transform: scale(0.95);
	}

	/* 空状态样式 */
	.empty-state {
		text-align: center;
		padding: 120rpx 40rpx;
	}

	.empty-icon {
		display: block;
		font-size: 120rpx;
		margin-bottom: 30rpx;
	}

	.empty-text {
		display: block;
		font-size: 32rpx;
		color: #999;
		margin-bottom: 20rpx;
	}

	.empty-tip {
		display: block;
		font-size: 26rpx;
		color: #ccc;
	}

	/* 加载更多样式 */
	.load-more {
		text-align: center;
		padding: 40rpx;
	}

	.load-more-text {
		font-size: 28rpx;
		color: #666;
	}
</style>
