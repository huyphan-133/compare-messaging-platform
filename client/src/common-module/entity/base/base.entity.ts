import { randomUUID } from 'crypto';
import { Column, Index, PrimaryGeneratedColumn } from 'typeorm';

export abstract class BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column({ nullable: true, length: 36 })
    uuid: string = randomUUID();

    @Column({ nullable: true, length: 32, name: 'created_by', default: 'unknown' })
    createdBy: string = 'unknown';

    @Column({ nullable: true, name: 'created_at' })
    createdAt: Date = new Date();

    @Column({ nullable: true, length: 32, name: 'updated_by' })
    updatedBy: string;

    @Column({ nullable: true, name: 'updated_at' })
    updatedAt: Date = new Date();

    @Index()
    @Column({ nullable: true, default: false })
    deleted: boolean = false;

    @Column({ nullable: true, length: 32, name: 'deleted_by' })
    deletedBy: string;

    @Column({ nullable: true, name: 'deleted_at' })
    deletedAt: Date;
}