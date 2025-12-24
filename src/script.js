// 文档内容
const documentContent = `@祝福
###
平安夜的传说永恒流转
岁月漫长地令人平和

在这连接过去现在的仪式里
祝你每一天的平安喜乐
祝你的每一天都独一无二

可惜

要是能这么简单地结束就好了

淡淡的祝福很是衬贴这漫长的时光
但不太适合这种还未来得及道别的场景

—————我从未向谁认真地道别
好像显得云淡风轻便能消解那些远去之人的重量

所以

作为补偿
作为特别的一个

无论是昨天，今天还是明天

天晴，天阴还是下雨

如果以后再也见不到你

祝你 早安，午安，晚安

@想你，她和马戏团
###
你会怎样看这一切呢

喜欢？

虽然听上去是如此

但要是用“喜欢”来囊括这所有
我不由得为此不忿

要是改用一样苍白而或许更为贴切的说法

是  "想你"

不过时间的酝酿为其添加了太多的注脚
变成为难以形容的某种东西

我经常怀疑我所想的到底是谁
与你到底有什么关系？

准确地讲
她可能可以称得上是你的某种延伸吧

但既然这种分化是如此的封闭与自我
又有何必要将我对她的遐思与追忆

像自顾自的刨开青春墓碑向他人展示
自己干瘪的裸体艺术一般地残喘而出呢？

"我之念你，与你无干"
便就此免去诸多废话了

马戏团里有过去的猴子自说自话
搞些不知所以的行为艺术

但既然真正想送出祝福已经抵达
就没必要再自以为是地附上一个马戏团的聒噪了

无论如何
 
感谢你能看到这里
感谢你这么完美地出现在我的记忆中

如果以后再也见不到你
祝你 早安，午安，晚安`;

// 页面数据
let pages = [];
let currentPage = 0;
let currentPart = 1;
const totalParts = 2;

// DOM元素
const pagesContainer = document.getElementById('pages-container');
const pageInfo = document.getElementById('page-info');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const audio = document.getElementById('audio');

// 辅助函数：获取第一部分的最后一页索引
function getPart1LastIndex() {
    for (let i = pages.length - 1; i >= 0; i--) {
        if (pages[i].part === 1) {
            return i;
        }
    }
    return -1;
}

// 辅助函数：获取第二部分的起始索引
function getPart2StartIndex() {
    return pages.findIndex(page => page.part === 2);
}

// 解析文档内容，让每个空行和###都变为下一页显示
function parseDocument() {
    // 清空pages数组
    pages = [];
    
    // 直接从原始文档内容解析，让每个空行和###都作为分页标记
    const lines = documentContent.split('\n');
    let currentPageContent = '';
    let currentTitle = '';
    let currentPart = 1;
    
    for (let i = 0; i < lines.length; i++) {
        const originalLine = lines[i];
        const trimmedLine = originalLine.trim();
        
        if (trimmedLine.startsWith('@')) {
            // 标题行，检查是否切换到第二部分
            currentTitle = trimmedLine.substring(1);
            if (currentTitle === '想你，她和马戏团') {
                currentPart = 2;
            }
        } else if (trimmedLine === '###' || (trimmedLine === '' && currentPageContent.trim() !== '')) {
            // ###或空行作为分页标记，且当前页面有内容
            if (currentPageContent.trim()) {
                pages.push({
                    title: currentTitle,
                    content: currentPageContent.trim(),
                    part: currentPart
                });
                currentPageContent = '';
            }
        } else {
            // 普通内容行，保留原始格式
            currentPageContent += originalLine + '\n';
        }
    }
    
    // 添加最后一页
    if (currentPageContent.trim()) {
        pages.push({
            title: currentTitle,
            content: currentPageContent.trim(),
            part: currentPart
        });
    }
}



// 渲染页面
function renderPages() {
    pagesContainer.innerHTML = '';
    
    pages.forEach((page, index) => {
        const pageElement = document.createElement('div');
        pageElement.className = `page ${index === currentPage ? 'active' : ''}`;
        
        // 添加内容，保留原始格式，直接设置文本内容
        if (page.content.trim()) {
            // 直接设置文本内容，保留原始换行格式，不使用p标签
            pageElement.textContent = page.content;
        }
        
        pagesContainer.appendChild(pageElement);
    });
    
    // 更新分页信息
    updatePagination();
}

// 更新分页控件，确保第一部分和第二部分之间有明确分隔
function updatePagination() {
    // 动态计算第一部分和第二部分的范围
    // 第一部分：祝福，第二部分：想你，她和马戏团
    let partStart, partEnd, partCurrent, partTotal;
    
    // 使用辅助函数获取第一部分的最后一页索引
    const part1LastIndex = getPart1LastIndex();
    
    if (currentPage <= part1LastIndex) {
        // 第一部分
        partStart = 0;
        partEnd = part1LastIndex;
        partCurrent = currentPage + 1;
        partTotal = part1LastIndex + 1;
    } else {
        // 第二部分
        partStart = part1LastIndex + 1;
        partEnd = pages.length - 1;
        partCurrent = currentPage - part1LastIndex;
        partTotal = pages.length - part1LastIndex;
    }
    
    // 更新页码显示，只显示当前部分的页码
    pageInfo.textContent = `${partCurrent} / ${partTotal}`;
    
    // 禁用分页按钮，确保第一部分和第二部分之间不能直接切换
    prevBtn.disabled = currentPage === partStart;
    nextBtn.disabled = currentPage === partEnd;
}

