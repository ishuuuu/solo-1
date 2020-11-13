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

    public async getMenu(menuName: string): Promise<Menu> {
        const menu = await this.menuRepository.findOne({
            where: {
                menuname: menuName,
            },
        });
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
}