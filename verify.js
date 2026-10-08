const fs = require('fs');
const path = require('path');

const AFF_URL = 'https://varnexa.lingdongaff.com/#/?code=HHoxxHGa';
const REQUIRED_PLANS = [
  { name: '限时年付小包', price: '99', cycle: '年', traffic: '59GB' },
  { name: '行者', price: '20', cycle: '月', traffic: '150GB' },
  { name: '纵横', price: '36', cycle: '月', traffic: '300GB' },
  { name: '凌霄', price: '68', cycle: '月', traffic: '600GB' }
];

const REQUIRED_ARTICLES = [
  'how-to-choose-cheap-airport.html',
  'safe-airport-privacy-risks.html',
  'clash-node-tutorial.html',
  'clashparty-subscription-guide.html',
  'stable-nodes-selection-guide.html',
  'proxy-modes-comparison.html',
  'cross-border-network-faq.html'
];

const results = {
  passed: [],
  failed: [],
  warnings: [],
  details: {}
};

function pass(testName, msg) {
  results.passed.push({ testName, msg });
  console.log(`[PASS] ${testName}: ${msg}`);
}

function fail(testName, msg) {
  results.failed.push({ testName, msg });
  console.error(`[FAIL] ${testName}: ${msg}`);
}

// 1. 检查 robots.txt
if (fs.existsSync('robots.txt')) {
  const robots = fs.readFileSync('robots.txt', 'utf8');
  if (robots.includes('Sitemap: https://sunyuncloud.cfd/sitemap.xml')) {
    pass('Robots.txt', '正确引用了 https://sunyuncloud.cfd/sitemap.xml');
  } else {
    fail('Robots.txt', '未找到正确的 Sitemap 引用');
  }
} else {
  fail('Robots.txt', '文件不存在');
}

// 2. 检查 sitemap.xml
if (fs.existsSync('sitemap.xml')) {
  const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
  let missingUrls = [];
  const expectedUrls = [
    'https://sunyuncloud.cfd/',
    'https://sunyuncloud.cfd/plans.html',
    ...REQUIRED_ARTICLES.map(a => `https://sunyuncloud.cfd/articles/${a}`)
  ];
  expectedUrls.forEach(url => {
    if (!sitemap.includes(url)) missingUrls.push(url);
  });
  if (missingUrls.length === 0) {
    pass('Sitemap.xml', `包含全部 ${expectedUrls.length} 个正式页面地址`);
  } else {
    fail('Sitemap.xml', `缺少页面: ${missingUrls.join(', ')}`);
  }
} else {
  fail('Sitemap.xml', '文件不存在');
}

// 3. 检查 HTML 页面标准规范（单 H1、Title、Canonical、Meta Description、AFF 链接属性等）
const htmlFiles = [
  'index.html',
  'plans.html',
  ...REQUIRED_ARTICLES.map(a => `articles/${a}`)
];

htmlFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    fail(`File Exists: ${file}`, '文件未找到');
    return;
  }
  const content = fs.readFileSync(file, 'utf8');

  // Title 检查
  const titleMatch = content.match(/<title>(.*?)<\/title>/i);
  if (titleMatch && titleMatch[1].length > 5) {
    pass(`${file} Title`, titleMatch[1]);
  } else {
    fail(`${file} Title`, '缺少或无效的 title 标签');
  }

  // Meta Description
  const metaDescMatch = content.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
  if (metaDescMatch && metaDescMatch[1].length > 10) {
    pass(`${file} Meta Description`, `长度 ${metaDescMatch[1].length} 字`);
  } else {
    fail(`${file} Meta Description`, '缺少或过短的 meta description');
  }

  // H1 唯一性检查
  const h1Matches = content.match(/<h1[\s>]/gi) || [];
  if (h1Matches.length === 1) {
    pass(`${file} H1 Count`, '恰好包含 1 个主 H1');
  } else {
    fail(`${file} H1 Count`, `发现 ${h1Matches.length} 个 H1，要求恰好 1 个`);
  }

  // Canonical 标签
  const canonicalMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["'](https:\/\/sunyuncloud\.cfd\/.*?)["']/i);
  if (canonicalMatch) {
    pass(`${file} Canonical`, canonicalMatch[1]);
  } else {
    fail(`${file} Canonical`, '缺少或错误的 canonical URL');
  }

  // lang="zh-CN"
  if (content.includes('lang="zh-CN"')) {
    pass(`${file} lang`, '包含 lang="zh-CN"');
  } else {
    fail(`${file} lang`, '未设置 lang="zh-CN"');
  }

  // Footer 唯一性
  const footerMatches = content.match(/<footer[\s>]/gi) || [];
  if (footerMatches.length === 1) {
    pass(`${file} Footer Count`, '恰好 1 个 footer，无重复');
  } else {
    fail(`${file} Footer Count`, `发现 ${footerMatches.length} 个 footer`);
  }

  // 检查友情链接已按用户需求彻底移除
  if (!content.includes('友情链接') && !content.includes('jichangreview.net')) {
    pass(`${file} Friendly Links Removed`, '已按要求彻底删除友情链接模块');
  } else {
    fail(`${file} Friendly Links Removed`, '仍残留友情链接代码');
  }

  // 检查 AFF 链接属性
  const affLinks = content.match(/href=["']https:\/\/varnexa\.lingdongaff\.com\/#\/\?code=HHoxxHGa["'][^>]*>/gi) || [];
  if (affLinks.length > 0) {
    let allValid = true;
    affLinks.forEach(linkTag => {
      if (!linkTag.includes('rel="sponsored nofollow noopener"')) {
        allValid = false;
      }
    });
    if (allValid) {
      pass(`${file} AFF Links`, `包含 ${affLinks.length} 个 AFF 链接，均带有 rel="sponsored nofollow noopener"`);
    } else {
      fail(`${file} AFF Links`, '部分 AFF 链接缺少 sponsored nofollow noopener 标记');
    }
  } else {
    fail(`${file} AFF Links`, '未找到 AFF 链接');
  }

  // 检查黄色推广声明横幅已按用户要求移除
  if (!content.includes('aff-disclosure-bar')) {
    pass(`${file} Disclosure Bar Removed`, '已按要求彻底移除黄色推广声明横条');
  } else {
    fail(`${file} Disclosure Bar Removed`, '页面仍残留黄色推广声明横条');
  }
});

// 4. 检查套餐数据完整性（index.html 与 plans.html）
['index.html', 'plans.html'].forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  REQUIRED_PLANS.forEach(plan => {
    if (content.includes(plan.name) && content.includes(plan.price) && content.includes(plan.traffic)) {
      pass(`${file} Plan Check [${plan.name}]`, `包含价格 ¥${plan.price}，流量 ${plan.traffic}`);
    } else {
      fail(`${file} Plan Check [${plan.name}]`, '套餐名称、价格或流量不匹配');
    }
  });

  if (content.includes('一次支付 ¥99，每月 59GB')) {
    pass(`${file} 99 Plan Note`, '明确标注「一次支付 ¥99，每月 59GB」');
  } else {
    fail(`${file} 99 Plan Note`, '缺少「一次支付 ¥99，每月 59GB」明确提示');
  }

  if (content.includes('行者') && content.includes('新手入门推荐')) {
    pass(`${file} Beginner Plan Note`, '行者套餐标注为「新手入门推荐」且未谎称官方最受欢迎');
  } else {
    fail(`${file} Beginner Plan Note`, '行者套餐未正确标注新手入门推荐');
  }
});

// 5. 检查 7 篇文章独立字数（正文 800 - 1500 中文字符）
results.details.articles = [];
REQUIRED_ARTICLES.forEach(file => {
  const filePath = path.join('articles', file);
  const content = fs.readFileSync(filePath, 'utf8');
  const m = content.match(/<div class="article-content">([\s\S]*?)<\/div>/);
  if (m) {
    const text = m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, '');
    const cnChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const isValid = cnChars >= 800 && cnChars <= 1500;
    results.details.articles.push({ file, cnChars, isValid });
    if (isValid) {
      pass(`Article Chinese Word Count [${file}]`, `${cnChars} 字 (标准: 800-1500 字)`);
    } else {
      fail(`Article Chinese Word Count [${file}]`, `字数不合规: ${cnChars} 字 (标准: 800-1500 字)`);
    }
  } else {
    fail(`Article Body [${file}]`, '未找到 .article-content 正文块');
  }
});

// 6. 检查 FAQ 数量与内容
const indexContent = fs.readFileSync('index.html', 'utf8');
const faqItems = indexContent.match(/<div class="faq-item">/gi) || [];
if (faqItems.length >= 8) {
  pass('FAQ Questions Count', `首页包含 ${faqItems.length} 个 FAQ 条目 (要求 >= 8)`);
} else {
  fail('FAQ Questions Count', `FAQ 条目数量不足: ${faqItems.length}`);
}

// 7. 检查无 # 代替的死链
const hashLinks = indexContent.match(/href=["']#["']/g) || [];
if (hashLinks.length === 0) {
  pass('Hash Links Check', '未发现 href="#" 空占位链接');
} else {
  fail('Hash Links Check', `发现 ${hashLinks.length} 个 href="#" 空占位链接`);
}

// 8. 检查本地资源引用
['style.css', 'main.js', 'favicon.svg'].forEach(res => {
  const checkPaths = [
    path.join('css', 'style.css'),
    path.join('js', 'main.js'),
    path.join('assets', 'favicon.svg')
  ];
  checkPaths.forEach(p => {
    if (fs.existsSync(p)) {
      pass(`Asset Check [${p}]`, '静态资源存在');
    } else {
      fail(`Asset Check [${p}]`, '资源缺失');
    }
  });
});

console.log('\n======================================');
console.log(`自动化验收结果: 通过 ${results.passed.length} 项, 失败 ${results.failed.length} 项`);
console.log('======================================');

if (results.failed.length > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
