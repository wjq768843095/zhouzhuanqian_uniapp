<template>
	<view class="container">
		<view v-if="contract" class="sign-container">
			<!-- 合同信息 -->
			<view class="contract-info">
				<view class="info-header">
					<text class="contract-name">{{ contract.name }}</text>
					<text class="contract-amount">¥{{ formatAmount(contract.amount) }}</text>
				</view>
				<view class="info-details">
					<text class="detail-item">签字费：¥{{ formatAmount(contract.signFee) }}</text>
					<text class="detail-item">签约人：{{ contract.signerName }}</text>
				</view>
			</view>

			<!-- 签署步骤 -->
			<view class="steps-container">
				<view class="step-item" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
					<view class="step-number">1</view>
					<text class="step-text">确认合同信息</text>
				</view>
				<view class="step-line" :class="{ active: currentStep > 1 }"></view>
				<view class="step-item" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
					<view class="step-number">2</view>
					<text class="step-text">支付签字费</text>
				</view>
				<view class="step-line" :class="{ active: currentStep > 2 }"></view>
				<view class="step-item" :class="{ active: currentStep >= 3, completed: currentStep > 3 }">
					<view class="step-number">3</view>
					<text class="step-text">完成签署</text>
				</view>
			</view>

			<!-- 步骤1：确认合同信息 -->
			<view v-if="currentStep === 1" class="step-content">
				<view class="content-header">
					<text class="content-title">确认合同信息</text>
					<text class="content-subtitle">请仔细核对以下合同信息</text>
				</view>
				
				<view class="contract-details">
					<view class="detail-row">
						<text class="detail-label">合同名称：</text>
						<text class="detail-value">{{ contract.name }}</text>
					</view>
					<view class="detail-row">
						<text class="detail-label">合同金额：</text>
						<text class="detail-value amount">¥{{ formatAmount(contract.amount) }}</text>
					</view>
					<view class="detail-row">
						<text class="detail-label">签字费：</text>
						<text class="detail-value">¥{{ formatAmount(contract.signFee) }}</text>
					</view>
					<view class="detail-row">
						<text class="detail-label">签约人：</text>
						<text class="detail-value">{{ contract.signerName }}</text>
					</view>
					<view class="detail-row">
						<text class="detail-label">身份证号：</text>
						<text class="detail-value">{{ formatIdCard(contract.signerIdCard) }}</text>
					</view>
				</view>

				<button class="next-btn" @click="nextStep">确认无误，下一步</button>
			</view>

			<!-- 步骤2：支付签字费 -->
			<view v-if="currentStep === 2" class="step-content">
				<view class="content-header">
					<text class="content-title">支付签字费</text>
					<text class="content-subtitle">请输入签约密码完成支付</text>
				</view>

				<view class="payment-info">
					<view class="payment-amount">
						<text class="amount-label">需支付金额</text>
						<text class="amount-value">¥{{ formatAmount(contract.signFee) }}</text>
					</view>
				</view>

				<view class="password-input">
					<text class="input-label">请输入签约密码</text>
					<view class="password-wrapper">
						<input 
							class="password-field" 
							type="password" 
							placeholder="请输入6位数字签约密码" 
							v-model="signPassword"
							maxlength="6"
						/>
					</view>
				</view>

				<view class="step-actions">
					<button class="back-btn" @click="prevStep">上一步</button>
					<button class="pay-btn" @click="handlePayment" :disabled="isLoading">
						{{ isLoading ? '支付中...' : '确认支付' }}
					</button>
				</view>
			</view>

			<!-- 步骤3：完成签署 -->
			<view v-if="currentStep === 3" class="step-content">
				<view class="content-header">
					<text class="content-title">完成签署</text>
					<text class="content-subtitle">签字费支付成功，请确认签署合同</text>
				</view>

				<view class="success-info">
					<text class="success-icon">✅</text>
					<text class="success-text">签字费支付成功</text>
					<text class="success-amount">¥{{ formatAmount(contract.signFee) }}</text>
				</view>

				<view class="sign-agreement">
					<view class="agreement-text">
						<text>我已仔细阅读并同意上述合同条款，确认进行电子签署。</text>
					</view>
					<view class="checkbox-wrapper">
						<checkbox-group @change="onAgreementChange">
							<label class="checkbox-label">
								<checkbox value="agree" :checked="isAgreed" />
								<text class="checkbox-text">我同意并确认签署此合同</text>
							</label>
						</checkbox-group>
					</view>
				</view>

				<view class="step-actions">
					<button class="back-btn" @click="prevStep">上一步</button>
					<button class="sign-btn" @click="handleSign" :disabled="!isAgreed || isLoading">
						{{ isLoading ? '签署中...' : '确认签署' }}
					</button>
				</view>
			</view>

			<!-- 签署成功 -->
			<view v-if="currentStep === 4" class="step-content">
				<view class="success-container">
					<text class="success-icon large">🎉</text>
					<text class="success-title">签署成功！</text>
					<text class="success-desc">合同已成功签署，您可以在合同列表中查看详情</text>
					
					<view class="success-actions">
						<button class="view-btn" @click="viewContract">查看合同</button>
						<button class="home-btn" @click="goHome">返回首页</button>
					</view>
				</view>
			</view>
		</view>

		<!-- 加载状态 -->
		<view v-else-if="isLoadingContract" class="loading-state">
			<text class="loading-text">加载中...</text>
		</view>

		<!-- 错误状态 -->
		<view v-else class="error-state">
			<text class="error-icon">❌</text>
			<text class="error-text">加载失败</text>
			<button class="retry-btn" @click="loadContractDetail">重试</button>
		</view>
	</view>
