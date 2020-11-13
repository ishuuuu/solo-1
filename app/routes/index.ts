import express from 'express';
import { TestService } from '../services/TestService';
import { MenuService } from '../services/MenuService';

const app = express();
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

router.get('/menus', (req, res, next) => {
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