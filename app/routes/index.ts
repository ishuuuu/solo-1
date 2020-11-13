import express from 'express';
import { TestService } from '../services/TestService';
// import { UsersService } from '../services/UsersService';

import { MenuService } from '../services/MenuService';

// import helmet from 'helmet';
// import cors from 'cors';
const app = express();
// app.use(helmet());
// app.use(cors());
// ルーティングする
const router = express.Router();

// routerにルーティングの動作を記述する
router.get('/helloWorld', (req, res) => {
    res.status(200).send({ message: 'Hello, world!!!' });
});

router.get('/test', (req, res, next) => {
    const service = new TestService();
    service
        .test()
        .then(result => res.status(200).send(result))
        .catch(next);
});

// router.get('/users/:name', (req, res, next) => {
//     const service = new UsersService();
//     const userName = req.params.name;
//     service
//         .getUser(userName)
//         .then(result => res.status(200).send(result))
//         .catch(next);
// });

// router.post('/users', (req, res, next) => {
//     const service = new UsersService();
//     service
//         .createUser(req.body)
//         .then(result => res.status(201).send(result))
//         .catch(next);
// });

router.get('/menus/', (req, res, next) => {
    const service = new MenuService();
    service
        .getAllMenu()
        .then(result => res.status(200).send(result))
        .catch(next);
});

router.post('/menus', (req, res, next) => {
    const service = new MenuService();
    service
        .createMenu(req.body)
        .then(result => res.status(201).send(result))
        .catch(next);
});


// -------------------------------------------------
//  以下、何のルーティングにもマッチしないorエラー
// -------------------------------------------------

// いずれのルーティングにもマッチしない(==NOT FOUND)
app.use((req, res) => {
    res.status(404);
    res.render('error', {
        param: {
            status: 404,
            message: 'not found'
        },
    });
});

//routerをモジュールとして扱う準備
module.exports = router;