// DB用設定
import DatabaseConnectionManager from "./database";
import { getRepository, Repository, Not, IsNull } from "typeorm";
import Menu from "./entities/MenuModel";
import Workout from "./entities/WorkoutModel";
import Set from "./entities/SetModel";
import WorkoutSet from "./WorkoutSet";


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

    const TEST_MENU_ID2 = "ede66c43-9b9d-4222-93ed-5f11c96e08e2";
    const TEST_WORKOUT_ID2 = "78290547-ddd6-4cf2-8fe4-7dd241da3061";
    const TEST_SET_ID2 = "84E1C22D-6180-4613-8DCC-7BB22B2C834B";

    const app = express();
    let menuRepo: Repository<Menu>;
    let workoutRepo: Repository<Workout>;
    let setRepo: Repository<Set>;

    let request;
    let testMenu = new Menu();
    let testWorkout = new Workout();
    let testSet = new Set();
    let testMenu2 = new Menu();
    let testWorkout2 = new Workout();
    let testSet2 = new Set();

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
        testMenu.bodypart = "chest";
        await menuRepo.save(testMenu);
    });

    after(async () => {
        await menuRepo.delete({ id: Not(IsNull()) });
    });

    describe("トレーニングメニューに関するテスト", () => {
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
                bodypart: "belly"
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
                bodypart: "belly"
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
        before(async () => {
            testMenu.id = TEST_MENU_ID;
            testMenu.menuname = "Bench press";
            testMenu.bodypart = "chest";
            await menuRepo.save(testMenu);

            // ワークアウトを登録
            testWorkout.id = TEST_WORKOUT_ID;
            testWorkout.date = "2020-11-14";
            testWorkout.menu = await menuRepo.findOne(TEST_MENU_ID);
            testWorkout = await workoutRepo.save(testWorkout);
            // ワークアウトに紐づくセットセット情報を登録
            testSet.id = TEST_SET_ID;
            testSet.workout = await workoutRepo.findOne(TEST_WORKOUT_ID);
            testSet.weight = 36;
            testSet.count = 10;
            testSet = await setRepo.save(testSet);

            // メニュー2を登録
            testMenu2.id = TEST_MENU_ID2;
            testMenu2.menuname = "Lat pulldown";
            testMenu2.bodypart = "back";
            await menuRepo.save(testMenu2);

            // ワークアウト2を登録
            testWorkout2.id = TEST_WORKOUT_ID2;
            testWorkout2.date = "2020-11-15";
            testWorkout2.menu = await menuRepo.findOne(TEST_MENU_ID2);
            testWorkout2 = await workoutRepo.save(testWorkout2);

            // ワークアウトに紐づくセットセット情報2を登録
            testSet2.id = TEST_SET_ID2;
            testSet2.workout = await workoutRepo.findOne(TEST_WORKOUT_ID2);
            testSet2.weight = 36;
            testSet2.count = 10;
            testSet2 = await setRepo.save(testSet2);

        });

        it("ワークアウトを取得", async function () {
            //Setup
            let workoutSet = new WorkoutSet();
            workoutSet.id = testWorkout.id;
            workoutSet.date = testWorkout.date;
            workoutSet.menu = testWorkout.menu;
            delete testSet.workout;
            workoutSet.set = [testSet];

            let workoutSet2 = new WorkoutSet();
            workoutSet2.id = testWorkout2.id;
            workoutSet2.date = testWorkout2.date;
            workoutSet2.menu = testWorkout2.menu;
            delete testSet2.workout;
            workoutSet2.set = [testSet2];

            const expect = [workoutSet, workoutSet2];

            //Exercise
            const res = await request.get("/workouts");

            //Assert
            assert.strictEqual(res.statusCode, 200);
            assert.deepStrictEqual(res.body, expect);
        });

        it("日付ごとのワークアウトを取得", async function () {
            //Setup
            let workoutSet2 = new WorkoutSet();
            workoutSet2.id = testWorkout2.id;
            workoutSet2.date = testWorkout2.date;
            workoutSet2.menu = testWorkout2.menu;
            delete testSet2.workout;
            workoutSet2.set = [testSet2];

            const expect = [workoutSet2];

            //Exercise
            const res = await request.get("/workouts/2020-11-15");

            //Assert
            assert.strictEqual(res.statusCode, 200);
            assert.deepStrictEqual(res.body, expect);
        });

        it("メニューごとのワークアウトを取得", async function () {
            //Setup
            let workoutSet2 = new WorkoutSet();
            workoutSet2.id = testWorkout2.id;
            workoutSet2.date = testWorkout2.date;
            workoutSet2.menu = testWorkout2.menu;
            delete testSet2.workout;
            workoutSet2.set = [testSet2];

            const expect = [workoutSet2];

            //Exercise
            const res = await request.get("/workouts/Lat pulldown");

            //Assert
            assert.strictEqual(res.statusCode, 200);
            assert.deepStrictEqual(res.body, expect);
        });

        it("ワークアウトを作成", async function () {
            //Setup
            const newWorkout = {
                "date": "2020-11-16",
                "menuname": "Bench press",
                "set": [
                    {
                        "weight": 36,
                        "count": 10
                    }
                ]
            }

            let expect;
            const workoutList = await workoutRepo.find({
                relations: ["menu"]
            });
            const setList = await setRepo.find({
                relations: ["workout"]
            });
            let promiseList = await workoutList.map(async (workout) => {
                let workoutSet = new WorkoutSet();
                workoutSet.id = workout.id;
                workoutSet.date = workout.date;
                workoutSet.menu = workout.menu;
                workoutSet.set = await setList.filter((set) => {
                    return set.workout.id == workout.id
                })
                workoutSet.set = await workoutSet.set.map((set) => {
                    delete set.workout;
                    return set
                })
                return workoutSet;
            });
            await Promise.all(promiseList).then((values) => {
                expect = values;
            });
            expect = expect.filter((workout) => {
                return workout.date == "2020-11-16"
            });

            //Exercise
            const res = await request.post("/workouts").send(newWorkout);

            //Assert
            assert.strictEqual(res.statusCode, 201);
            assert.deepStrictEqual(res.body, expect[0]);
        });



    });

})


