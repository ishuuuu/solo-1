import { getRepository, Repository, DeleteResult } from "typeorm";
import Menu from "../entities/MenuModel";
import Workout from "../entities/WorkoutModel";
import Set from "../entities/SetModel";
import WorkoutSet from "../WorkoutSet";


import { format } from 'date-fns';

export class WorkoutService{
    protected workoutRepository: Repository<Workout>;
    protected setRepository: Repository<Set>;

    constructor() {
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




}

