import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProcessedEvents1713610005000 implements MigrationInterface {
  name = 'CreateProcessedEvents1713610005000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "processed_events" (
        "id" SERIAL NOT NULL,
        "event_id" character varying NOT NULL,
        "event_type" character varying NOT NULL,
        "source" character varying NOT NULL DEFAULT 'payment-service',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_processed_events_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_processed_events_event_id" UNIQUE ("event_id")
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "idx_processed_events_event_type" ON "processed_events" ("event_type")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_processed_events_created_at" ON "processed_events" ("created_at")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "idx_processed_events_created_at"`);
    await queryRunner.query(`DROP INDEX "idx_processed_events_event_type"`);
    await queryRunner.query(`DROP TABLE "processed_events"`);
  }
}
