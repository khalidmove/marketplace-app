import React, { useEffect, useState, createContext } from 'react';
// import {
//   Modal,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navigation from './src/navigation';
import CustomToaster from './src/Assets/Component/CustomToaster';
import Constants, { FONTS } from './src/Assets/Helpers/constant';
import { GetApi, Post } from './src/Assets/Helpers/Service';
import Axios from 'axios';
import { goBack } from './navigationRef';
import {
  Modal,
  PermissionsAndroid,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Spinner from './src/Assets/Component/Spinner';
import Geolocation from 'react-native-geolocation-service';
import GetCurrentAddressByLatLong from './src/Assets/Component/GetCurrentAddressByLatLong';
import { OneSignal } from 'react-native-onesignal';
import i18n from './i18n';
import CuurentLocation from './src/Assets/Component/CuurentLocation';
import SplashScreen from 'react-native-splash-screen';
import { PERMISSIONS, request } from 'react-native-permissions';
import ToastManager,{ Toast } from 'toastify-react-native';
// import CustomToaster from './src/Component/CustomToaster';
// import {COLORS} from './Theme';
// import {PaperProvider} from 'react-native-paper';
export const Context = React.createContext('');
export const ToastContext = React.createContext('');
export const LoadContext = React.createContext('');
export const CartContext = React.createContext('');
export const AddressContext = React.createContext('');
export const UserContext = React.createContext('');
// export const Context = React.createContext<any>('');
const App = () => {
  const [initial, setInitial] = useState('');
  const [toast, setToast] = useState('');
  const [dark, setdark] = useState(false);
  const [mycountry, setmycountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [cartdetail, setcartdetail] = useState([]);
  const [locationadd, setlocationadd] = useState('');
  const [user, setuser] = useState({});


  useEffect(() => {
    SplashScreen.hide();
    setInitialRoute();
    checkLng()
    getCartDetail();
    setTimeout(() => {
      CustomCurrentLocation();

    }, 1000);
  }, []);
  const setInitialRoute = async () => {
    const user = await AsyncStorage.getItem('userDetail');
    const userDetail = JSON.parse(user);
    console.log('userDetail', userDetail);
    console.log('userDetailid', userDetail?.token);
    if (userDetail?.token) {
      setuser(userDetail);
      getProfile()
      if (userDetail.type === 'SELLER') {
        // setuser(userDetail);
        if (userDetail.status === 'Verified') {
          setInitial('Vendortab');
        } else {
          setInitial('VendorForm');
        }
      }
      else if (userDetail.type === 'DRIVER') {
        // setuser(userDetail);
        if (userDetail.status === 'Verified') {
          setInitial('Drivertab');
        } else {
          setInitial('Driverform');
        }
      } else {
        setInitial('App');
        // setuser(userDetail);
      }
    } else {
      setInitial('Auth');
    }
  };


  const getCartDetail = async () => {
    let cart = await AsyncStorage.getItem('cartdata');
    if (cart) {
      setcartdetail(JSON.parse(cart));
    }

    const userdata = await AsyncStorage.getItem('userDetail');
    if (userdata) {
      setuser(JSON.parse(userdata));
    }
  };

  const getProfile = () => {
    setLoading(true);
    GetApi(`getProfile`, {}).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.status) {
          res.data.token = user?.token
          setuser(res.data)
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const CustomCurrentLocation = async () => {
    try {
      if (Platform.OS === 'ios') {
        request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result) => {
          console.log('dsdswdswdsw===>', result);
          if (result === 'granted') {
            Geolocation.getCurrentPosition(
              (position) => {
                console.log(position)
                // setlocationadd(position);
                GetCurrentAddressByLatLong({
                  lat: position.coords.latitude,
                  long: position.coords.longitude,
                }).then((res) => {
                  console.log('res===>', res)
                  setlocationadd(res.results[0].formatted_address);
                });
              },
              error => {
                console.log(error.code, error.message);
                //   return error;
              },
              { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
            );
          }
        });
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            (position) => {
              console.log(position);
              // setlocation({
              //   latitude: position.coords.latitude,
              //   longitude: position.coords.longitude,
              //   latitudeDelta: 0.05,
              //   longitudeDelta: 0.05,
              // });
              GetCurrentAddressByLatLong({
                lat: position.coords.latitude,
                long: position.coords.longitude,
              }).then((res) => {
                console.log('res===>', res)
                setlocationadd(res.results[0].formatted_address);
              });
            },
            error => {
              console.log(error.code, error.message);
              //   return error;
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
          );
        } else {
          console.log('location permission denied');
        }
      }
    } catch (err) {
      console.log('location err =====>', err);
    }
  };

  const APP_ID = '6a3654fb-e809-476d-a0e2-f90e732dcda1';
  useEffect(() => {
    OneSignal.initialize(APP_ID);
    OneSignal.Notifications.requestPermission(true);
  }, [OneSignal]);

  const checkLng = async () => {
    const x = await AsyncStorage.getItem('LANG');
    if (x != null) {
      i18n.changeLanguage(x);
    }
  };
  const [interval, setinter] = useState();
  useEffect(() => {
    clearInterval(interval);
    let int;
    if (user?.type === 'DRIVER' || user?.type === 'EMPLOYEE') {
      int = setInterval(() => {
        updateTrackLocation(int);
      }, 30000);
      setinter(int);
    } else {
      clearInterval(int);
    }
    return () => {
      clearInterval(int);
    };
  }, [user]);

  const updateTrackLocation = (inter) => {
    CuurentLocation(res => {
      const data = {
        track: {
          type: 'Point',
          coordinates: [res.coords.longitude, res.coords.latitude],
        },

      };
      Post('updateUserLocation', data,).then(
        async res => {
          // setLoading(false);
          // console.log(res)
          if (res.status) {
          } else {
            clearInterval(inter);
            console.log('stop')
          }
        },
        err => {
          clearInterval(inter);
          // setLoading(false);
          console.log(err);
        },
      );
    });
  };

   useEffect(() => {
    if (toast) {
      Toast.show({
        type: 'success',
        text1: toast,
        position: 'top',
        visibilityTime: 2500,
        autoHide: true, onHide: () => { setToast('') },
      })
    }

  }, [toast])

  return (
    <Context.Provider value={[initial, setInitial]}>
      <ToastContext.Provider value={[toast, setToast]}>
        <LoadContext.Provider value={[loading, setLoading]}>
          <UserContext.Provider value={[user, setuser]}>
            <CartContext.Provider value={[cartdetail, setcartdetail]}>
              <AddressContext.Provider value={[locationadd, setlocationadd]}>
                <SafeAreaView style={styles.container}>
                  <Spinner color={'#fff'} visible={loading} />
                  {/* <CustomToaster
                    color={Constants.white}
                    backgroundColor={Constants.violet}
                    timeout={4000}
                    toast={toast}
                    setToast={setToast}
                  /> */}
                  <StatusBar
                    barStyle={Platform.OS === 'android' ? "dark-content" : "light-content"}
                    backgroundColor={'white'}
                  />
                  {initial !== '' && <Navigation initial={initial} />}
                  {/* <Navigation /> */}
                  <ToastManager />
                </SafeAreaView>
              </AddressContext.Provider>
            </CartContext.Provider>
          </UserContext.Provider>
        </LoadContext.Provider>
      </ToastContext.Provider>
    </Context.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: Constants.violet
  },
});

export default App;
