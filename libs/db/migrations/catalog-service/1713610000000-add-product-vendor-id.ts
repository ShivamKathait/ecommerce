import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductVendorId1713610000000 implements MigrationInterface {
  name = 'AddProductVendorId1713610000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "vendor_id" integer`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_product_vendor_id" ON "product" ("vendor_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_product_vendor_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP COLUMN IF EXISTS "vendor_id"`,
    );
  }
}

