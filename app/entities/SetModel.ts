import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import Workout from "./WorkoutModel";

@Entity({ name: "set" })
class Set {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({
        type: "float",
    })
    public weight: number;

    @Column({
        type: "int",
    })
    public count: number;

    @ManyToOne(() => Workout, workout => workout.id, { onDelete: 'CASCADE' })
    public workout: Workout;

}

export default Set;