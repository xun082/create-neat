#!/bin/sh

commit_msg_file=$1

# 提取提交信息内容
commit_msg=$(cat $commit_msg_file)

# 设置颜色变量
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 定义提交信息规范函数
check_commit_message() {
    # 提交信息必须以特定关键词开头，后面可以跟着提交信息和issue号（可选）
    if ! echo "$1" | grep -qE "^(feat|fix|docs|style|refactor|test|chore|ci): .+( #[0-9]+)?$"; then
        echo -e "${RED}Error:${NC} Commit message format is incorrect. It should be '${BLUE}(feat|fix|docs|style|refactor|test|chore|ci): commit message (?issue_number)${NC}'." >&2
        exit 1
    fi
}

# 检查提交信息是否符合规范
check_commit_message "$commit_msg"

echo -e 'commit-msg success!\n'