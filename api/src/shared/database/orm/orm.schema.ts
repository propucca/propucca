import { Column, Model, Table, BelongsTo, ForeignKey, DataType, Default } from 'sequelize-typescript';

@Table
export class Role extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  role_id: number;

  @Column
  role_name: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  permission_list: string[];

  @Column({ defaultValue: true })
  is_active: boolean;

  @Column({ defaultValue: new Date() })
  created_on: Date;

  @Column({ defaultValue: new Date() })
  modified_on: Date;
}


@Table
export class User extends Model {
 @Default(DataType.UUIDV4) // auto-generate UUID in ORM
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
  })
  user_id: string;

  @Column
  user_name:string;

  @Column
  email: string;

  @Column
  password: string;

  @Column({ defaultValue: true })
  is_active: boolean;

  @Column({ defaultValue: new Date() })
  created_on: Date;

  @Column({ defaultValue: new Date() })
  modified_on: Date;

  // Foreign key column
  @ForeignKey(() => Role)
  @Column
  role_id: number;

  // Association
  @BelongsTo(() => Role, { as: 'role' })
  role: Role;
}

@Table
export class Otp extends Model {
  @Column
  email: string;

  @Column
  otp: string;

  @Column
  expires_at: string;
}
