import { Entity, OneToMany, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import Set from "./SetModel";
import Menu from "./MenuModel";

/**
 * FIXME
 */
@Entity({ name: "workout" })
class Workout {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @OneToMany(() => Set, set => set.workout)
    public set: Set[];

    @ManyToOne(() => Menu, menu => menu.id, { onDelete: 'CASCADE' })
    public menu: Menu;

    @Column({
        type: "date",
    })
    public date: String;
}

export default Workout;
