import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderPaymentIntentId1713610003000 implements MigrationInterface {
  name = 'AddOrderPaymentIntentId1713610003000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "payment_intent_id" character varying`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_orders_payment_intent_id" ON "orders" ("payment_intent_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_orders_payment_intent_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP COLUMN IF EXISTS "payment_intent_id"`,
    );
  }
}