// 切换到指定页面，确保第一部分和第二部分之间有明确分隔
function goToPage(pageIndex) {
    // 确保第一部分和第二部分之间有明确分隔
    // 第一部分：0-3页，第二部分：4-8页
    if (pageIndex >= 0 && pageIndex < pages.length) {
        currentPage = pageIndex;
        
        // 更新页面显示
        const pageElements = document.querySelectorAll('.page');
        pageElements.forEach((element, index) => {
            element.classList.toggle('active', index === currentPage);
        });
        
        updatePagination();
    }
}

// 音乐播放功能
function handleMusicItemClick(musicItem) {
    // 获取音乐源
    const selectedMusic = musicItem.dataset.src;
    
    // 移除所有音乐项的active类
    document.querySelectorAll('.music-item').forEach(item => {
        item.classList.remove('active');
    });
    
    if (selectedMusic) {
        // 添加当前音乐项的active类
        musicItem.classList.add('active');
        // 设置音乐源并播放
        audio.src = selectedMusic;
        audio.play().catch(error => {
            // console.log('自动播放被阻止，请手动播放:', error);
        });
    } else {
        // 如果选择的是"无"，暂停音乐并清空源
        audio.pause();
        audio.src = '';
    }
}

// 返回首页
function goToHome() {
    // 重置当前页面
    currentPage = 0;
    currentPart = 1;
    
    // 隐藏文档内容，显示选择页面
    document.getElementById('selection-page').style.display = 'flex';
    document.getElementById('pagination').style.display = 'none';
    document.getElementById('pages-container').style.display = 'none';
    
    // 显示音乐选择器
    document.querySelector('.music-selector').style.display = 'flex';
}

// 初始化
function init() {
    // 解析文档
    parseDocument();
    
    // 初始化音乐选择器显示状态
    document.querySelector('.music-selector').style.display = 'flex';
    
    // 添加事件监听器
    prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
    nextBtn.addEventListener('click', () => goToPage(currentPage + 1));
    
    // 添加音乐项点击事件监听器
    const musicItems = document.querySelectorAll('.music-item');
    musicItems.forEach(item => {
        item.addEventListener('click', () => {
            handleMusicItemClick(item);
        });
    });
    
    // 点击页面空白处可以前进到下一页，确保第一部分和第二部分之间有明确分隔
    pagesContainer.addEventListener('click', () => {
        // 使用辅助函数获取第一部分的最后一页索引
        const part1LastIndex = getPart1LastIndex();
        
        // 确保在第一部分的最后一页点击不会进入第二部分，在第二部分的最后一页点击不会继续前进
        if (currentPage < pages.length - 1 && 
            !((currentPage === part1LastIndex) || (currentPage === pages.length - 1))) {
            goToPage(currentPage + 1);
        }
    });
    
    // 添加键盘导航支持
    document.addEventListener('keydown', (e) => {
        // 使用辅助函数获取第一部分的最后一页索引
        const part1LastIndex = getPart1LastIndex();
        
        switch (e.key) {
            case 'ArrowRight':
            case ' ': // 空格键
                e.preventDefault();
                if (currentPage < pages.length - 1 && 
                    !((currentPage === part1LastIndex) || (currentPage === pages.length - 1))) {
                    goToPage(currentPage + 1);
                }
                break;
            case 'ArrowLeft':
                e.preventDefault();
                if (currentPage > 0) {
                    goToPage(currentPage - 1);
                }
                break;
            case 'Escape':
                // 按ESC键返回首页
                goToHome();
                break;
        }
    });
    
    // 添加选择页面事件监听器
    const bulletLinks = document.querySelectorAll('.bullet-link');
    bulletLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-target');
            
            // 隐藏选择页面，显示文档内容
            document.getElementById('selection-page').style.display = 'none';
            document.getElementById('pagination').style.display = 'flex';
            document.getElementById('pages-container').style.display = 'flex';
            
            // 隐藏音乐选择器
            document.querySelector('.music-selector').style.display = 'none';
            
            // 渲染页面
            renderPages();
            
            // 根据目标跳转到对应部分
            if (target === 'missing') {
                // 跳转到第二部分的第一页
                // 使用辅助函数获取第二部分的起始索引
                const part2StartIndex = getPart2StartIndex();
                if (part2StartIndex !== -1) {
                    goToPage(part2StartIndex);
                }
            } else {
                // 跳转到第一部分的第一页
                goToPage(0);
            }
        });
    });
    
    // 添加固定home链接的事件监听器
    document.getElementById('home-link').addEventListener('click', (e) => {
        e.preventDefault();
        goToHome();
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
