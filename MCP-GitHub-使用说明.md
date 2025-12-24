# MCP GitHub 调用使用说明

## 什么是 MCP？

MCP（Model Control Panel/模型上下文协议）是一种标准化协议，用于 AI 助手与外部服务（如 GitHub API）进行交互。它提供了一种统一的方式来调用外部 API，实现自动化工作流和数据集成。

## 如何在当前应用中使用 MCP 调用 GitHub

### 1. 获取 GitHub Personal Access Token

要使用 GitHub API，您需要先生成一个 Personal Access Token：

1. 登录 GitHub
2. 进入 Settings > Developer settings > Personal access tokens > Tokens (classic)
3. 点击 "Generate new token" > "Generate new token (classic)"
4. 为 token 起一个名称，选择过期时间
5. 选择所需的权限（至少需要 `repo` 和 `user` 权限）
6. 点击 "Generate token" 并保存好生成的 token

### 2. 使用应用中的 MCP 功能

当前应用已经集成了 MCP GitHub 客户端，您可以通过以下步骤使用：

1. 在浏览器中打开 `http://localhost:8000`
2. 页面右上角会显示 "使用 MCP 调用 GitHub" 按钮
3. 点击该按钮，按照提示输入您的 GitHub Token
4. 输入要搜索的 GitHub 仓库关键词，点击确定
5. 系统会使用 MCP 协议调用 GitHub API，并显示搜索结果

## MCP GitHub 客户端功能

当前实现的 MCP GitHub 客户端支持以下功能：

| MCP 方法 | 功能描述 | 参数 |
|---------|---------|------|
| `github.getUser` | 获取用户信息 | `username` - GitHub 用户名 |
| `github.getRepo` | 获取仓库信息 | `owner` - 仓库所有者，`repo` - 仓库名称 |
| `github.getRepoContent` | 获取仓库文件内容 | `owner` - 仓库所有者，`repo` - 仓库名称，`path` - 文件路径（可选） |
| `github.getBranches` | 列出仓库分支 | `owner` - 仓库所有者，`repo` - 仓库名称 |
| `github.searchRepos` | 搜索仓库 | `query` - 搜索关键词 |

## 代码结构

### 核心文件

- `mcp-github.js` - MCP GitHub 客户端实现
  - `MCPGitHubClient` 类 - 封装了 GitHub API 调用和 MCP 协议处理
  - `mcpCall` 方法 - 实现 MCP 协议调用
  - `callGitHubMCP` 函数 - 示例调用函数

- `index.html` - 页面结构，包含 MCP 按钮

- `script.js` - 原有应用逻辑

### 如何扩展 MCP 功能

如果您需要添加更多 GitHub API 功能，可以：

1. 在 `MCPGitHubClient` 类中添加新的方法，封装对应的 GitHub API 调用
2. 在 `mcpCall` 方法的 switch 语句中添加新的 case，将 MCP 方法映射到新添加的方法

## 示例代码

以下是使用 MCP 客户端调用 GitHub API 的示例：

```javascript
// 获取用户信息
const user = await window.mcpGitHubClient.mcpCall('getUser', {
    username: 'octocat'
});

// 获取仓库信息
const repo = await window.mcpGitHubClient.mcpCall('getRepo', {
    owner: 'octocat',
    repo: 'hello-world'
});

// 搜索仓库
const searchResult = await window.mcpGitHubClient.mcpCall('searchRepos', {
    query: 'javascript'
});
```

## 注意事项

1. 请妥善保管您的 GitHub Token，不要泄露给他人
2. GitHub API 有速率限制，请勿频繁调用
3. 当前实现使用的是 GitHub API v3，如需使用 v4 (GraphQL)，需要修改客户端实现
4. MCP 协议支持 JSON-RPC 2.0 格式，您可以根据需要扩展协议实现

## 浏览器兼容性

当前实现使用了 Fetch API 和 async/await，支持以下浏览器：

- Chrome 42+
- Firefox 39+
- Safari 10+
- Edge 15+

## 进一步扩展

您可以根据需要扩展 MCP 客户端，实现更多功能：

- 添加 GitHub Actions 支持
- 实现 Pull Request 管理
- 添加 Issues 管理
- 支持 GitHub GraphQL API
- 实现 MCP 服务器端，支持更复杂的工作流

## 联系信息

如果您在使用过程中遇到问题，欢迎反馈和交流。
