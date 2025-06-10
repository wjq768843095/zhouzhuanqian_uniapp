<template>
	<view class="container">
		<!-- 公司Logo和名称 -->
		<view class="header">
			<image class="logo" src="/static/logo.svg" mode="aspectFit"></image>
			<text class="app-name">周转签</text>
			<text class="app-version">v1.0.0</text>
		</view>

		<!-- 公司介绍 -->
		<view class="intro-section">
			<view class="section-title">
				<text class="title-text">关于我们</text>
			</view>
			<view class="intro-content">
				<text class="intro-text">
					周转签是一款专业的电子签约平台，致力于为用户提供安全、便捷、高效的数字化签约服务。我们拥有完善的法律保障体系和先进的技术支持，确保每一份合同的法律效力和安全性。
				</text>
			</view>
		</view>

		<!-- 核心功能 -->
		<view class="features-section">
			<view class="section-title">
				<text class="title-text">核心功能</text>
			</view>
			<view class="features-list">
				<view class="feature-item">
					<view class="feature-icon">📝</view>
					<view class="feature-content">
						<text class="feature-title">电子借条</text>
						<text class="feature-desc">快速创建具有法律效力的电子借条</text>
					</view>
				</view>
				<view class="feature-item">
					<view class="feature-icon">📄</view>
					<view class="feature-content">
						<text class="feature-title">合同管理</text>
						<text class="feature-desc">便捷的合同签署和管理功能</text>
					</view>
				</view>
				<view class="feature-item">
					<view class="feature-icon">🔒</view>
					<view class="feature-content">
						<text class="feature-title">安全保障</text>
						<text class="feature-desc">多重加密技术保护用户信息安全</text>
					</view>
				</view>
				<view class="feature-item">
					<view class="feature-icon">⚖️</view>
					<view class="feature-content">
						<text class="feature-title">法律支持</text>
						<text class="feature-desc">专业法律团队提供咨询服务</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 联系方式 -->
		<view class="contact-section">
			<view class="section-title">
				<text class="title-text">联系我们</text>
			</view>
			<view class="contact-list">
				<view class="contact-item">
					<view class="contact-icon">📞</view>
					<view class="contact-content">
						<text class="contact-label">客服电话</text>
						<text class="contact-value">400-123-4567</text>
					</view>
				</view>
				<view class="contact-item">
					<view class="contact-icon">📧</view>
					<view class="contact-content">
						<text class="contact-label">邮箱地址</text>
						<text class="contact-value">service@zhouzhuanqian.com</text>
					</view>
				</view>
				<view class="contact-item">
					<view class="contact-icon">🌐</view>
					<view class="contact-content">
						<text class="contact-label">官方网站</text>
						<text class="contact-value">www.zhouzhuanqian.com</text>
					</view>
				</view>
				<view class="contact-item">
					<view class="contact-icon">🏢</view>
					<view class="contact-content">
						<text class="contact-label">公司地址</text>
						<text class="contact-value">北京市朝阳区xxx大厦xx层</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 法律声明 -->
		<view class="legal-section">
			<view class="section-title">
				<text class="title-text">法律声明</text>
			</view>
			<view class="legal-content">
				<text class="legal-text">
					本平台提供的电子签约服务符合《中华人民共和国电子签名法》等相关法律法规要求。用户在使用本平台服务时，请仔细阅读并遵守相关条款。如有疑问，请联系我们的客服团队。
				</text>
			</view>
		</view>

		<!-- 版权信息 -->
		<view class="copyright-section">
			<text class="copyright-text">© 2024 周转签 版权所有</text>
			<text class="copyright-text">京ICP备xxxxxxxx号</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		methods: {}
	}
</script>

<style scoped>
	.container {
		background-color: #f5f5f5;
		min-height: 100vh;
		padding: 30rpx;
	}

	/* 头部样式 */
	.header {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 60rpx 40rpx;
		text-align: center;
		margin-bottom: 30rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
	}

	.logo {
		width: 120rpx;
		height: 120rpx;
		margin-bottom: 30rpx;
	}

	.app-name {
		display: block;
		font-size: 48rpx;
		font-weight: 700;
		color: #333;
		margin-bottom: 15rpx;
	}

	.app-version {
		display: block;
		font-size: 28rpx;
		color: #666;
	}

	/* 通用区块样式 */
	.intro-section,
	.features-section,
	.contact-section,
	.legal-section {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 40rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
	}

	.section-title {
		margin-bottom: 30rpx;
		padding-bottom: 20rpx;
		border-bottom: 1rpx solid #eee;
	}

	.title-text {
		font-size: 36rpx;
		font-weight: 600;
		color: #333;
	}

	/* 介绍内容样式 */
	.intro-content {
		padding: 20rpx 0;
	}

	.intro-text {
		font-size: 30rpx;
		line-height: 1.6;
		color: #666;
	}

	/* 功能列表样式 */
	.features-list {
		display: flex;
		flex-direction: column;
		gap: 30rpx;
	}

	.feature-item {
		display: flex;
		align-items: center;
		padding: 30rpx;
		background-color: #f8f9fa;
		border-radius: 16rpx;
	}

	.feature-icon {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 36rpx;
		margin-right: 30rpx;
	}

	.feature-content {
		flex: 1;
	}

	.feature-title {
		display: block;
		font-size: 32rpx;
		font-weight: 600;
		color: #333;
		margin-bottom: 10rpx;
	}

	.feature-desc {
		display: block;
		font-size: 26rpx;
		color: #666;
		line-height: 1.4;
	}

	/* 联系方式样式 */
	.contact-list {
		display: flex;
		flex-direction: column;
		gap: 25rpx;
	}

	.contact-item {
		display: flex;
		align-items: center;
		padding: 25rpx 0;
		border-bottom: 1rpx solid #f5f5f5;
	}

	.contact-item:last-child {
		border-bottom: none;
	}

	.contact-icon {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		background-color: #f8f9fa;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		margin-right: 25rpx;
	}

	.contact-content {
		flex: 1;
	}

	.contact-label {
		display: block;
		font-size: 26rpx;
		color: #666;
		margin-bottom: 8rpx;
	}

	.contact-value {
		display: block;
		font-size: 30rpx;
		color: #333;
		font-weight: 500;
	}

	/* 法律声明样式 */
	.legal-content {
		padding: 20rpx 0;
	}

	.legal-text {
		font-size: 28rpx;
		line-height: 1.6;
		color: #666;
	}

	/* 版权信息样式 */
	.copyright-section {
		text-align: center;
		padding: 40rpx 20rpx;
	}

	.copyright-text {
		display: block;
		font-size: 24rpx;
		color: #999;
		margin-bottom: 10rpx;
	}
</style>
