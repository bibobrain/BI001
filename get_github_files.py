import requests
import base64
import os
import shutil

# GitHub仓库信息
owner = 'bibobrain'
repo = 'BI001'

# 要获取的文件列表
files_to_get = ['index.html', 'script.js', 'style.css']

def get_github_file_content(owner, repo, file_path):
    """从GitHub API获取文件内容"""
    url = f'https://api.github.com/repos/{owner}/{repo}/contents/{file_path}'
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        content = base64.b64decode(data['content']).decode('utf-8')
        return content
    else:
        print(f'Failed to get {file_path}: {response.status_code} {response.reason}')
        return None

def main():
    # 创建临时目录
    temp_dir = 'temp_files'
    if not os.path.exists(temp_dir):
        os.makedirs(temp_dir)
    
    print('Getting files from GitHub...')
    
    # 获取每个文件
    for file_path in files_to_get:
        print(f'Getting {file_path}...')
        content = get_github_file_content(owner, repo, file_path)
        if content:
            # 保存到临时文件
            temp_file = os.path.join(temp_dir, file_path)
            with open(temp_file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'Saved {file_path} to {temp_file}')
            
            # 替换现有文件
            existing_file = file_path
            if os.path.exists(existing_file):
                # 先备份现有文件
                backup_file = f'{existing_file}.bak'
                # 如果备份文件已存在，先删除它
                if os.path.exists(backup_file):
                    os.remove(backup_file)
                    print(f'Removed existing backup {backup_file}')
                # 然后重命名现有文件为备份文件
                os.rename(existing_file, backup_file)
                print(f'Backed up existing {existing_file} to {backup_file}')
            
            # 复制新文件
            shutil.copy(temp_file, existing_file)
            print(f'Replaced {existing_file} with new content')
    
    print('All files processed!')
    print(f'Temporary files are in {temp_dir}')

if __name__ == '__main__':
    main()
