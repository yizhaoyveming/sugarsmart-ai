#!/bin/bash

echo "=== 完整测试：注册 → 登录 → 生成饮食计划（含AI图片）==="
echo ""

# 生成随机用户名
RANDOM_USER="test_$(date +%s)"

echo "步骤1: 注册用户 ($RANDOM_USER)..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$RANDOM_USER\",\"password\":\"test123\",\"nickname\":\"测试用户\"}")

echo "$REGISTER_RESPONSE" | python3 -m json.tool
echo ""

# 提取token
TOKEN=$(echo "$REGISTER_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])" 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo "❌ 注册失败，无法获取token"
  exit 1
fi

echo "✅ 注册成功！Token: ${TOKEN:0:20}..."
echo ""
echo "步骤2: 生成饮食计划（这将需要15-20秒，包括生成文本和3张图片）..."
echo ""

# 用户档案数据
PROFILE='{
  "age": 45,
  "height": 170,
  "weight": 70,
  "gender": "Male",
  "diabetesType": "Type 2",
  "fastingGlucose": "7.5",
  "medication": "二甲双胍",
  "stapleFood": ["米饭", "面条", "全麦面包"],
  "allergies": [],
  "mealsPerDay": 3,
  "specialRequests": "低糖低脂"
}'

# 调用生成饮食计划API（设置更长的超时时间）
MEAL_PLAN_RESPONSE=$(curl --max-time 60 -s -X POST http://localhost:8080/api/meal-plan/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "$PROFILE")

echo "$MEAL_PLAN_RESPONSE" | python3 -m json.tool

echo ""
echo "=== 测试完成 ==="
echo ""
echo "查看上面的输出："
echo "1. 每个食谱应该包含 'imageUrl' 字段"
echo "2. 复制任意 imageUrl 到浏览器查看AI生成的美食图片"
echo "3. 验证图片是否是真实的美食菜肴照片"
