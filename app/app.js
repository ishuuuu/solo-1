"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ライブラリ読み込み
const express_1 = __importDefault(require("express"));
// import helmet from 'helmet';
// import cors from 'cors';
const app = express_1.default();
// app.use(helmet());
// app.use(cors());
const bodyParser = require('body-parser');
//body-parserの設定
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = process.env.PORT || 3000; // port番号を指定
app.get('/helloWorld', (req, res) => {
    res.status(200).send({ message: 'hello, world' });
});
//サーバ起動
app.listen(port);
console.log('listen on port ' + port);
