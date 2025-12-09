-- SugarSmart AI 数据库初始化脚本
-- 只创建新表，不删除任何现有表

-- 1. 用户表
CREATE TABLE IF NOT EXISTS "users" (
  "id" TEXT PRIMARY KEY,
  "username" TEXT UNIQUE NOT NULL,
  "password_hash" TEXT NOT NULL,
  "nickname" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. 用户档案表
CREATE TABLE IF NOT EXISTS "user_profiles" (
  "user_id" TEXT PRIMARY KEY,
  "age" INTEGER,
  "height" DOUBLE PRECISION,
  "weight" DOUBLE PRECISION,
  "gender" TEXT,
  "diabetes_type" TEXT,
  "fasting_glucose" TEXT,
  "medication" TEXT,
  "staple_food" JSONB,
  "allergies" JSONB,
  "meals_per_day" INTEGER,
  "special_requests" TEXT,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 3. 血糖记录表
CREATE TABLE IF NOT EXISTS "glucose_records" (
  "id" TEXT PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "record_date" DATE NOT NULL,
  "record_time" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "value" DOUBLE PRECISION NOT NULL,
  "note" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "glucose_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 4. 饮食计划表
CREATE TABLE IF NOT EXISTS "meal_plans" (
  "id" TEXT PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "plan_date" DATE NOT NULL,
  "recipes" JSONB NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "meal_plans_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "meal_plans_user_id_plan_date_key" UNIQUE ("user_id", "plan_date")
);

-- 5. 收藏表
CREATE TABLE IF NOT EXISTS "favorites" (
  "id" TEXT PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "recipe_id" TEXT NOT NULL,
  "recipe_name" TEXT NOT NULL,
  "recipe_data" JSONB NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "favorites_user_id_recipe_id_key" UNIQUE ("user_id", "recipe_id")
);

-- 创建索引
CREATE INDEX IF NOT EXISTS "glucose_records_user_id_record_date_idx" ON "glucose_records"("user_id", "record_date");
CREATE INDEX IF NOT EXISTS "meal_plans_user_id_plan_date_idx" ON "meal_plans"("user_id", "plan_date");
CREATE INDEX IF NOT EXISTS "favorites_user_id_idx" ON "favorites"("user_id");

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为users表添加触发器
DROP TRIGGER IF EXISTS update_users_updated_at ON "users";
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON "users"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 为user_profiles表添加触发器
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON "user_profiles";
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON "user_profiles"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
