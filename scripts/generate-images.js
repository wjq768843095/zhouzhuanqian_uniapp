const fs = require('fs');
const path = require('path');

// 确保静态资源目录存在
const staticDir = path.join(__dirname, '../src/static');
if (!fs.existsSync(staticDir)) {
  fs.mkdirSync(staticDir, { recursive: true });
}

// 生成 SVG 图标的函数
function generateSVGIcon(name, content, size = 48, color = '#667eea') {
  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${content}
</svg>`;
  
  fs.writeFileSync(path.join(staticDir, `${name}.svg`), svg);
  console.log(`Generated ${name}.svg`);
}

// 生成轮播图的函数
function generateBannerImage(name, text, bgColor = '#667eea') {
  const svg = `<svg width="750" height="400" viewBox="0 0 750 400" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad${name}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="750" height="400" fill="url(#grad${name})"/>
  <text x="375" y="200" font-family="Arial, sans-serif" font-size="36" font-weight="bold" text-anchor="middle" fill="white">${text}</text>
  <text x="375" y="250" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="rgba(255,255,255,0.8)">周转签 - 专业电子签约平台</text>
</svg>`;
  
  fs.writeFileSync(path.join(staticDir, `${name}.svg`), svg);
  console.log(`Generated ${name}.svg`);
}

// 生成底部导航图标
console.log('Generating tab icons...');

// 首页图标
generateSVGIcon('tab-home', `
  <path d="M24 4L12 14L0 4V0L12 10L24 0V4Z" fill="#999"/>
  <rect x="4" y="14" width="16" height="30" rx="2" fill="#999"/>
  <rect x="8" y="20" width="8" height="6" rx="1" fill="white"/>
  <rect x="10" y="30" width="4" height="8" fill="white"/>
`);

generateSVGIcon('tab-home-current', `
  <path d="M24 4L12 14L0 4V0L12 10L24 0V4Z" fill="#667eea"/>
  <rect x="4" y="14" width="16" height="30" rx="2" fill="#667eea"/>
  <rect x="8" y="20" width="8" height="6" rx="1" fill="white"/>
  <rect x="10" y="30" width="4" height="8" fill="white"/>
`);

// 合同图标
generateSVGIcon('tab-contract', `
  <rect x="8" y="4" width="32" height="40" rx="2" stroke="#999" stroke-width="2" fill="none"/>
  <line x1="12" y1="12" x2="36" y2="12" stroke="#999" stroke-width="2"/>
  <line x1="12" y1="18" x2="36" y2="18" stroke="#999" stroke-width="2"/>
  <line x1="12" y1="24" x2="28" y2="24" stroke="#999" stroke-width="2"/>
  <line x1="12" y1="30" x2="32" y2="30" stroke="#999" stroke-width="2"/>
  <circle cx="34" cy="36" r="6" fill="#999"/>
  <path d="M31 36L33 38L37 34" stroke="white" stroke-width="2" fill="none"/>
`);

generateSVGIcon('tab-contract-current', `
  <rect x="8" y="4" width="32" height="40" rx="2" stroke="#667eea" stroke-width="2" fill="none"/>
  <line x1="12" y1="12" x2="36" y2="12" stroke="#667eea" stroke-width="2"/>
  <line x1="12" y1="18" x2="36" y2="18" stroke="#667eea" stroke-width="2"/>
  <line x1="12" y1="24" x2="28" y2="24" stroke="#667eea" stroke-width="2"/>
  <line x1="12" y1="30" x2="32" y2="30" stroke="#667eea" stroke-width="2"/>
  <circle cx="34" cy="36" r="6" fill="#667eea"/>
  <path d="M31 36L33 38L37 34" stroke="white" stroke-width="2" fill="none"/>
`);

// 个人中心图标
generateSVGIcon('tab-profile', `
  <circle cx="24" cy="16" r="8" stroke="#999" stroke-width="2" fill="none"/>
  <path d="M8 44C8 36 15 30 24 30C33 30 40 36 40 44" stroke="#999" stroke-width="2" fill="none"/>
`);

generateSVGIcon('tab-profile-current', `
  <circle cx="24" cy="16" r="8" stroke="#667eea" stroke-width="2" fill="none"/>
  <path d="M8 44C8 36 15 30 24 30C33 30 40 36 40 44" stroke="#667eea" stroke-width="2" fill="none"/>
`);

// 生成轮播图
console.log('Generating banner images...');

generateBannerImage('banner1', '安全可靠的电子签约平台', '#667eea');
generateBannerImage('banner2', '专业的法律服务支持', '#28a745');
generateBannerImage('banner3', '便捷的借贷管理工具', '#ff6b35');

// 生成个人中心宣传图
const profileBannerSvg = `<svg width="750" height="300" viewBox="0 0 750 300" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="profileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="750" height="300" fill="url(#profileGrad)"/>
  <circle cx="150" cy="150" r="60" fill="rgba(255,255,255,0.2)"/>
  <circle cx="150" cy="130" r="25" fill="white"/>
  <path d="M110 180C110 165 128 153 150 153C172 153 190 165 190 180" fill="white"/>
  <text x="300" y="140" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white">专业可靠的金融服务平台</text>
  <text x="300" y="180" font-family="Arial, sans-serif" font-size="24" fill="rgba(255,255,255,0.8)">安全 · 便捷 · 高效</text>
</svg>`;

fs.writeFileSync(path.join(staticDir, 'profile-banner.svg'), profileBannerSvg);
console.log('Generated profile-banner.svg');

// 生成应用 Logo
const logoSvg = `<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="60" cy="60" r="60" fill="url(#logoGrad)"/>
  <rect x="30" y="35" width="60" height="50" rx="4" fill="white"/>
  <line x1="35" y1="45" x2="85" y2="45" stroke="#667eea" stroke-width="2"/>
  <line x1="35" y1="55" x2="85" y2="55" stroke="#667eea" stroke-width="2"/>
  <line x1="35" y1="65" x2="70" y2="65" stroke="#667eea" stroke-width="2"/>
  <circle cx="80" cy="75" r="8" fill="#667eea"/>
  <path d="M76 75L78 77L84 71" stroke="white" stroke-width="2" fill="none"/>
  <text x="60" y="105" font-family="Arial, sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="white">周转签</text>
</svg>`;

fs.writeFileSync(path.join(staticDir, 'logo.svg'), logoSvg);
console.log('Generated logo.svg');

console.log('\nAll images generated successfully!');
console.log('Note: These are SVG files. For better compatibility, you may want to convert them to PNG format.');
console.log('You can use online tools or imagemagick to convert SVG to PNG if needed.');
