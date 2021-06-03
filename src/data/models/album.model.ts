/* eslint import/no-cycle: "off" */
import { DataTypes } from 'sequelize';
import {
  Min,
  IsIn,
  Table,
  AllowNull,
  PrimaryKey,
  Default,
  Length,
  AutoIncrement,
  BelongsTo,
  HasMany,
  Column,
  Model,
  BelongsToMany,
  IsDate,
  Max,
} from 'sequelize-typescript';
import { albumGenreChoices } from 'server/utils/constants/fieldChoices';
import { Song, Musician } from 'data/models';

@Table({
  freezeTableName: true,
})
export default class Album extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @AllowNull(false)
  @Length({ min: 0, max: 80 })
  @Column
  name: string;

  @IsIn(albumGenreChoices)
  @Column
  genre: string;

  @IsDate
  @Default(DataTypes.NOW)
  @Column(DataTypes.DATEONLY)
  releaseDate: Date;

  @Max(5)
  @Min(0)
  @Column
  numStars: number;

  @Min(2.0)
  @Max(10.2)
  @Default(3.0)
  @Column(DataTypes.FLOAT)
  ranking: number;

  @Length({ min: 0, max: 12 })
  @Column
  upc: string;

  @HasMany(() => Song, {
    foreignKey: { name: 'album', allowNull: false },
    as: 'songs',
    onDelete: 'cascade',
  })
  songs: Song[];

  @BelongsTo(() => Musician, {
    foreignKey: { name: 'producer' },
    as: 'producer_',
    constraints: false,
  })
  producer: Musician;

  @BelongsToMany(() => Musician, 'RecordsInterpreters', 'albumId', 'musicianId')
  interpreters: Musician[];

  @BelongsToMany(() => Musician, 'RecordsCollaborators', 'albumId', 'musicianId')
  collaborators: Musician[];
}
