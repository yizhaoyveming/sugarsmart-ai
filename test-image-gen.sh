#!/bin/bash

echo "=== 测试豆包文生图API ==="
echo ""
echo "Prompt: 美食菜肴摄影作品：燕麦粥配浆果这道菜"
echo ""

curl -X POST https://ark.cn-beijing.volces.com/api/v3/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer bfffdf1c-c056-47a6-ba54-bbace3ba28f5" \
  -d '{"model":"doubao-seedream-4-0-250828","prompt":"美食菜肴摄影作品：燕麦粥配浆果这道菜，真实的食物照片，精美摆盘在白色瓷盘上，自然光线，高清细节，食物特写镜头，餐桌场景，专业美食摄影，诱人可口，4K高清，restaurant food photography","size":"2K","response_format":"url","watermark":false,"stream":false}' \
  | python3 -m json.tool

echo ""
echo "=== 测试完成 ==="
echo "如果成功，上面会显示图片URL，复制URL到浏览器即可查看图片"
