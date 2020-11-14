// DB用設定
import DatabaseConnectionManager from "./database";
import { getRepository, Repository, Not, IsNull } from "typeorm";
import Menu from "./entities/MenuModel";
import Workout from "./entities/WorkoutModel";
import Set from "./entities/SetModel";

// テスト用設定
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const assert = chai.assert;

import express from 'express';


describe("solo1 server test", () => {
    const TEST_MENU_ID = "3461cac2-35bd-4d45-a163-f220beb43d76";
    const TEST_WORKOUT_ID = "c52ac1b9-dd73-4913-a906-275a3f217629";
    const TEST_SET_ID = "235c612a-76df-4fb9-82a8-04184b1522f8";
    const app = express();
    let menuRepo: Repository<Menu>;
    let workoutRepo: Repository<Workout>;
    let setRepo: Repository<Set>;
    
    let request;
    let testMenu = new Menu();
    let testWorkout = new Workout();
    let testSet = new Set();

    before(async () => {
        await DatabaseConnectionManager.connect().then(() => {
            console.log("connect DB");
            //body-parserの設定
            const bodyParser = require('body-parser');
            app.use(bodyParser.urlencoded({ extended: true }));
            app.use(bodyParser.json());
            // ルーティング
            const router = require('./routes/');
            app.use('/', router);
            // リポジトリ登録
            menuRepo = getRepository(Menu);
            workoutRepo = getRepository(Workout);
            setRepo = getRepository(Set);
            // 確認用コンソールログ
            console.log("setup finish start test");
        })
        await menuRepo.delete({ id: Not(IsNull()) });
    });

    beforeEach(async () => {
        request = chai.request(app);
        testMenu.id = TEST_MENU_ID;
        testMenu.menuname = "Bench press";
        testMenu.bodypart = "Pectoral";
        await menuRepo.save(testMenu);
    });

    after(async () => {
        await menuRepo.delete({ id: Not(IsNull()) });
    });

    describe.skip("トレーニングメニューに関するテスト", () => {
        it("全てのトレーニングメニューを取得", async function () {
            //Setup

            //Exercise
            const res = await request.get("/menus");

            //Assert
            assert.strictEqual(res.statusCode, 200);
            assert.deepEqual(res.body, [testMenu]);
        });

        it("トレーニングメニューを登録", async function () {
            //Setup
            const newMenu = {
                menuname: "Abdominal",
                bodypart: "abdominal"
            };

            //Exercise
            const res = await request.post("/menus").send(newMenu);

            //Assert
            assert.strictEqual(res.statusCode, 201);
            assert.deepEqual(res.body.menuname, newMenu.menuname);
            assert.deepEqual(res.body.bodypart, newMenu.bodypart);
        });

        it("トレーニングメニューを修正", async function () {
            //Setup
            const modifyMenu = {
                bodypart: "abdominal"
            };

            //Exercise
            const res = await request.patch("/menus/Bench press").send(modifyMenu);

            //Assert
            assert.strictEqual(res.statusCode, 200);
            assert.deepEqual(res.body.menuname, "Bench press");
            assert.deepEqual(res.body.bodypart, modifyMenu.bodypart);
        });

        it("トレーニングメニューを削除", async function () {
            //Setup

            //Exercise
            const res = await request.delete("/menus/Bench press");

            //Assert
            assert.strictEqual(res.statusCode, 200);
            const user = await menuRepo.findOne({
                where: {
                    menuname: "Bench press",
                },
            });
            assert.strictEqual(user, undefined);
        });

        it("トレーニングメニューを削除", async function () {
            //Setup

            //Exercise
            const res = await request.delete("/menus/Bench press");

            //Assert
            assert.strictEqual(res.statusCode, 200);
            const user = await menuRepo.findOne({
                where: {
                    menuname: "Bench press",
                },
            });
            assert.strictEqual(user, undefined);
        });
    });



    describe("ワークアウトに関するテスト", () => {
        beforeEach(async () => {
            // ワークアウトを登録
            testWorkout.id = TEST_WORKOUT_ID;
            testWorkout.date = "2020-11-14";
            testWorkout.menu = await menuRepo.findOne(TEST_MENU_ID);
            await workoutRepo.save(testWorkout);
            // ワークアウトに紐づくセットセット情報を登録
            testSet.id = TEST_SET_ID;
            testSet.workout = await workoutRepo.findOne(TEST_WORKOUT_ID);
            testSet.weight = 36;
            testSet.count = 10;
            await setRepo.save(testSet);
        });

        it("ワークアウトを取得", async function () {
            //Setup

            //Exercise
            // const res = await request.delete("/menus/Bench press");

            //Assert
            // assert.strictEqual(res.statusCode, 200);
            // const user = await menuRepo.findOne({
            //     where: {
            //         menuname: "Bench press",
            //     },
            // });
            // assert.strictEqual(user, undefined);
        });
    });

})


