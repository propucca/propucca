import { Column, Model, Table, BelongsTo } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table
export class User extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  username: string;

  @Column
  name: string;

  @Column
  picture: string;

  @Column
  social_id: number;

  @Column({ defaultValue: true })
  is_active: boolean;

  @Column({ defaultValue: new Date() })
  created_on: Date;

  @Column({ defaultValue: new Date() })
  modified_on: Date;
}

@Table
export class Post extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  title: string;

  @Column(DataTypes.TEXT)
  content: string;

  @Column({ defaultValue: true })
  is_active: boolean;

  @Column({ defaultValue: new Date() })
  created_on: Date;

  @Column({ defaultValue: new Date() })
  modified_on: Date;

  @BelongsTo(() => User, {
    foreignKey: 'user_id',
    as: 'user',
    onDelete: 'CASCADE',
  })
  @Column
  user_id: number;
}
