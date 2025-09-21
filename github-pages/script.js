// 视频解析接口列表
const API_LIST = [
    { id: 'api1', name: '接口 1', url: 'https://jx.jsonplayer.com/player/?url=', speed: '综合' },
    { id: 'api2', name: '接口 2', url: 'https://jx.aidouer.net/?url=', speed: '稳定' },
    { id: 'api3', name: '接口 3', url: 'https://jx.m3u8.tv/jiexi/?url=', speed: '高清' },
    { id: 'api4', name: '接口 4', url: 'https://jx.bozrc.com:4433/player/?url=', speed: '流畅' },
    { id: 'api5', name: '接口 5', url: 'https://jx.playerjy.com/?url=', speed: '备用' }
];

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    setupEventListeners();
    checkMobile();
});

// 初始化应用
function initApp() {
    // 动态生成API选择器按钮
    const apiSelector = document.getElementById('apiSelector');
    if (apiSelector) {
        apiSelector.innerHTML = '';
        
        API_LIST.forEach((api, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'api-btn' + (index === 0 ? ' active' : '');
            button.setAttribute('data-api', api.id);
            button.innerHTML = `${api.name} <span class="api-speed">${api.speed}</span>`;
            apiSelector.appendChild(button);
        });
    }
    
    // 添加PWA安装提示
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(reg => console.log('Service Worker registered'))
                .catch(err => console.log('Service Worker registration failed: ', err));
        });
    }
}

// 设置事件监听器
function setupEventListeners() {
    // 网页版按钮点击事件
    const webAppBtn = document.getElementById('webAppBtn');
    if (webAppBtn) {
        webAppBtn.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('webApp').style.display = 'block';
            document.getElementById('playerSection').style.display = 'block';
            // 滚动到应用区域
            document.getElementById('webApp').scrollIntoView({behavior: 'smooth'});
        });
    }

    // API选择器点击事件
    document.querySelectorAll('.api-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.api-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 解析按钮点击事件
    const parseBtn = document.getElementById('parseBtn');
    if (parseBtn) {
        parseBtn.addEventListener('click', parseVideo);
    }

    // 视频URL输入框回车事件
    const videoUrlInput = document.getElementById('videoUrl');
    if (videoUrlInput) {
        videoUrlInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                parseVideo();
            }
        });
    }
}

// 解析视频
function parseVideo() {
    const videoUrl = document.getElementById('videoUrl').value.trim();
    if (!videoUrl) {
        showToast('请输入视频链接');
        return;
    }

    // 验证URL格式
    if (!isValidUrl(videoUrl)) {
        showToast('请输入有效的视频链接');
        return;
    }

    // 获取当前选中的API
    const activeApiBtn = document.querySelector('.api-btn.active');
    if (!activeApiBtn) {
        showToast('请选择解析接口');
        return;
    }

    const apiId = activeApiBtn.getAttribute('data-api');
    const api = API_LIST.find(a => a.id === apiId);
    
    if (!api) {
        showToast('解析接口不可用，请选择其他接口');
        return;
    }

    // 显示加载动画
    showLoading(true);
    
    // 更新播放器
    const playerContainer = document.getElementById('playerContainer');
    playerContainer.innerHTML = `<iframe src="${api.url}${encodeURIComponent(videoUrl)}" frameborder="0" allowfullscreen style="width:100%;height:100%;"></iframe>`;
    
    // 隐藏加载动画
    setTimeout(() => {
        showLoading(false);
    }, 1500);
}

// 显示/隐藏加载动画
function showLoading(show) {
    const loadingElement = document.getElementById('loading');
    if (!loadingElement) {
        const loading = document.createElement('div');
        loading.id = 'loading';
        loading.className = 'loading-overlay';
        loading.innerHTML = '<div class="spinner"></div><p>正在解析视频，请稍候...</p>';
        document.body.appendChild(loading);
    }
    
    document.getElementById('loading').style.display = show ? 'flex' : 'none';
}

// 显示提示消息
function showToast(message) {
    let toast = document.getElementById('toast');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast-message';
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// 验证URL格式
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

// 检测移动设备并优化界面
function checkMobile() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
        // 自动显示网页版应用
        document.getElementById('webApp').style.display = 'block';
        document.getElementById('playerSection').style.display = 'block';
        
        // 添加移动端特定样式
        document.body.classList.add('mobile-device');
    }
}