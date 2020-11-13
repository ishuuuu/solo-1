import DatabaseConnectionManager from "./database";


// ライブラリ読み込み
import express from 'express';

const app = express();

const bodyParser = require('body-parser');

//body-parserの設定
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



// ------ ルーティング ------ //
const router = require('./routes/');
app.use('/', router);

//サーバ起動
const port = process.env.PORT || 3000; // port番号を指定
app.listen(port);
console.log('listen on port ' + port);

// データベースに接続
DatabaseConnectionManager.connect().then(() => {
    console.log("connect DB");
});

