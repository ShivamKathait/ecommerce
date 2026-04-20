import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePaymentHistory1713610004000 implements MigrationInterface {
  name = 'CreatePaymentHistory1713610004000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "payment_history" (
        "id" SERIAL NOT NULL,
        "stripe_event_id" character varying NOT NULL,
        "payment_intent_id" character varying NOT NULL,
        "order_id" character varying,
        "user_id" character varying,
        "customer_id" character varying,
        "event_type" character varying,
        "payment_status" character varying,
        "amount" bigint,
        "currency" character varying NOT NULL DEFAULT 'inr',
        "metadata" jsonb,
        "payload" jsonb,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_payment_history_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_payment_history_stripe_event_id" UNIQUE ("stripe_event_id")
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "idx_payment_history_payment_intent_id" ON "payment_history" ("payment_intent_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_payment_history_order_id" ON "payment_history" ("order_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_payment_history_event_type" ON "payment_history" ("event_type")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "idx_payment_history_event_type"`);
    await queryRunner.query(`DROP INDEX "idx_payment_history_order_id"`);
    await queryRunner.query(
      `DROP INDEX "idx_payment_history_payment_intent_id"`,
    );
    await queryRunner.query(`DROP TABLE "payment_history"`);
  }
}
