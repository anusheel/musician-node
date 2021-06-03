import albumValidation from './album.validation';
import concertValidation from './concert.validation';
import musicianValidation from './musician.validation';
import songValidation from './song.validation';

const options = { keyByField: true };

export { musicianValidation, albumValidation, songValidation, concertValidation, options };
