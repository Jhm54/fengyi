// 解析接口列表
const apiList = [
    { name: "线路1", url: "https://jx.jsonplayer.com/player/?url=" },
    { name: "线路2", url: "https://jx.aidouer.net/?url=" },
    { name: "线路3", url: "https://jx.xmflv.com/?url=" },
    { name: "线路4", url: "https://jx.m3u8.tv/jiexi/?url=" },
    { name: "线路5", url: "https://jx.nnxv.cn/tv.php?url=" }
];

// 当前使用的接口索引
let currentApiIndex = 0;

// 初始化AOS动画库
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
});

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 解析表单提交
    document.getElementById('parseForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const videoUrl = document.getElementById('videoUrl').value.trim();
        
        if (!isValidUrl(videoUrl)) {
            showToast('请输入有效的视频URL', 'warning');
            return;
        }
        
        parseVideo(videoUrl);
    });

    // API选择器点击事件
    document.querySelectorAll('#apiSelector button').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('#apiSelector button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentApiIndex = parseInt(this.getAttribute('data-api'));
            
            const videoUrl = document.getElementById('videoUrl').value.trim();
            if (videoUrl && isValidUrl(videoUrl)) {
                parseVideo(videoUrl);
            }
        });
    });

    // 返回顶部按钮
    const backToTopButton = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// 解析视频
function parseVideo(url) {
    const resultDiv = document.getElementById('result');
    const videoFrame = document.getElementById('videoFrame');
    
    // 显示加载中
    resultDiv.style.display = 'block';
    videoFrame.src = '';
    
    // 显示加载动画
    showLoading(true);
    
    // 使用当前接口解析
    const api = apiList[currentApiIndex];
    videoFrame.src = api.url + encodeURIComponent(url);
    
    // 显示提示消息
    showToast(`正在使用${api.name}解析，请稍候...`, 'info');
    
    // 监听iframe加载完成
    videoFrame.onload = function() {
        showLoading(false);
        showToast('解析成功，开始播放', 'success');
    };
    
    // 如果解析失败，可以尝试下一个接口
    videoFrame.onerror = function() {
        showLoading(false);
        showToast('当前线路解析失败，请尝试切换其他线路', 'warning');
    };
}

// 验证URL格式
function isValidUrl(url) {
    try {
        new URL(url);
        // 简单检查是否是视频网站URL
        const videoSites = ['v.qq.com', 'iqiyi.com', 'youku.com', 'mgtv.com', 'bilibili.com', 'sohu.com', 'pptv.com', 'le.com'];
        return videoSites.some(site => url.includes(site));
    } catch (e) {
        return false;
    }
}

// 显示加载动画
function showLoading(show) {
    // 这里可以实现加载动画
    // 简化版本，直接使用console
    if (show) {
        console.log('加载中...');
    } else {
        console.log('加载完成');
    }
}

// 显示提示消息
function showToast(message, type = 'info') {
    // 检查是否已存在toast容器
    let toastContainer = document.querySelector('.toast-container');
    
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    // 创建toast元素
    const toastId = 'toast-' + Date.now();
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.id = toastId;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    // 设置toast内容
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    // 添加到容器
    toastContainer.appendChild(toast);
    
    // 初始化Bootstrap toast
    const bsToast = new bootstrap.Toast(toast, {
        autohide: true,
        delay: 3000
    });
    
    // 显示toast
    bsToast.show();
    
    // 监听隐藏事件，移除DOM元素
    toast.addEventListener('hidden.bs.toast', function() {
        toast.remove();
    });
}

// 检测移动设备
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}