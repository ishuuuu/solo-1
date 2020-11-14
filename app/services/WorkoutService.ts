import { getRepository, Repository, DeleteResult } from "typeorm";
import Menu from "../entities/MenuModel";
import Workout from "../entities/WorkoutModel";
import Set from "../entities/SetModel";
import WorkoutSet from "../WorkoutSet";


import { format } from 'date-fns';

export class WorkoutService{
    protected menuRepository: Repository<Menu>;
    protected workoutRepository: Repository<Workout>;
    protected setRepository: Repository<Set>;

    constructor() {
        this.menuRepository = getRepository(Menu);
        this.workoutRepository = getRepository(Workout);
        this.setRepository = getRepository(Set);
    }

    // private date2String(date: Date) {
    //     return format(date, 'YYYY-MM-DD');
    // }

    public async getAllWorkout(): Promise<WorkoutSet[]> {
        let resData : WorkoutSet[] = [];
        const workoutList = await this.workoutRepository.find({
            relations: ["menu"]
        });
        const setList = await this.setRepository.find({
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
            resData = values;
        })
        return resData;
    }

    public async getWorkoutByDate(date: string): Promise<WorkoutSet[]> {
        const allWorkoutList = await this.getAllWorkout();
        let resData = allWorkoutList.filter((workout) => {
            return workout.date == date
        })
        return resData;
    }

    public async getWorkoutByMenu(menuname: string): Promise<WorkoutSet[]> {
        const allWorkoutList = await this.getAllWorkout();
        let resData = allWorkoutList.filter((workout) => {
            return workout.menu.menuname == menuname
        })
        return resData;
    }

    public async createWorkout(workoutDetail): Promise<WorkoutSet> {
        let retData = new WorkoutSet();
        const menu = await this.menuRepository.findOne({
            where: {
                menuname: workoutDetail.menuname
            }
        });

        const newWorkout = new Workout();
        newWorkout.date = workoutDetail.date;
        newWorkout.menu = menu;
        const insertedWorkout = await this.workoutRepository.save(newWorkout);
        retData.date = insertedWorkout.date;
        retData.id = insertedWorkout.id;
        retData.menu = insertedWorkout.menu;

        let setList;
        await Promise.all(workoutDetail.set.map(async (setData) => {
            const newSet = new Set();
            newSet.weight = setData.weight;
            newSet.count = setData.count;
            newSet.workout = insertedWorkout;
            return await this.setRepository.save(newSet);
        })).then((values) => {
            setList = values;
        });

        retData.set = setList;
        
        return retData;
    }


}

