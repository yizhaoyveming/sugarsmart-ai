import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setupDatabase() {
  try {
    console.log('🔧 开始初始化数据库...\n');

    // 5张核心表的SQL
    const tables = [
      {
        name: 'users',
        sql: `CREATE TABLE IF NOT EXISTS "users" (
          "id" TEXT PRIMARY KEY,
          "username" TEXT UNIQUE NOT NULL,
          "password_hash" TEXT NOT NULL,
          "nickname" TEXT NOT NULL,
          "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`
      },
      {
        name: 'user_profiles',
        sql: `CREATE TABLE IF NOT EXISTS "user_profiles" (
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
        )`
      },
      {
        name: 'glucose_records',
        sql: `CREATE TABLE IF NOT EXISTS "glucose_records" (
          "id" TEXT PRIMARY KEY,
          "user_id" TEXT NOT NULL,
          "record_date" DATE NOT NULL,
          "record_time" TEXT NOT NULL,
          "type" TEXT NOT NULL,
          "value" DOUBLE PRECISION NOT NULL,
          "note" TEXT,
          "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "glucose_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
        )`
      },
      {
        name: 'meal_plans',
        sql: `CREATE TABLE IF NOT EXISTS "meal_plans" (
          "id" TEXT PRIMARY KEY,
          "user_id" TEXT NOT NULL,
          "plan_date" DATE NOT NULL,
          "recipes" JSONB NOT NULL,
          "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "meal_plans_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
          CONSTRAINT "meal_plans_user_id_plan_date_key" UNIQUE ("user_id", "plan_date")
        )`
      },
      {
        name: 'favorites',
        sql: `CREATE TABLE IF NOT EXISTS "favorites" (
          "id" TEXT PRIMARY KEY,
          "user_id" TEXT NOT NULL,
          "recipe_id" TEXT NOT NULL,
          "recipe_name" TEXT NOT NULL,
          "recipe_data" JSONB NOT NULL,
          "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
          CONSTRAINT "favorites_user_id_recipe_id_key" UNIQUE ("user_id", "recipe_id")
        )`
      }
    ];

    // 创建表
    for (const table of tables) {
      console.log(`📋 创建表: ${table.name}...`);
      try {
        await prisma.$executeRawUnsafe(table.sql);
        console.log(`  ✅ 成功\n`);
      } catch (error: any) {
        if (error.message.includes('already exists')) {
          console.log(`  ⚠️  已存在\n`);
        } else {
          console.log(`  ❌ 失败: ${error.message}\n`);
        }
      }
    }

    // 创建索引
    console.log('📋 创建索引...');
    const indexes = [
      'CREATE INDEX IF NOT EXISTS "glucose_records_user_id_record_date_idx" ON "glucose_records"("user_id", "record_date")',
      'CREATE INDEX IF NOT EXISTS "meal_plans_user_id_plan_date_idx" ON "meal_plans"("user_id", "plan_date")',
      'CREATE INDEX IF NOT EXISTS "favorites_user_id_idx" ON "favorites"("user_id")'
    ];

    for (const index of indexes) {
      try {
        await prisma.$executeRawUnsafe(index);
        console.log(`  ✅ 索引创建成功`);
      } catch (error: any) {
        if (error.message.includes('already exists')) {
          console.log(`  ⚠️  索引已存在`);
        }
      }
    }

    console.log('\n✅ 数据库初始化完成！\n');

    // 验证表是否创建成功
    console.log('🔍 验证表创建...\n');
    const result = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN ('users', 'user_profiles', 'glucose_records', 'meal_plans', 'favorites')
      ORDER BY tablename
    `;

    console.log('已创建的表:');
    result.forEach(table => {
      console.log(`  ✓ ${table.tablename}`);
    });

    if (result.length === 5) {
      console.log('\n🎉 所有5张表创建成功！可以开始使用API了！');
    } else {
      console.log(`\n⚠️  只创建了 ${result.length}/5 张表`);
    }

  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setupDatabase();
