import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInventoryReservationSupport1713610001000
  implements MigrationInterface
{
  name = 'AddInventoryReservationSupport1713610001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "inventory" ADD COLUMN IF NOT EXISTS "reserved_quantity" integer NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "ux_inventory_product_id" ON "inventory" ("product_id")`,
    );

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "inventory_reservation" (
        "id" SERIAL NOT NULL,
        "reservation_id" character varying NOT NULL,
        "product_id" integer NOT NULL,
        "quantity" integer NOT NULL,
        "status" character varying NOT NULL DEFAULT 'reserved',
        "expires_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_inventory_reservation_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_inventory_reservation_reservation_id" UNIQUE ("reservation_id")
      )
    `);

    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "ux_inventory_reservation_id" ON "inventory_reservation" ("reservation_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_inventory_reservation_product_id" ON "inventory_reservation" ("product_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_inventory_reservation_status" ON "inventory_reservation" ("status")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_inventory_reservation_status"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_inventory_reservation_product_id"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "ux_inventory_reservation_id"`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS "inventory_reservation"`,
    );

    await queryRunner.query(
      `DROP INDEX IF EXISTS "ux_inventory_product_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" DROP COLUMN IF EXISTS "reserved_quantity"`,
    );
  }
}

