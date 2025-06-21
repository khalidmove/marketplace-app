// const prodUrl = 'https://marketapi.moveex.co/v1/api/';
// const prodUrl = 'http://192.168.81.47:3000/v1/api/';
const prodUrl = 'http://192.168.0.187:3000/v1/api/';

let apiUrl = prodUrl;
export const Googlekey = 'AIzaSyDHd5FoyP2sDBo0vO2i0Zq7TIUZ_7GhBcI'
export const Currency = 'IQD'

const Constants = {
  baseUrl: apiUrl,
  lightgrey: '#757575',
  grey: '#979797',
  tabgrey: '#999999',
  yellow: '#FFE600',
  custom_black: '#06161C',
  dark_black: '#000000',
  light_black: '#98A2B3',
  black: '#000000',
  violet: '#35035C',
  pink: '#FC0965',
  lightpink: '#F7ECFA',
  linearcolor: '#9b257b',
  custom_green: '#01B763',
  green: '#07A404',
  white: '#FFFFFF',
  dark_white: '#FFFFFF',
  customblue: '#2048BD',
  deepblue: '#021841',
  darkblue: '#08244C',
  lightblue: '#3AA2BC',
  tabblue: '#E1F4FF',
  tabgrey: '#8B8B8B',
  lightgrey: '#f2f2f2',
  customgrey: '#858080',
  customgrey2: '#A4A4A4',
  customgrey3: '#DEDEDE',
  customgrey4: '#F1F1F1',
  // red: '#FE7237',
  red: '#FF0000',
  blue: '#7493FF',
  // blue: '#122979',
  // lightblue: '#0D34BF',
  lightred: '#167DD8',
  font100: 'Montserrat-Thin',
  font300: 'Montserrat-Light',
  font200: 'Montserrat-ExtraLight',
  font400: 'Montserrat-Regular',
  font500: 'Montserrat-Medium',
  font600: 'Montserrat-Semibold',
  font700: 'Montserrat-Bold',
  font800: 'Montserrat-ExtraBold',
  font900: 'Montserrat-Black',
  constant_appLaunched: 'appLaunched',
  HAS_ACCOUNT: 'HASACCOUNT',
  LANGUAGE_SELECTED: 'LANGUAGE_SELECTED',
  header_back_middle_right: 'header_back_middle_right',
  header_back: 'header_back',
  keyUserToken: 'token',
  isOnboarded: 'isOnboarded',
  authToken: '',
  keysocailLoggedIn: 'isSocialLoggedIn',
  isProfileCreated: 'isProfileCreated',
  userInfoObj: 'userInfoObj',
  lastUserType: 'lastUserType',
  isDeviceRegistered: 'isDeviceRegistered',
  canResetPass: 'canResetPass',
  fcmToken: 'fcmToken',
  productionUrl: prodUrl,
  // developmentUrl: devUrl,

  emailValidationRegx:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  numberValidationRegx: /^\d+$/,
  passwordValidation: /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,


};
export const FONTS = {

  Bold: 'Roboto-Bold',
  Black: 'Roboto-Black',
  Medium: 'Roboto-Medium',
  Regular: 'Roboto-Regular'
};

export default Constants;
