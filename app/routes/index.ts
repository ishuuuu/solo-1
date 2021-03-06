import express from 'express';
import { TestService } from '../services/TestService';
import { MenuService } from '../services/MenuService';
import { WorkoutService } from '../services/WorkoutService';

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

router.patch('/menus/:menuName', (req, res, next) => {
    const service = new MenuService();
    try {
    service
        .updateMenu(req.params.menuName, req.body)
        .then(result => res.status(200).send(result))
        .catch(next);
    } catch (e) {
        res.status(400).end();
    }
});

router.delete('/menus/:menuName', (req, res, next) => {
    const service = new MenuService();
    try {
        service
            .deleteMenu(req.params.menuName)
            .then(result => res.status(200).end())
            .catch(next);
    } catch (e) {
        res.status(400).end();
    }

});

router.get('/workouts', (req, res, next) => {
    const service = new WorkoutService();
    service
        .getAllWorkout()
        .then(result => res.status(200).send(result))
        .catch(next);
});

router.get('/workouts/:dateOrMenu', (req, res, next) => {
    const service = new WorkoutService();
    const param = req.params.dateOrMenu;
    const datePattern = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])/
    if (datePattern.test(param)) {
        service
            .getWorkoutByDate(param)
            .then(result => res.status(200).send(result))
            .catch(next);        
    } else {
        service
            .getWorkoutByMenu(param)
            .then(result => res.status(200).send(result))
            .catch(next);        
    }
});

router.post('/workouts', (req, res, next) => {
    const service = new WorkoutService();
    service
        .createWorkout(req.body)
        .then(result => res.status(201).send(result))
        .catch(next);
});

router.delete('/workouts/:id', (req, res, next) => {
    const service = new WorkoutService();
    try {
        service
            .deleteWorkout(req.params.id)
            .then(result => res.status(200).end())
            .catch(next);
    } catch (e) {
        res.status(400).end();
    }

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