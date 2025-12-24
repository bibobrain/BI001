// MCP GitHub 客户端实现
class MCPGitHubClient {
    constructor() {
        this.baseUrl = 'https://api.github.com';
        this.token = '';
    }

    // 设置 GitHub Token
    setToken(token) {
        this.token = token;
    }

    // 通用请求方法
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Authorization': this.token ? `token ${this.token}` : '',
            'Accept': 'application/vnd.github.v3+json',
            ...options.headers
        };

        const response = await fetch(url, {
            ...options,
            headers
        });

        if (!response.ok) {
            throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
        }

        return response.json();
    }

    // 获取用户信息
    async getUser(username) {
        return this.request(`/users/${username}`);
    }

    // 获取仓库信息
    async getRepo(owner, repo) {
        return this.request(`/repos/${owner}/${repo}`);
    }

    // 获取仓库文件内容
    async getRepoContent(owner, repo, path = '') {
        return this.request(`/repos/${owner}/${repo}/contents/${path}`);
    }

    // 列出仓库分支
    async getBranches(owner, repo) {
        return this.request(`/repos/${owner}/${repo}/branches`);
    }

    // 搜索仓库
    async searchRepos(query) {
        return this.request(`/search/repositories?q=${encodeURIComponent(query)}`);
    }

    // MCP 协议封装：将 GitHub API 调用封装为 MCP 请求
    async mcpCall(method, params = {}) {
        const mcpRequest = {
            jsonrpc: '2.0',
            method: `github.${method}`,
            params,
            id: Date.now()
        };

        // 根据方法名调用对应的 GitHub API
        switch (method) {
            case 'getUser':
                return this.getUser(params.username);
            case 'getRepo':
                return this.getRepo(params.owner, params.repo);
            case 'getRepoContent':
                return this.getRepoContent(params.owner, params.repo, params.path);
            case 'getBranches':
                return this.getBranches(params.owner, params.repo);
            case 'searchRepos':
                return this.searchRepos(params.query);
            default:
                throw new Error(`Unsupported MCP method: ${method}`);
        }
    }
}

// 创建全局 MCP GitHub 客户端实例
window.mcpGitHubClient = new MCPGitHubClient();

// 创建 MCP 输入表单
function createMCPForm() {
    // 检查是否已存在表单
    if (document.getElementById('mcp-form-container')) {
        return;
    }
    
    const formContainer = document.createElement('div');
    formContainer.id = 'mcp-form-container';
    formContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 2000;
    `;
    
    const formContent = document.createElement('div');
    formContent.style.cssText = `
        background-color: white;
        padding: 30px;
        border-radius: 10px;
        width: 400px;
        max-width: 90%;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    `;
    
    formContent.innerHTML = `
        <h2 style="margin-top: 0; color: #333;">使用 MCP 调用 GitHub</h2>
        
        <div style="margin-bottom: 20px;">
            <label for="github-token" style="display: block; margin-bottom: 5px; font-weight: bold;">GitHub Token:</label>
            <input type="text" id="github-token" placeholder="请输入你的 GitHub Personal Access Token" 
                   style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
        </div>
        
        <div style="margin-bottom: 20px;">
            <label for="search-query" style="display: block; margin-bottom: 5px; font-weight: bold;">搜索关键词:</label>
            <input type="text" id="search-query" placeholder="请输入要搜索的 GitHub 仓库关键词" 
                   style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
        </div>
        
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button id="cancel-mcp" style="
                padding: 8px 16px;
                background-color: #f44336;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            ">取消</button>
            <button id="submit-mcp" style="
                padding: 8px 16px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            ">提交</button>
        </div>
    `;
    
    formContainer.appendChild(formContent);
    document.body.appendChild(formContainer);
    
    // 添加事件监听器
    document.getElementById('cancel-mcp').addEventListener('click', () => {
        formContainer.style.display = 'none';
    });
    
    document.getElementById('submit-mcp').addEventListener('click', async () => {
        await handleMCPFormSubmit();
    });
    
    // 点击表单外部关闭
    formContainer.addEventListener('click', (e) => {
        if (e.target === formContainer) {
            formContainer.style.display = 'none';
        }
    });
}

// 处理 MCP 表单提交
async function handleMCPFormSubmit() {
    try {
        const token = document.getElementById('github-token').value.trim();
        const searchQuery = document.getElementById('search-query').value.trim();
        
        if (!token) {
            alert('Token 不能为空');
            return;
        }
        
        if (!searchQuery) {
            alert('搜索关键词不能为空');
            return;
        }
        
        window.mcpGitHubClient.setToken(token);
        
        const result = await window.mcpGitHubClient.mcpCall('searchRepos', {
            query: searchQuery
        });
        
        // 显示结果
        const repos = result.items.slice(0, 5); // 只显示前5个结果
        let resultText = `找到 ${result.total_count} 个仓库，前5个结果：\n\n`;
        
        repos.forEach(repo => {
            resultText += `名称: ${repo.name}\n`;
            resultText += `描述: ${repo.description || '无描述'}\n`;
            resultText += `星标: ${repo.stargazers_count}\n`;
            resultText += `链接: ${repo.html_url}\n\n`;
        });
        
        alert(resultText);
        
        // 关闭表单
        document.getElementById('mcp-form-container').style.display = 'none';
    } catch (error) {
        alert(`调用失败: ${error.message}`);
        console.error('MCP GitHub 调用错误:', error);
    }
}

// MCP 调用示例函数
function callGitHubMCP() {
    // 显示 MCP 表单
    document.getElementById('mcp-form-container').style.display = 'flex';
}

// 将 MCP 调用按钮添加到页面
function addMCPButton() {
    // 先创建表单
    createMCPForm();
    
    const mcpButton = document.createElement('button');
    mcpButton.textContent = '使用 MCP 调用 GitHub';
    mcpButton.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        z-index: 1000;
    `;
    
    mcpButton.addEventListener('click', callGitHubMCP);
    document.body.appendChild(mcpButton);
}

// 页面加载完成后添加 MCP 按钮
document.addEventListener('DOMContentLoaded', addMCPButton);
