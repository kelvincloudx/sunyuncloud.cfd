const fs = require('fs');
const path = require('path');

// 1. Ensure plans/index.html exists
if (!fs.existsSync('plans')) fs.mkdirSync('plans');
fs.copyFileSync('plans.html', 'plans/index.html');
console.log('Created plans/index.html');

// 2. Ensure each article has both articles/<slug>.html and articles/<slug>/index.html
const articlesDir = './articles';
const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.html'));

files.forEach(f => {
  const slug = f.replace('.html', '');
  const subDir = path.join(articlesDir, slug);
  if (!fs.existsSync(subDir)) fs.mkdirSync(subDir);
  fs.copyFileSync(path.join(articlesDir, f), path.join(subDir, 'index.html'));
  console.log(`Created ${subDir}/index.html`);
});
