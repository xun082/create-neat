#!/bin/sh

# 获取两个参数：起始SHA和结束SHA
start_sha=$1
end_sha=$2

# 设置颜色变量
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 定义提交信息规范函数
check_commit_message() {
    commit_msg="$1"
    # 提交信息必须以特定关键词开头，后面可以跟着提交信息和issue号（可选）
    if ! echo "$commit_msg" | grep -qE "^(feat|fix|docs|style|refactor|test|chore|ci): .+( #[0-9]+)?$"; then
        echo -e "${RED}Error:${NC} Commit message format is incorrect. It should be '${BLUE}(feat|fix|docs|style|refactor|test|chore|ci): commit message (?issue_number)${NC}'." >&2
        exit 1
    fi
}

# 遍历从start_sha到end_sha的所有提交
for sha in $(git rev-list $start_sha..$end_sha); do
    commit_msg=$(git show --format=%B -s $sha)
    check_commit_message "$commit_msg"
done

echo -e "${BLUE}Commit message check passed.${NC}\n"
