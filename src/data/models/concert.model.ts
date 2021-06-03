/* eslint import/no-cycle: "off" */
import { DataTypes } from 'sequelize';
import {
  Table,
  PrimaryKey,
  Default,
  Length,
  AllowNull,
  BelongsTo,
  Column,
  Model,
} from 'sequelize-typescript';
import { Musician } from '.';

@Table({
  freezeTableName: true,
})
export default class Concert extends Model {
  @PrimaryKey
  @Length({ min: 0, max: 50 })
  @Column
  name: string;

  @AllowNull(false)
  @Length({ min: 0, max: 200 })
  @Column
  place: string;

  @Default(DataTypes.NOW)
  @Column
  date: Date;

  @Column
  isFree: boolean;

  @BelongsTo(() => Musician, {
    foreignKey: {
      name: 'mainArtist',
      allowNull: false,
    },
    as: 'mainArtitst_',
  })
  mainArtist: Musician;

  @BelongsTo(() => Musician, {
    foreignKey: {
      name: 'secondaryArtist',
    },
    constraints: false,
    as: 'secondaryArtitst_',
  })
  secondaryArtist: Musician;
}
