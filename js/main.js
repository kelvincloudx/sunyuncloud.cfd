/**
 * 瞬云 (SunYun Cloud) 交互脚本
 * 功能: 移动端导航展开折叠、平滑滚动、无外部依赖
 */
document.addEventListener('DOMContentLoaded', function () {
  // 移动端菜单切换
  var toggleBtn = document.getElementById('mobileToggle');
  var mobileNav = document.getElementById('mobileNav');

  if (toggleBtn && mobileNav) {
    toggleBtn.addEventListener('click', function () {
      var isOpen = mobileNav.classList.contains('open');
      if (isOpen) {
        mobileNav.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      } else {
        mobileNav.classList.add('open');
        toggleBtn.setAttribute('aria-expanded', 'true');
      }
    });

    // 点击菜单内链接自动关闭
    var mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 平滑滚动对应同页面锚点
  var anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      var targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        var headerOffset = 80;
        var elementPosition = targetEl.getBoundingClientRect().top;
        var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
