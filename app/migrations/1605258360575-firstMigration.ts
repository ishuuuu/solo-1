import {MigrationInterface, QueryRunner} from "typeorm";

export class firstMigration1605258360575 implements MigrationInterface {
    name = 'firstMigration1605258360575'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "menu" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "menuname" character varying(100) NOT NULL, "bodypart" character varying(100), CONSTRAINT "PK_35b2a8f47d153ff7a41860cceeb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "workout" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" date NOT NULL, "menuId" uuid, CONSTRAINT "PK_ea37ec052825688082b19f0d939" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "set" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "weight" double precision NOT NULL, "count" integer NOT NULL, "workoutId" uuid, CONSTRAINT "PK_3a80144a9f862484a2cae876eed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "workout" ADD CONSTRAINT "FK_2b0f68447659a91c533d30d8fca" FOREIGN KEY ("menuId") REFERENCES "menu"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "set" ADD CONSTRAINT "FK_018f6279568f980998d219b0c0b" FOREIGN KEY ("workoutId") REFERENCES "workout"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "set" DROP CONSTRAINT "FK_018f6279568f980998d219b0c0b"`);
        await queryRunner.query(`ALTER TABLE "workout" DROP CONSTRAINT "FK_2b0f68447659a91c533d30d8fca"`);
        await queryRunner.query(`DROP TABLE "set"`);
        await queryRunner.query(`DROP TABLE "workout"`);
        await queryRunner.query(`DROP TABLE "menu"`);
    }

}
