const populationYears = [1970,1975,1980,1985,1990,1995,2000,2005,2010,2015,2020,2025,2030,2035,2040,2045,2050,2055,2060,2065,2070];
const taiwan65 = [2.92,3.5,4.29,5.06,6.22,7.64,8.62,9.74,10.74,12.51,16.07,20.02,24.23,27.91,31.04,35.02,38.42,40.58,43.16,45.62,46.54];
const korea65  = [3.31,3.48,3.87,4.33,4.98,5.93,7.33,9.28,11.3,12.96,15.99,20.3,25.3,29.9,34.3,37.3,40.1,41.7,44.2,null,null];

const agingYears = Array.from({length: 51}, (_,i)=>2000+i); // 2000..2050
const taiwanAging = [
    40.9,42.3,44.2,46.6,49,52,55.2,58.1,61.5,65.1,68.6,72.2,76.2, // 2000-2012
    80.5,85.7,92.2,98.9,105.7,112.6,119.8,127.8,136.3,144.9,153.8,163.7,172.3, // 2013-2025
    183.4,198,210.8,226.1,242.6,260.1,276.2,292.4,309,324.3,339.1,350.4,360.7, // 2026-2038
    372.8,384,397.9,410,422.6,435.2,446.9,458.5,469.5,479.2,488.1,495.5,null // 2039-2050 (2050 無值 -> null)
];
const koreaAging = [
    35,null,null,null,null,48.6,null,null,null,null,69.7,null,null, // 2000-2012
    null,null,95.2,100.1,107.3,113.9,122.3,132.5,143,156.1,171,181.2,199.9, // 2013-2025
    222.7,244,267.6,288.2,312,336,356.8,375.1,393.1,406.7,418.7,427.6,434.6, // 2026-2038
    439.8,442.2,443.7,446,449.7,454.6,462.1,470.5,479.8,488.6,496.5,504,null // 2039-2050 (2050 後無更多資料)
];

function buildDataset(label, data, color) {
    return {
        label,
        data,
        borderColor: color,
        backgroundColor: color.replace(')', ', 0.12)').replace('rgb','rgba'),
        tension: 0.25,
        spanGaps: false,
        fill: true
    };
}

function initNavigation() {
    const buttons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    
    // 漢堡菜單切換 - 使用更安全的事件處理
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            
            this.classList.toggle('active');
            if (navMenu) {
                navMenu.classList.toggle('active');
            }
        }, false);
    }
    
    // 點擊選單項目
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            
            const target = this.getAttribute('data-target');
            
            // 切換section
            sections.forEach(s => s.classList.remove('active'));
            const targetSection = document.getElementById(target);
            if (targetSection) {
                targetSection.classList.add('active');
                targetSection.setAttribute('tabindex', '-1');
                targetSection.focus({ preventScroll: true });
            }
            
            // 更新按鈕狀態
            buttons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 關閉選單
            if (hamburgerBtn) hamburgerBtn.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
        }, false);
    });
    
    // 點擊選單外區域關閉選單 - 使用更精確的檢測
    document.addEventListener('click', function(e) {
        const clickedNav = e.target.closest('.nav');
        const clickedMenu = e.target.closest('.nav-menu');
        const clickedTypewriter = e.target.closest('.typewriter');
        
        // 如果點擊的是打字區域，不做任何處理
        if (clickedTypewriter) return;
        
        if (!clickedNav && !clickedMenu) {
            if (hamburgerBtn) hamburgerBtn.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
        }
    }, false);
}

function initCharts() {
    const populationCtx = document.getElementById('populationChart').getContext('2d');
    new Chart(populationCtx, {
        type: 'line',
        data: {
            labels: populationYears,
            datasets: [
                buildDataset('Taiwan', taiwan65, 'rgb(74,111,165)'),
                buildDataset('South Korea', korea65, 'rgb(44,62,80)')
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'nearest', intersect: false },
            plugins: {
                title: { display: true, text: 'Age 65+ percentage' },
                tooltip: { callbacks: { label: ctx => ctx.parsed.y == null ? '(缺資料)' : ctx.parsed.y + '%' } }
            },
            scales: {
                x: { title: { display: true, text: 'Year' } },
                y: { title: { display: true, text: 'Percentage (%)' }, beginAtZero: false }
            }
        }
    });

    const agingIndexCtx = document.getElementById('agingIndexChart').getContext('2d');
    new Chart(agingIndexCtx, {
        type: 'line',
        data: {
            labels: agingYears,
            datasets: [
                buildDataset('Taiwan Aging Index', taiwanAging, 'rgb(74,111,165)'),
                buildDataset('South Korea Aging Index', koreaAging, 'rgb(44,62,80)')
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'nearest', intersect: false },
            plugins: {
                title: { display: true, text: 'Aging Index Comparison' },
                tooltip: { callbacks: { label: ctx => ctx.parsed.y == null ? '(缺資料)' : ctx.parsed.y } }
            },
            scales: {
                x: { title: { display: true, text: 'Year' } },
                y: { title: { display: true, text: 'Aging Index' }, beginAtZero: false }
            }
        }
    });
}

