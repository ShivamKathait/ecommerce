import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrders1713610002000 implements MigrationInterface {
  name = 'CreateOrders1713610002000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "order_status_enum" AS ENUM ('pending_payment', 'confirmed', 'cancelled', 'failed')
    `);

    await queryRunner.query(`
      CREATE TABLE "orders" (
        "id" SERIAL NOT NULL,
        "user_id" integer NOT NULL,
        "status" "order_status_enum" NOT NULL DEFAULT 'pending_payment',
        "total_amount" numeric(12,2) NOT NULL DEFAULT 0,
        "currency" character varying NOT NULL DEFAULT 'INR',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_orders_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "order_items" (
        "id" SERIAL NOT NULL,
        "order_id" integer NOT NULL,
        "product_id" integer NOT NULL,
        "quantity" integer NOT NULL,
        "reservation_id" character varying NOT NULL,
        "unit_price" numeric(12,2) NOT NULL DEFAULT 0,
        "line_total" numeric(12,2) NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_order_items_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_order_items_order_id" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "idx_orders_user_id" ON "orders" ("user_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_order_items_order_id" ON "order_items" ("order_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_order_items_reservation_id" ON "order_items" ("reservation_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "idx_order_items_reservation_id"`);
    await queryRunner.query(`DROP INDEX "idx_order_items_order_id"`);
    await queryRunner.query(`DROP INDEX "idx_orders_user_id"`);
    await queryRunner.query(`DROP TABLE "order_items"`);
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TYPE "order_status_enum"`);
  }
}

