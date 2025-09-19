import {
  Column,
  Model,
  Table,
  BelongsTo,
  ForeignKey,
  DataType,
} from 'sequelize-typescript';

@Table
export class Role extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4, 
    primaryKey: true,
    allowNull: false,
  })
  role_id: string;

  @Column
  role_name: string;

  @Column({ type: DataType.ARRAY(DataType.STRING) })
  permission_list: string[];

  @Column({ defaultValue: true })
  is_active: boolean;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  created_on: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  modified_on: Date;
}

@Table
export class User extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4, 
    primaryKey: true,
    allowNull: false,
  })
  user_id: string;

  @Column
  user_name: string;

  @Column
  email: string;

  @Column
  password: string;

  @Column({ defaultValue: true })
  is_active: boolean;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  created_on: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  modified_on: Date;

  // Foreign key column (must match Role UUID)
  @ForeignKey(() => Role)
  @Column({ type: DataType.UUID }) 
  role_id: string;

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
