import { getRepository, Repository, DeleteResult } from "typeorm";
import Menu from "../entities/MenuModel";


export class MenuService {
    protected menuRepository: Repository<Menu>;

    constructor() {
        this.menuRepository = getRepository(Menu);
    }

    public async getAllMenu(): Promise<Menu[]> {
        const menu = await this.menuRepository.find();
        if (!menu) {
            return Promise.resolve(null);
        }
        return Promise.resolve(menu);
    }

    public async createMenu(menuDetails: Partial<Menu>): Promise<Menu> {
        const newMenu = new Menu();
        newMenu.menuname = menuDetails.menuname;
        if (menuDetails.bodypart) {
            newMenu.bodypart = menuDetails.bodypart;
        }
        return this.menuRepository.save(newMenu);
    }

    public async updateMenu(menuName: string, menuDetails: Partial<Menu>): Promise<Menu> {
        const targetMenu = await this.menuRepository.findOne({
            where: {
                menuname: menuName,
            },
        });

        if (targetMenu) {
            if (menuDetails.menuname) {
                targetMenu.menuname = menuDetails.menuname;
            };
            if (menuDetails.bodypart) {
                targetMenu.bodypart = menuDetails.bodypart;
            };
            return this.menuRepository.save(targetMenu);
        } else {
            throw new Error("menu not found");
        }
    }

    public async deleteMenu(menuName: string) {
        const targetMenu = await this.menuRepository.findOne({
            where: {
                menuname: menuName,
            },
        });

        if (targetMenu) {
            return this.menuRepository.remove(targetMenu);
        } else {
            throw new Error("menu not found");
        }
    }

}