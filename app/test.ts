import DatabaseConnectionManager from "./database";
const chai = require("chai");
const chaiHttp = require("chai-http");
// const expect = chai.expect;
chai.use(chaiHttp);
const assert = chai.assert;

import express from 'express';


describe("solo1 server test", () => {
    const app = express();
    let request;
    
    before(async () => {
        await DatabaseConnectionManager.connect().then(() => {
            console.log("connect DB");
            //body-parserの設定
            const bodyParser = require('body-parser');
            app.use(bodyParser.urlencoded({ extended: true }));
            app.use(bodyParser.json());
            // ------ ルーティング ------ //
            const router = require('./routes/');
            app.use('/', router);
            //サーバ起動
            // const port = process.env.PORT || 3000; // port番号を指定
            // app.listen(port);
            // console.log('listen on port ' + port);
            console.log("setup finish start test");
        })
    });

    beforeEach(() => {
        request = chai.request(app);
    });

    it("get all menu data", async function () {
        //Setup

        //Exercise
        const res = await request.get("/menus");

        //Assert
        assert.strictEqual(res.statusCode, 200);
        assert.deepEqual(res.body, {});
    });

})


