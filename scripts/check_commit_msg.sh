#!/bin/sh

# 获取两个参数：起始SHA和结束SHA
start_sha=$1
end_sha=$2

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
    if ! echo "$commit_msg" | grep -qE "^($rules)(\(.+\))?:|^Revert \"(($rules)(\(.+\))?:.+)\"$"; then
        echo -e "${RED}Error:${NC} Commit message format is incorrect. It should start with one of '${BLUE}^($rules)(\(.+\))?:${NC}'." >&2
        exit 1
    fi
}

# workflows传入两个参数，遍历从start_sha到end_sha的所有提交
 if [ $# -eq 2 ]; then
for sha in $(git rev-list $start_sha..$end_sha); do
    commit_msg=$(git show --format=%B -s $sha)
    check_commit_message "$commit_msg"
done
# huksy触发commit-msg钩子时传入一个参数
elif [ $# -eq 1 ]; then
   check_commit_message "$(cat $1) "
else
   echo -e "${RED} error: Failed to get commit message\n"
fi

echo -e "${BLUE}Commit message check passed.${NC}\n"
