import {ImageRequireSource} from 'react-native';

interface ImageName {
  avatar: {
    'avatar-02': ImageRequireSource;
  };
}
export const Images: ImageName = {
  avatar: {
    'avatar-02': require('./avatar/img_avatar_02.png'),
  },
};
