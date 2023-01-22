import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class OAuth {
    @PrimaryGeneratedColumn({ type: "integer" })
    Id: number;

    @Column()
    access_token: string;
    @Column()
    token_type: string;
    @Column()
    jwt_token: string;

    @Column()
    User: string;
}