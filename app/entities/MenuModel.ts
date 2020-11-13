import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "menu" })
class Menu {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({
        length: 100,
    })
    public menuname: string;

    @Column({
        nullable: true,
        length: 100,
    })
    public bodypart: string;
}

export default Menu;