</template>

<script>
	import { getContractDetail, paySignFee, signContract } from '@/api/contract'
	import { formatAmount, formatIdCard, validateSignPassword } from '@/utils/validate'
	
	export default {
		data() {
			return {
				contractId: '',
				contract: null,
				currentStep: 1,
				signPassword: '',
				isAgreed: false,
				isLoading: false,
				isLoadingContract: false
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
				
				this.isLoadingContract = true
				
				try {
					const res = await getContractDetail(this.contractId)
					this.contract = res.data
					
					// 如果已经支付过签字费，直接跳到第3步
					if (this.contract.signFeePaid) {
						this.currentStep = 3
					}
				} catch (error) {
					console.error('加载合同详情失败:', error)
					uni.showToast({
						title: '加载失败',
						icon: 'none'
					})
				} finally {
					this.isLoadingContract = false
				}
			},
			
			// 下一步
			nextStep() {
				if (this.currentStep < 4) {
					this.currentStep++
				}
			},
			
			// 上一步
			prevStep() {
				if (this.currentStep > 1) {
					this.currentStep--
				}
			},
			
			// 处理支付
			async handlePayment() {
				if (!this.signPassword.trim()) {
					uni.showToast({
						title: '请输入签约密码',
						icon: 'none'
					})
					return
				}
				
				if (!validateSignPassword(this.signPassword.trim())) {
					uni.showToast({
						title: '签约密码必须为6位数字',
						icon: 'none'
					})
					return
				}
				
				this.isLoading = true
				
				try {
					await paySignFee({
						contractId: this.contractId,
						signPassword: this.signPassword.trim()
					})
					
					uni.showToast({
						title: '支付成功',
						icon: 'success'
					})
					
					// 清空密码
					this.signPassword = ''
					
					// 进入下一步
					setTimeout(() => {
						this.nextStep()
					}, 1500)
					
				} catch (error) {
					console.error('支付失败:', error)
				} finally {
					this.isLoading = false
				}
			},
			
			// 同意协议变化
			onAgreementChange(e) {
				this.isAgreed = e.detail.value.includes('agree')
			},
			
			// 处理签署
			async handleSign() {
				if (!this.isAgreed) {
					uni.showToast({
						title: '请先同意合同条款',
						icon: 'none'
					})
					return
				}
				
				this.isLoading = true
				
				try {
					await signContract({
						contractId: this.contractId
					})
					
					uni.showToast({
						title: '签署成功',
						icon: 'success'
					})
					
					// 进入成功页面
					setTimeout(() => {
						this.nextStep()
					}, 1500)
					
				} catch (error) {
					console.error('签署失败:', error)
				} finally {
					this.isLoading = false
				}
			},
			
			// 查看合同
			viewContract() {
				uni.redirectTo({
					url: `/pages/contract/detail?id=${this.contractId}`
				})
			},
			
			// 返回首页
			goHome() {
				uni.switchTab({
					url: '/pages/index/index'
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
		padding: 30rpx;
	}

	.sign-container {
		background-color: #fff;
		border-radius: 20rpx;
		overflow: hidden;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
	}

	/* 合同信息样式 */
	.contract-info {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		padding: 40rpx;
		color: #fff;
	}

	.info-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.contract-name {
		font-size: 36rpx;
		font-weight: 600;
		flex: 1;
	}

	.contract-amount {
		font-size: 40rpx;
		font-weight: 700;
		color: #fff;
	}

	.info-details {
		display: flex;
		gap: 30rpx;
	}

	.detail-item {
		font-size: 26rpx;
		opacity: 0.9;
	}

	/* 步骤指示器样式 */
	.steps-container {
		display: flex;
		align-items: center;
		padding: 40rpx;
		background-color: #f8f9fa;
	}

	.step-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
	}

	.step-number {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		background-color: #ddd;
		color: #999;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		font-weight: 600;
		margin-bottom: 15rpx;
		transition: all 0.3s ease;
	}

	.step-item.active .step-number {
		background-color: #667eea;
		color: #fff;
	}

	.step-item.completed .step-number {
		background-color: #28a745;
		color: #fff;
	}

	.step-text {
		font-size: 24rpx;
		color: #666;
		text-align: center;
	}

	.step-item.active .step-text {
		color: #333;
		font-weight: 500;
	}

	.step-line {
		height: 2rpx;
		background-color: #ddd;
		flex: 1;
		margin: 0 20rpx;
		margin-bottom: 35rpx;
		transition: all 0.3s ease;
	}

	.step-line.active {
		background-color: #667eea;
	}

	/* 步骤内容样式 */
	.step-content {
		padding: 40rpx;
	}

	.content-header {
		text-align: center;
		margin-bottom: 40rpx;
	}

	.content-title {
		display: block;
		font-size: 36rpx;
		font-weight: 600;
		color: #333;
		margin-bottom: 15rpx;
	}

	.content-subtitle {
		display: block;
		font-size: 28rpx;
		color: #666;
	}

	/* 合同详情样式 */
	.contract-details {
		background-color: #f8f9fa;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 40rpx;
	}

	.detail-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #eee;
	}

	.detail-row:last-child {
		border-bottom: none;
	}

	.detail-label {
		font-size: 28rpx;
		color: #666;
	}

	.detail-value {
		font-size: 28rpx;
		color: #333;
		font-weight: 500;
	}

	.detail-value.amount {
		color: #ff6b35;
		font-weight: 700;
		font-size: 32rpx;
	}

	/* 按钮样式 */
	.next-btn,
	.pay-btn,
	.sign-btn {
		width: 100%;
		height: 88rpx;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: #fff;
		font-size: 32rpx;
		font-weight: 600;
		border-radius: 12rpx;
		border: none;
		transition: all 0.3s ease;
	}

	.back-btn {
		width: 100%;
		height: 88rpx;
		background-color: #f8f9fa;
		color: #666;
		font-size: 32rpx;
		font-weight: 600;
		border-radius: 12rpx;
		border: none;
		transition: all 0.3s ease;
	}

	.next-btn:active,
	.pay-btn:not(:disabled):active,
	.sign-btn:not(:disabled):active,
	.back-btn:active {
		transform: scale(0.98);
	}

	.pay-btn:disabled,
	.sign-btn:disabled {
		opacity: 0.6;
	}

	/* 支付信息样式 */
	.payment-info {
		background-color: #f8f9fa;
		border-radius: 16rpx;
		padding: 40rpx;
		text-align: center;
		margin-bottom: 40rpx;
	}

	.payment-amount {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.amount-label {
		font-size: 28rpx;
		color: #666;
		margin-bottom: 15rpx;
	}

	.amount-value {
		font-size: 48rpx;
		font-weight: 700;
		color: #ff6b35;
	}

	/* 密码输入样式 */
	.password-input {
		margin-bottom: 40rpx;
	}

	.input-label {
		display: block;
		font-size: 28rpx;
		color: #333;
		margin-bottom: 20rpx;
		font-weight: 500;
	}

	.password-wrapper {
		background-color: #f8f9fa;
		border-radius: 12rpx;
		padding: 0 30rpx;
		height: 88rpx;
		display: flex;
		align-items: center;
		border: 2rpx solid transparent;
		transition: all 0.3s ease;
	}

	.password-wrapper:focus-within {
		border-color: #667eea;
		background-color: #fff;
		box-shadow: 0 0 0 6rpx rgba(102, 126, 234, 0.1);
	}

	.password-field {
		flex: 1;
		font-size: 30rpx;
		color: #333;
		background-color: transparent;
	}

	/* 步骤操作按钮样式 */
	.step-actions {
		display: flex;
		gap: 20rpx;
	}

	.step-actions .back-btn,
	.step-actions .pay-btn,
	.step-actions .sign-btn {
		flex: 1;
	}

	/* 成功信息样式 */
	.success-info {
		background-color: #d4edda;
		border-radius: 16rpx;
		padding: 40rpx;
		text-align: center;
		margin-bottom: 40rpx;
	}

	.success-icon {
		display: block;
		font-size: 60rpx;
		margin-bottom: 20rpx;
	}

	.success-text {
		display: block;
		font-size: 32rpx;
		color: #155724;
		font-weight: 600;
		margin-bottom: 15rpx;
	}

	.success-amount {
		display: block;
		font-size: 36rpx;
		color: #155724;
		font-weight: 700;
	}

	/* 签署协议样式 */
	.sign-agreement {
		background-color: #f8f9fa;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 40rpx;
	}

	.agreement-text {
		margin-bottom: 25rpx;
	}

	.agreement-text text {
		font-size: 28rpx;
		line-height: 1.5;
		color: #666;
	}

	.checkbox-wrapper {
		display: flex;
		align-items: center;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
	}

	.checkbox-text {
		font-size: 28rpx;
		color: #333;
		margin-left: 15rpx;
	}

	/* 签署成功样式 */
	.success-container {
		text-align: center;
		padding: 60rpx 40rpx;
	}

	.success-icon.large {
		display: block;
		font-size: 120rpx;
		margin-bottom: 30rpx;
	}

	.success-title {
		display: block;
		font-size: 48rpx;
		font-weight: 700;
		color: #333;
		margin-bottom: 20rpx;
	}

	.success-desc {
		display: block;
		font-size: 28rpx;
		color: #666;
		line-height: 1.5;
		margin-bottom: 60rpx;
	}

	.success-actions {
		display: flex;
		gap: 20rpx;
	}

	.view-btn,
	.home-btn {
		flex: 1;
		height: 88rpx;
		border-radius: 12rpx;
		font-size: 32rpx;
		font-weight: 600;
		border: none;
		transition: all 0.3s ease;
	}

	.view-btn {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: #fff;
	}

	.home-btn {
		background-color: #f8f9fa;
		color: #666;
	}

	.view-btn:active,
	.home-btn:active {
		transform: scale(0.98);
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
</style>
