#!/bin/sh

# 获取待检查的提交信息
commit_msg=$(cat $1)

# 设置颜色变量
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 从commitlint.config.js导入rules变量
rules=$(node -e "console.log(require('./commitlint.config.js').rules['type-enum'][2].join('|'))")

# 检查提交信息是否以指定的前缀开头
if ! echo "$commit_msg" | grep -qE "^($rules):"; then
    echo -e "${RED}Error:${NC} Commit message format is incorrect. It should start with one of '${BLUE}$rules:${NC}'." >&2
    exit 1
fi

# 输出成功校验
echo -e "${BLUE}Commit message check passed.${NC}\n"

# 如果没有错误，则允许提交
exit 0