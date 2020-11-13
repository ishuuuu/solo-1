import DatabaseConnectionManager from "./database";

import bcrypt from "bcrypt";
import { Repository, getRepository, DeleteResult } from "typeorm";
import User from "./entities/UserModel";



// ライブラリ読み込み
import express from 'express';
// import helmet from 'helmet';
// import cors from 'cors';
const app = express();
// app.use(helmet());
// app.use(cors());
const bodyParser = require('body-parser');

//body-parserの設定
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000; // port番号を指定


// ------ ルーティング ------ //
const router = require('./routes/');
app.use('/', router);

// app.get('/helloWorld', (req, res) => {
//     res.status(200).send({ message: 'hello, world' });
// });

//サーバ起動
app.listen(port);
console.log('listen on port ' + port);

// データベースに接続
DatabaseConnectionManager.connect().then(() => {
    console.log("connect DB");
    // ユーザのデータにアクセス
    let userRepository = getRepository(User);

    async function getUser(userId: string) {
        const user = await userRepository.findOne({
            where: {
                id: userId,
            },
        });
        if (!user) {
            return Promise.resolve(null);
        }
        return Promise.resolve(user);
    }

    async function createUser(userDetails) {
        // 1. Hash password
        const saltRound = 10;
        const passwordHash = await bcrypt.hash(userDetails.password, saltRound);

        // 2. Create user
        const newUser = new User();
        newUser.username = userDetails.username;
        newUser.passwordHash = passwordHash;

        return userRepository.save(newUser);
    }

    createUser({ username: "tester", password: "tester" }).then(result => {
        console.log(result);
    });
    // getUser("test").then(result => {
    //     console.log(result);
    // });;

});

