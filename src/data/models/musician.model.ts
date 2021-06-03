/* eslint import/no-cycle: "off" */
import { DataTypes } from 'sequelize';
import {
  IsUUID,
  Min,
  IsIn,
  Table,
  PrimaryKey,
  Default,
  Length,
  BelongsTo,
  HasMany,
  Column,
  Model,
  BelongsToMany,
} from 'sequelize-typescript';
import { musicianInstrumentChoices } from 'server/utils/constants/fieldChoices';
import { Album, Concert, Song } from '.';

@Table({
  freezeTableName: true,
})
export default class Musician extends Model {
  @IsUUID(4)
  @Default(DataTypes.UUIDV4)
  @PrimaryKey
  @Column
  id: string;

  @Length({ min: 0, max: 70 })
  @Column
  firstName: string;

  @Length({ min: 0, max: 40 })
  @Column
  lastName: string;

  @IsIn(musicianInstrumentChoices)
  @Column
  instrument: string;

  @Min(0)
  @Column
  age: number;

  @Min(0)
  @Column(DataTypes.BIGINT)
  fans: number;

  @Column(DataTypes.TIME)
  inspiredAt: Date;

  @HasMany(() => Album, {
    foreignKey: { name: 'producer' },
    as: 'prodRecords',
    constraints: false,
  })
  prodRecords: Album[];

  @HasMany(() => Concert, {
    foreignKey: { name: 'mainArtist', allowNull: false },
    as: 'mainConcerts',
    onDelete: 'cascade',
  })
  mainConcerts: Concert[];

  @HasMany(() => Concert, {
    foreignKey: { name: 'secondaryArtist' },
    as: 'secondaryConcerts',
    constraints: false,
  })
  secondaryConcerts: Concert[];

  @HasMany(() => Musician, {
    foreignKey: { name: 'influencer' },
    as: 'influencedMusicians',
    constraints: false,
  })
  influencedMusicians: Musician[];

  @HasMany(() => Song, {
    foreignKey: { name: 'composer', allowNull: false },
    as: 'composedSongs',
    onDelete: 'cascade',
  })
  composedSongs: Song[];

  @BelongsTo(() => Musician, {
    foreignKey: { name: 'influencer' },
    as: 'influencer_',
    constraints: false,
  })
  influencer: Musician;

  @BelongsTo(() => Song, {
    foreignKey: { name: 'preferredSong' },
    as: 'preferredSong_',
    constraints: false,
  })
  preferredSong: Song;

  @BelongsToMany(() => Album, 'RecordsInterpreters', 'musicianId', 'albumId')
  albums: Album[];

  @BelongsToMany(() => Album, 'RecordsCollaborators', 'musicianId', 'albumId')
  collabAlbums: Album[];
}
