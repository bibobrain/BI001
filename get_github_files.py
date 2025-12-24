import requests
import base64
import os
import shutil

# GitHub仓库信息
owner = 'bibobrain'
repo = 'BI001'

# 获取仓库中所有文件
def get_all_files(owner, repo, path=''):
    """递归获取GitHub仓库中的所有文件"""
    url = f'https://api.github.com/repos/{owner}/{repo}/contents/{path}'
    response = requests.get(url)
    
    if response.status_code == 200:
        items = response.json()
        all_files = []
        
        for item in items:
            if item['type'] == 'file':
                all_files.append(item['path'])
            elif item['type'] == 'dir':
                all_files.extend(get_all_files(owner, repo, item['path']))
        
        return all_files
    else:
        print(f'Failed to get files: {response.status_code} {response.reason}')
        return []

def get_github_file_content(owner, repo, file_path):
    """从GitHub API获取文件内容"""
    url = f'https://api.github.com/repos/{owner}/{repo}/contents/{file_path}'
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        return base64.b64decode(data['content'])
    else:
        print(f'Failed to get {file_path}: {response.status_code} {response.reason}')
        return None

def main():
    # 创建临时目录
    temp_dir = 'temp_files'
    if not os.path.exists(temp_dir):
        os.makedirs(temp_dir)
    
    print('Getting files from GitHub...')
    
    # 获取仓库中所有文件
    all_files = get_all_files(owner, repo)
    print(f'Found {len(all_files)} files in the repository')
    
    # 获取每个文件
    for file_path in all_files:
        print(f'Getting {file_path}...')
        content = get_github_file_content(owner, repo, file_path)
        if content:
            # 保存到临时文件
            temp_file = os.path.join(temp_dir, file_path)
            
            # 创建父目录（如果不存在）
            os.makedirs(os.path.dirname(temp_file), exist_ok=True)
            
            # 写入文件（二进制模式）
            with open(temp_file, 'wb') as f:
                f.write(content)
            print(f'Saved {file_path} to {temp_file}')
    
    print('All files processed!')
    print(f'Temporary files are in {temp_dir}')
    
    # 将音乐文件从临时目录复制到assets文件夹
    print('\nCopying music files to assets folder...')
    music_extensions = ['.mp3', '.wav', '.ogg']
    
    # 遍历temp_files目录中的所有文件
    for root, dirs, files in os.walk(temp_dir):
        for file in files:
            if any(file.endswith(ext) for ext in music_extensions):
                src_path = os.path.join(root, file)
                dst_path = os.path.join('assets', file)
                shutil.copy2(src_path, dst_path)
                print(f'Copied {file} to assets folder')
    
    print('All music files copied!')

if __name__ == '__main__':
    main()
