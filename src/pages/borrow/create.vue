<template>
	<view class="container">
		<view class="form-container">
			<view class="form-header">
				<text class="form-title">创建借条</text>
				<text class="form-subtitle">请填写借条相关信息</text>
			</view>

			<view class="form-content">
				<view class="form-item">
					<text class="label">借款人姓名</text>
					<view class="input-wrapper">
						<input 
							class="input-field" 
							type="text" 
							placeholder="请输入借款人姓名" 
							v-model="formData.borrowerName"
							maxlength="10"
						/>
					</view>
					<text v-if="errors.borrowerName" class="error-text">{{ errors.borrowerName }}</text>
				</view>

				<view class="form-item">
					<text class="label">借款人身份证号</text>
					<view class="input-wrapper">
						<input 
							class="input-field" 
							type="text" 
							placeholder="请输入借款人身份证号" 
							v-model="formData.borrowerIdCard"
							maxlength="18"
						/>
					</view>
					<text v-if="errors.borrowerIdCard" class="error-text">{{ errors.borrowerIdCard }}</text>
				</view>

				<view class="form-item">
					<text class="label">借款金额</text>
					<view class="input-wrapper">
						<input 
							class="input-field" 
							type="digit" 
							placeholder="请输入借款金额" 
							v-model="formData.amount"
						/>
						<text class="input-unit">元</text>
					</view>
					<text v-if="errors.amount" class="error-text">{{ errors.amount }}</text>
				</view>

				<view class="form-item">
					<text class="label">借款期限</text>
					<view class="input-wrapper">
						<picker mode="date" :value="formData.dueDate" @change="onDueDateChange">
							<view class="picker-text">
								{{ formData.dueDate || '请选择还款日期' }}
							</view>
						</picker>
					</view>
					<text v-if="errors.dueDate" class="error-text">{{ errors.dueDate }}</text>
				</view>

				<view class="form-item">
					<text class="label">利率（年化）</text>
					<view class="input-wrapper">
						<input 
							class="input-field" 
							type="digit" 
							placeholder="请输入年化利率" 
							v-model="formData.interestRate"
						/>
						<text class="input-unit">%</text>
					</view>
					<text v-if="errors.interestRate" class="error-text">{{ errors.interestRate }}</text>
				</view>

				<view class="form-item">
					<text class="label">借款用途</text>
					<view class="textarea-wrapper">
						<textarea 
							class="textarea-field" 
							placeholder="请简要说明借款用途" 
							v-model="formData.purpose"
							maxlength="200"
						></textarea>
					</view>
					<text class="char-count">{{ formData.purpose.length }}/200</text>
				</view>

				<view class="form-item">
					<text class="label">备注</text>
					<view class="textarea-wrapper">
						<textarea 
							class="textarea-field" 
							placeholder="其他需要说明的事项（选填）" 
							v-model="formData.remark"
							maxlength="200"
						></textarea>
					</view>
					<text class="char-count">{{ formData.remark.length }}/200</text>
				</view>
			</view>

			<view class="form-footer">
				<button class="submit-btn" @click="handleSubmit" :disabled="isLoading">
					{{ isLoading ? '创建中...' : '创建借条' }}
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	import { createBorrow } from '@/api/contract'
	import { validateName, validateIdCard, validateAmount } from '@/utils/validate'
	
	export default {
		data() {
			return {
				formData: {
					borrowerName: '',
					borrowerIdCard: '',
					amount: '',
					dueDate: '',
					interestRate: '',
					purpose: '',
					remark: ''
				},
				errors: {},
				isLoading: false
			}
		},
		methods: {
			// 选择还款日期
			onDueDateChange(e) {
				this.formData.dueDate = e.detail.value
			},
			
			// 表单验证
			validateForm() {
				this.errors = {}
				let isValid = true
				
				// 验证借款人姓名
				if (!this.formData.borrowerName.trim()) {
					this.errors.borrowerName = '请输入借款人姓名'
					isValid = false
				} else if (!validateName(this.formData.borrowerName.trim())) {
					this.errors.borrowerName = '请输入正确的中文姓名'
					isValid = false
				}
				
				// 验证身份证号
				if (!this.formData.borrowerIdCard.trim()) {
					this.errors.borrowerIdCard = '请输入借款人身份证号'
					isValid = false
				} else if (!validateIdCard(this.formData.borrowerIdCard.trim())) {
					this.errors.borrowerIdCard = '请输入正确的身份证号'
					isValid = false
				}
				
				// 验证借款金额
				if (!this.formData.amount.trim()) {
					this.errors.amount = '请输入借款金额'
					isValid = false
				} else if (!validateAmount(this.formData.amount.trim())) {
					this.errors.amount = '请输入正确的金额'
					isValid = false
				}
				
				// 验证还款日期
				if (!this.formData.dueDate) {
					this.errors.dueDate = '请选择还款日期'
					isValid = false
				} else {
					const dueDate = new Date(this.formData.dueDate)
					const today = new Date()
					if (dueDate <= today) {
						this.errors.dueDate = '还款日期必须大于今天'
						isValid = false
					}
				}
				
				// 验证利率
				if (!this.formData.interestRate.trim()) {
					this.errors.interestRate = '请输入年化利率'
					isValid = false
				} else {
					const rate = parseFloat(this.formData.interestRate)
					if (isNaN(rate) || rate < 0 || rate > 100) {
						this.errors.interestRate = '利率应在0-100之间'
						isValid = false
					}
				}
				
				// 验证借款用途
				if (!this.formData.purpose.trim()) {
					this.errors.purpose = '请说明借款用途'
					isValid = false
				}
				
				return isValid
			},
			
			// 提交表单
			async handleSubmit() {
				if (!this.validateForm()) return
				
				this.isLoading = true
				
				try {
					const res = await createBorrow({
						borrowerName: this.formData.borrowerName.trim(),
						borrowerIdCard: this.formData.borrowerIdCard.trim(),
						amount: parseFloat(this.formData.amount),
						dueDate: this.formData.dueDate,
						interestRate: parseFloat(this.formData.interestRate),
						purpose: this.formData.purpose.trim(),
						remark: this.formData.remark.trim()
					})
					
					uni.showToast({
						title: '借条创建成功',
						icon: 'success'
					})
					
					// 跳转回首页
					setTimeout(() => {
						uni.switchTab({
							url: '/pages/index/index'
						})
					}, 1500)
					
				} catch (error) {
					console.error('创建借条失败:', error)
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
		padding: 30rpx;
	}

	.form-container {
		background-color: #fff;
		border-radius: 20rpx;
		overflow: hidden;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
	}

	.form-header {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		padding: 60rpx 40rpx;
		text-align: center;
	}

	.form-title {
		display: block;
		font-size: 48rpx;
		font-weight: 700;
		color: #fff;
		margin-bottom: 20rpx;
	}

	.form-subtitle {
		display: block;
		font-size: 28rpx;
		color: rgba(255, 255, 255, 0.8);
	}

	.form-content {
		padding: 40rpx;
	}

	.form-item {
		margin-bottom: 40rpx;
	}

	.label {
		display: block;
		font-size: 28rpx;
		color: #333;
		margin-bottom: 20rpx;
		font-weight: 500;
	}

	.input-wrapper {
		display: flex;
		align-items: center;
		background-color: #f8f9fa;
		border-radius: 12rpx;
		padding: 0 30rpx;
		height: 88rpx;
		border: 2rpx solid transparent;
		transition: all 0.3s ease;
	}

	.input-wrapper:focus-within {
		border-color: #667eea;
		background-color: #fff;
		box-shadow: 0 0 0 6rpx rgba(102, 126, 234, 0.1);
	}

	.input-field {
		flex: 1;
		font-size: 30rpx;
		color: #333;
		background-color: transparent;
	}

	.input-unit {
		font-size: 28rpx;
		color: #666;
		margin-left: 10rpx;
	}

	.picker-text {
		font-size: 30rpx;
		color: #333;
		padding: 26rpx 0;
	}

	.textarea-wrapper {
		background-color: #f8f9fa;
		border-radius: 12rpx;
		padding: 20rpx 30rpx;
		border: 2rpx solid transparent;
		transition: all 0.3s ease;
	}

	.textarea-wrapper:focus-within {
		border-color: #667eea;
		background-color: #fff;
		box-shadow: 0 0 0 6rpx rgba(102, 126, 234, 0.1);
	}

	.textarea-field {
		width: 100%;
		min-height: 120rpx;
		font-size: 30rpx;
		color: #333;
		background-color: transparent;
		line-height: 1.5;
	}

	.char-count {
		display: block;
		text-align: right;
		font-size: 24rpx;
		color: #999;
		margin-top: 10rpx;
	}

	.error-text {
		display: block;
		font-size: 24rpx;
		color: #ff4757;
		margin-top: 10rpx;
		margin-left: 10rpx;
	}

	.form-footer {
		padding: 40rpx;
		border-top: 1rpx solid #f5f5f5;
	}

	.submit-btn {
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

	.submit-btn:disabled {
		opacity: 0.6;
	}

	.submit-btn:not(:disabled):active {
		transform: scale(0.98);
	}
</style>
