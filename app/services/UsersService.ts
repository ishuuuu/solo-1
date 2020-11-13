import { getRepository, Repository, DeleteResult } from "typeorm";
import User from "../entities/UserModel";
import bcrypt from "bcrypt";

interface UserInput extends User {
    password: string;
}

export class UsersService {
    protected userRepository: Repository<User>;

    constructor() {
        this.userRepository = getRepository(User);
    }

    public async getUser(userName: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: {
                username: userName,
            },
        });
        if (!user) {
            return Promise.resolve(null);
        }
        return Promise.resolve(user);
        // return Promise.resolve(new User());
    }

    /**
     * Create a new user
     */
    public async createUser(userDetails: Partial<UserInput>): Promise<User> {
        // 1. Hash password
        const saltRound = 10;
        const passwordHash = await bcrypt.hash(userDetails.password, saltRound);

        // 2. Create user
        const newUser = new User();
        newUser.username = userDetails.username;
        newUser.passwordHash = passwordHash;

        return this.userRepository.save(newUser);
    }

}

// export default UsersService;