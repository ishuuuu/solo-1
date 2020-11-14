import { getRepository, Repository, DeleteResult } from "typeorm";
import Menu from "../entities/MenuModel";
import Workout from "../entities/WorkoutModel";
import Set from "../entities/SetModel";
import { format } from 'date-fns';

export class WorkoutService{
    protected workoutRepositori: Repository<Workout>;

    constructor() {
        this.workoutRepositori = getRepository(Workout);
    }

    private date2String(date: Date) {
        return format(date, 'YYYY-MM-DD');
    }
    





}