// 數字動畫功能
function initStatAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const statCards = document.querySelectorAll('.stat-card');
    
    function resetStatCard(card) {
        card.classList.remove('animate', 'animated');
        const statNumber = card.querySelector('.stat-number');
        if (statNumber) {
            // 重置為起始值
            const startValue = statNumber.getAttribute('data-start');
            const suffix = statNumber.getAttribute('data-suffix') || '';
            const decimal = parseInt(statNumber.getAttribute('data-decimal')) || 0;
            
            if (startValue) {
                if (decimal > 0) {
                    statNumber.textContent = parseFloat(startValue).toFixed(decimal) + suffix;
                } else {
                    statNumber.textContent = startValue + suffix;
                }
            }
        }
    }
    
    function animateNumber(element) {
        const target = parseFloat(element.getAttribute('data-target'));
        const suffix = element.getAttribute('data-suffix') || '';
        const decimal = parseInt(element.getAttribute('data-decimal')) || 0;
        const startValue = parseFloat(element.getAttribute('data-start'));
        const duration = 2000; // 2秒
        const startTime = performance.now();
        
        function updateNumber(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 使用easeOut效果，適用於上升動畫
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = startValue + (target - startValue) * easeOutProgress;
            
            if (decimal > 0) {
                element.textContent = currentValue.toFixed(decimal) + suffix;
            } else {
                element.textContent = Math.round(currentValue) + suffix;
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = (decimal > 0 ? target.toFixed(decimal) : target) + suffix;
            }
        }
        
        requestAnimationFrame(updateNumber);
    }
    
    // 觀察器來檢測元素進入和離開視口
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 進入視口時播放動畫
                if (!entry.target.classList.contains('animate')) {
                    entry.target.classList.add('animate');
                    const statNumber = entry.target.querySelector('.stat-number');
                    if (statNumber) {
                        setTimeout(() => animateNumber(statNumber), 300);
                    }
                }
            } else {
                // 離開視口時重置狀態
                resetStatCard(entry.target);
            }
        });
    }, { 
        threshold: 0.3,
        rootMargin: '-50px 0px -50px 0px'
    });
    
    statCards.forEach(card => observer.observe(card));
}

// 打字效果功能
let typewriterInterval = null;

function initTypewriter() {
    const typewriterElement = document.getElementById('typewriter');
    if (!typewriterElement) return;
    
    // 清除任何現有的定時器
    if (typewriterInterval) {
        clearTimeout(typewriterInterval);
        typewriterInterval = null;
    }
    
    const texts = [
        "The name comes from the words Incheon and Taiwan.",
        "This project is to study the social issues of aging in South Korea and Taiwan.",
        "The team includes four members from Taiwan and South Korea."
    ];
    let currentTextIndex = 0;
    let currentIndex = 0;
    let isDeleting = false;
    
    function typeText() {
        if (!typewriterElement || !document.body.contains(typewriterElement)) {
            return;
        }
        
        const currentText = texts[currentTextIndex];
        
        if (!isDeleting) {
            typewriterElement.innerHTML = currentText.substring(0, currentIndex) + '<span class="typewriter-cursor"></span>';
            currentIndex++;
            
            if (currentIndex > currentText.length) {
                typewriterInterval = setTimeout(() => {
                    if (typewriterElement && document.body.contains(typewriterElement)) {
                        isDeleting = true;
                        typeText();
                    }
                }, 2500);
                return;
            }
        } else {
            typewriterElement.innerHTML = currentText.substring(0, currentIndex) + '<span class="typewriter-cursor"></span>';
            currentIndex--;
            
            if (currentIndex < 0) {
                isDeleting = false;
                currentIndex = 0;
                currentTextIndex = (currentTextIndex + 1) % texts.length;
                
                typewriterInterval = setTimeout(() => {
                    if (typewriterElement && document.body.contains(typewriterElement)) {
                        typeText();
                    }
                }, 1000);
                return;
            }
        }

        const speed = isDeleting ? 40 : 70;
        typewriterInterval = setTimeout(() => {
            if (typewriterElement && document.body.contains(typewriterElement)) {
                typeText();
            }
        }, speed);
    }
    
    // 立即開始打字
    typeText();
}

window.addEventListener('load', () => {
    const introOverlay = document.getElementById('introOverlay');
    const skipButton = document.getElementById('skipIntro');
    const body = document.body;
    
    function endIntroAnimation() {
        introOverlay.classList.add('fade-out');
        body.classList.remove('intro-active');
        body.classList.add('intro-finished');
        setTimeout(() => {
            initTypewriter();
        }, 1500);
        
        setTimeout(() => {
            if (introOverlay.parentNode) {
                introOverlay.parentNode.removeChild(introOverlay);
            }
        }, 1000);
    }
    
    setTimeout(endIntroAnimation, 4500);
    
    skipButton.addEventListener('click', endIntroAnimation);
    
    document.addEventListener('keydown', function skipOnKeyPress() {
        endIntroAnimation();
        document.removeEventListener('keydown', skipOnKeyPress);
    });
    
    introOverlay.addEventListener('click', function skipOnClick(e) {
        if (e.target === introOverlay) {
            endIntroAnimation();
        }
    });
    
    setTimeout(() => {
        initNavigation();
        initCharts();
        initStatAnimation();
    }, 1000);
});
