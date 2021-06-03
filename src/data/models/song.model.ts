/* eslint import/no-cycle: "off" */
import { DataTypes } from 'sequelize';
import {
  IsUUID,
  Table,
  PrimaryKey,
  Default,
  Length,
  AllowNull,
  BelongsTo,
  HasMany,
  Column,
  Model,
} from 'sequelize-typescript';
import { Musician, Album } from '.';

@Table({
  freezeTableName: true,
})
export default class Song extends Model {
  @PrimaryKey
  @Column
  id: number;

  @AllowNull(false)
  @Length({ min: 0, max: 100 })
  @Column
  name: string;

  @Length({ min: 0, max: 1000 })
  @Column
  lyrics: string;

  @IsUUID(4)
  @Default(DataTypes.UUIDV4)
  @Column
  code: string;

  @HasMany(() => Musician, {
    foreignKey: { name: 'preferredSong' },
    as: 'songMusicianFans',
    constraints: false,
  })
  songMusicianFans: Musician[];

  @BelongsTo(() => Album, {
    foreignKey: {
      name: 'album',
      allowNull: false,
    },
    as: 'album_',
  })
  album: Album;

  @BelongsTo(() => Musician, {
    foreignKey: { name: 'composer', allowNull: false },
    as: 'composer_',
  })
  composer: Musician;
}
