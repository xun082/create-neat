#!/bin/bash

# 设置颜色变量
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 从commitlint.config.js导入rules变量
rules=$(node -e "console.log(require('./commitlint.config.js').rules['type-enum'][2].join('|'))")

# 定义提交信息规范函数
check_commit_message() {
    commit_msg="$1"
    # 检查提交信息是否以指定的前缀开头
    if ! echo "$commit_msg" | grep -qE "^($rules):"; then
        echo -e "${RED}Error:${NC} Commit message format is incorrect for the following message:" >&2
        echo "$commit_msg" >&2
        exit 1
    fi
}

# 获取本地尚未推送的提交SHA值
commit_sha_list=$(git log origin/main..HEAD --format="%H")

# 遍历所有尚未推送的提交，并检查提交消息格式
for sha in $commit_sha_list; do
    commit_msg=$(git show --format=%B -s $sha)
    check_commit_message "$commit_msg"
done

# 输出成功校验
echo -e "${BLUE}Commit message check passed.${NC}\n"
