#!/bin/bash

echo "=== 测试生成饮食计划（包含AI图片）==="
echo ""
echo "正在调用后端API..."
echo ""

# 注意：这里需要先注册/登录获取token
# 为了测试，我们先尝试直接调用（可能需要token）

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

# 调用生成饮食计划API
curl -X POST http://localhost:8080/api/meal-plan/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token-bypass" \
  -d "$PROFILE" \
  | python3 -m json.tool

echo ""
echo "=== 测试完成 ==="
echo ""
echo "查看上面的输出："
echo "1. 如果返回401错误，说明需要先登录获取token"
echo "2. 如果成功，应该能看到3个食谱，每个都包含imageUrl字段"
echo "3. 复制imageUrl到浏览器查看AI生成的美食图片"
