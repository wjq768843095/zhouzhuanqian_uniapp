<template>
	<view class="password-input-container">
		<view class="password-boxes">
			<view 
				v-for="(item, index) in length" 
				:key="index"
				class="password-box"
				:class="{ 
					'box-active': currentIndex === index && isFocused,
					'box-filled': passwordArray[index] 
				}"
				@click="focusInput(index)"
			>
				<text v-if="passwordArray[index]" class="password-dot">●</text>
			</view>
		</view>
		<input 
			ref="hiddenInput"
			class="hidden-input"
			type="number"
			maxlength="1"
			v-model="currentValue"
			@input="onInput"
			@focus="onFocus"
			@blur="onBlur"
			@keydown="onKeydown"
		/>
	</view>
</template>

<script>
	export default {
		name: 'PasswordInput',
		props: {
			value: {
				type: String,
				default: ''
			},
			length: {
				type: Number,
				default: 6
			}
		},
		data() {
			return {
				passwordArray: [],
				currentIndex: 0,
				currentValue: '',
				isFocused: false
			}
		},
		watch: {
			value: {
				handler(newVal) {
					this.passwordArray = newVal.split('').concat(new Array(this.length - newVal.length).fill(''))
				},
				immediate: true
			}
		},
		methods: {
			focusInput(index) {
				this.currentIndex = index
				this.$refs.hiddenInput.focus()
			},
			
			onFocus() {
				this.isFocused = true
			},
			
			onBlur() {
				this.isFocused = false
			},
			
			onInput(e) {
				const value = e.detail.value
				if (value && /^\d$/.test(value)) {
					// 设置当前位置的值
					this.$set(this.passwordArray, this.currentIndex, value)
					
					// 自动跳转到下一个输入框
					if (this.currentIndex < this.length - 1) {
						this.currentIndex++
					}
					
					// 触发父组件的值更新
					this.$emit('input', this.passwordArray.join(''))
				}
				
				// 清空当前输入值，准备下次输入
				this.currentValue = ''
			},
			
			onKeydown(e) {
				// 处理退格键
				if (e.keyCode === 8) {
					if (this.passwordArray[this.currentIndex]) {
						// 如果当前位置有值，清空当前位置
						this.$set(this.passwordArray, this.currentIndex, '')
					} else if (this.currentIndex > 0) {
						// 如果当前位置没有值，移动到上一个位置并清空
						this.currentIndex--
						this.$set(this.passwordArray, this.currentIndex, '')
					}
					this.$emit('input', this.passwordArray.join(''))
				}
			}
		}
	}
</script>

<style scoped>
	.password-input-container {
		position: relative;
	}

	.password-boxes {
		display: flex;
		justify-content: space-between;
		gap: 15rpx;
	}

	.password-box {
		width: 80rpx;
		height: 80rpx;
		border: 2rpx solid #e0e0e0;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f8f9fa;
		transition: all 0.3s ease;
		position: relative;
	}

	.password-box.box-active {
		border-color: #667eea;
		background: #fff;
		box-shadow: 0 0 0 4rpx rgba(102, 126, 234, 0.1);
		transform: scale(1.05);
	}

	.password-box.box-filled {
		border-color: #667eea;
		background: linear-gradient(135deg, #667eea, #764ba2);
	}

	.password-dot {
		font-size: 32rpx;
		color: #fff;
		font-weight: bold;
	}

	.hidden-input {
		position: absolute;
		top: -9999rpx;
		left: -9999rpx;
		opacity: 0;
		pointer-events: none;
	}
</style>
