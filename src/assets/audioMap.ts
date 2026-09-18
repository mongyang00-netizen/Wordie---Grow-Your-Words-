// Native bundled audio files for all 10 vocabulary words
import appleAudio from './audio/apple.mp3';
import dogAudio from './audio/dog.mp3';
import beautifulAudio from './audio/beautiful.mp3';
import borrowAudio from './audio/borrow.mp3';
import buyAudio from './audio/buy.mp3';
import schoolAudio from './audio/school.mp3';
import libraryAudio from './audio/library.mp3';
import friendAudio from './audio/friend.mp3';
import happyAudio from './audio/happy.mp3';
import teachAudio from './audio/teach.mp3';

export const WORD_AUDIO_MAP: Record<string, string> = {
  apple: appleAudio,
  dog: dogAudio,
  beautiful: beautifulAudio,
  borrow: borrowAudio,
  buy: buyAudio,
  school: schoolAudio,
  library: libraryAudio,
  friend: friendAudio,
  happy: happyAudio,
  teach: teachAudio,
};
