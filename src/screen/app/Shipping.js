import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  Modal,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Constants, { FONTS } from '../../Assets/Helpers/constant';
import Header from '../../Assets/Component/Header';
import { goBack, navigate } from '../../../navigationRef';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GetApi, Post } from '../../Assets/Helpers/Service';
import {
  CartContext,
  LoadContext,
  ToastContext,
  UserContext,
} from '../../../App';
import LocationDropdown from '../../Assets/Component/LocationDropdown';
import {
  request,
  PERMISSIONS,
  requestLocationAccuracy,
} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import GetCurrentAddressByLatLong from '../../Assets/Component/GetCurrentAddressByLatLong';
import { LocationIcon } from '../../../Theme';
import { useTranslation } from 'react-i18next';
import DriverHeader from '../../Assets/Component/DriverHeader';

const Shipping = props => {
  const { t } = useTranslation();
  const propdata = props?.route?.params;
  console.log(propdata);
  const [cartdetail, setcartdetail] = useContext(CartContext);
  const [user, setuser] = useContext(UserContext);
  const [from, setFrom] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useContext(ToastContext);
  const [loading, setLoading] = useContext(LoadContext);
  const [location, setlocation] = useState();
  const [addressdata, setaddressdata] = useState({
    username: '',
    address: '',
    house_no: '',
    pincode: '',
    number: '',
    city: '',
    country: '',
  });

  useEffect(() => {
    data();
  }, []);

  useEffect(() => {
    if (propdata?.type === 'mapdata') {
      setlocation(propdata.location);
      GetCurrentAddressByLatLong({
        lat: propdata.location.latitude,
        long: propdata.location.longitude,
      }).then(res => {
        console.log('res===>', res);
        setaddressdata({
          ...addressdata,
          address: res.results[0].formatted_address,
        });
      });
    }
  }, [propdata]);
  const data = async () => {
    setLoading(true),
      GetApi(`getProfile`, {}).then(
        async res => {
          setLoading(false);
          console.log(res);
          if (res.status) {
            // setaddressdata(res.data);
            setaddressdata({
              username:
                res?.data?.shipping_address?.username ||
                res?.data?.username ||
                '',
              address: res?.data?.shipping_address?.address || '',
              house_no: res?.data?.shipping_address?.house_no || '',
              pincode: res?.data?.shipping_address?.pincode || '',
              number:
                res?.data?.shipping_address?.number || res?.data?.number || '',
              city: res?.data?.shipping_address?.city || '',
              country: res?.data?.shipping_address?.country || '',
            });
            setlocation({
              latitude: res?.data?.shipping_address.location.coordinates[1],
              longitude: res?.data?.shipping_address.location.coordinates[0],
            })
            if (!res?.data?.shipping_address) {
              CustomCurrentLocation();
            }
          } else {
            // setToast(res.message);
          }
        },
        err => {
          setLoading(false);
          console.log(err);
        },
      );
  };

  // const sumdata =
  //   cartdetail && cartdetail.length > 0
  //     ? cartdetail.reduce((a, item) => {
  //         return Number(a) + Number(item?.price) * Number(item?.qty);
  //       }, 0)
  //     : null;
  // console.log(sumdata);

  const submit = () => {
    if (
      addressdata.username === '' ||
      addressdata.address === '' ||
      addressdata.house_no === '' ||
      addressdata.pincode === '' ||
      addressdata.number === '' ||
      addressdata.city === '' ||
      addressdata.country === ''
    ) {
      setSubmitted(true);
      return;
    }
    console.log('addressdata', addressdata);

    // let newarr = cartdetail.map(item => {
    //   return {
    //     product: item.productid,
    //     image: item.image,
    //     productname: item.productname,
    //     price: item.offer,
    //     qty: item.qty,
    //     seller_id: item.seller_id,
    //   };
    // });

    addressdata.location = {
      type: 'Point',
      coordinates: [location.longitude, location.latitude],
    };

    const userdata = {
      shipping_address: addressdata,
      userId: user?._id,
    };

    console.log('userdata', userdata);
    // const data = {
    //   productDetail: newarr,
    //   shipping_address: addressdata,
    // };
    // if (user?._id) {
    //   data.user = user._id;
    // }
    // data.location = {
    //   type: 'Point',
    //   coordinates: [location.longitude, location.latitude],
    // };
    // data.total = sumdata;
    // console.log('data', data);

    // Post('createProductRquest', data, {}).then(
    //   async res => {
    //     setLoading(false);
    //     setTimeout(() => {
    //       setModalVisible(true);
    //     }, 500);
    //     console.log(res);
    //     setSubmitted(false);
    //     setaddressdata({
    //       username: '',
    //       address: '',
    //       house_no: '',
    //       pincode: '',
    //       number: '',
    //       city: '',
    //       country: '',
    //     });

    //     {
    //       user?._id &&
    setLoading(true),
      Post('updateprofile', userdata, {}).then(
        async res => {
          setLoading(false);
          console.log(res);

          if (res.status) {
            setuser(res.data);
            if (propdata?.type === 'checkout') {
              navigate('Checkout');
            } else {
              goBack();
            }
          } else {
            setToast(res?.message);
          }
        },
        err => {
          setLoading(false);
          console.log(err);
        },
      );
    // }
    // await AsyncStorage.removeItem('cartdata');
    // setcartdetail([]);
    // },
    //   err => {
    //     setLoading(false);
    //     console.log(err);
    //   },
    // );
  };
  const getLocationVaue = (lat, add, set) => {
    console.log('lat=======>', lat);
    console.log('add=======>', add);
    setaddressdata({
      ...addressdata,
      address: add,
      lat: lat.lat,
      long: lat.lng,
    });
    setlocation({
      latitude: lat.lat,
      longitude: lat.lng,
    });
  };
  const CustomCurrentLocation = async () => {
    try {
      if (Platform.OS === 'ios') {
        request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(result => {
          console.log(result);
          if (result === 'granted') {
            Geolocation.getCurrentPosition(
              position => {
                // setlocation(position);
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
            position => {
              console.log(position);
              // setlocation(position);
              setlocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                // latitudeDelta: 0.05,
                // longitudeDelta: 0.05,
              });
              // setper(granted);
              GetCurrentAddressByLatLong({
                lat: position.coords.latitude,
                long: position.coords.longitude,
              }).then(res => {
                console.log('res===>', res);
                // setlocationadd(res.results[0].formatted_address);
                setaddressdata(prevstate => ({
                  ...prevstate,
                  address: res.results[0].formatted_address,
                  lat: JSON.stringify(position.coords.latitude),
                  long: JSON.stringify(position.coords.longitude),
                }));
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
  return (
    <SafeAreaView style={styles.container}>
      {/* <Header back={true} item={'Shipping'} /> */}
      <DriverHeader item={t('Shipping Address')} showback={true} />
      {/* <View style={styles.toppart}>
        <Text style={styles.carttxt}>{t('Shipping Address')} </Text>
      </View> */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{ marginTop: 20, marginHorizontal: 20 }}>
        <Text style={styles.headtxt}>{t('Shipping')}</Text>
        <View style={styles.box}>
          <Text style={styles.name}>{t('Full Name')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("Name")}
            placeholderTextColor={Constants.customgrey}
            value={addressdata?.username}
            onChangeText={username =>
              setaddressdata({ ...addressdata, username })
            }></TextInput>
        </View>
        {submitted && addressdata.username === '' && (
          <Text style={styles.require}>{t('Name is required')}</Text>
        )}
        <View style={styles.box2}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{t('Address')}</Text>
            {/* <TextInput
            style={styles.input}
            placeholder="Address"
            placeholderTextColor={Constants.customgrey}
            value={addressdata?.address}
            onChangeText={address =>
              setaddressdata({...addressdata, address})
            }></TextInput> */}
            <LocationDropdown
              value={addressdata?.address}
              focus={from === 'location'}
              setIsFocus={setFrom}
              from="location"
              getLocationVaue={(lat, add) => getLocationVaue(lat, add)}
            />

          </View>
          <TouchableOpacity
            style={styles.locatcov}
            onPress={() =>
              navigate('MapAddress', {
                lat: location?.latitude,
                long: location?.longitude,
              })
            }>
            <LocationIcon />
          </TouchableOpacity>
        </View>
        {submitted && addressdata.address === '' && (
          <Text style={styles.require}>{t('Address is required')}</Text>
        )}
        <View style={styles.box}>
          <Text style={styles.name}>{t('House /Building No')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("House No /Building No / Streat Name")}
            placeholderTextColor={Constants.customgrey}
            value={addressdata?.house_no}
            onChangeText={house_no =>
              setaddressdata({ ...addressdata, house_no })
            }></TextInput>
        </View>
        {submitted && addressdata.house_no === '' && (
          <Text style={styles.require}></Text>
        )}
        <View style={styles.box}>
          <Text style={styles.name}>{t('Zip / Post Code')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("Zip / Post Code")}
            keyboardType="number-pad"
            placeholderTextColor={Constants.customgrey}
            value={addressdata?.pincode}
            onChangeText={pincode =>
              setaddressdata({ ...addressdata, pincode })
            }></TextInput>
        </View>
        {submitted && addressdata.pincode === '' && (
          <Text style={styles.require}>{t('Zip/Post code is required')}</Text>
        )}
        <View style={styles.box}>
          <Text style={styles.name}>{t('Mobile Number')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("Number")}
            keyboardType="number-pad"
            placeholderTextColor={Constants.customgrey}
            value={addressdata?.number}
            onChangeText={number =>
              setaddressdata({ ...addressdata, number })
            }></TextInput>
        </View>
        {submitted && addressdata.number === '' && (
          <Text style={styles.require}>{t('Number is required')}</Text>
        )}
        <View style={styles.box}>
          <Text style={styles.name}>{t('City')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("City")}
            placeholderTextColor={Constants.customgrey}
            value={addressdata?.city}
            onChangeText={city =>
              setaddressdata({ ...addressdata, city })
            }></TextInput>
        </View>
        {submitted && addressdata.city === '' && (
          <Text style={styles.require}>{t('City is required')}</Text>
        )}
        <View style={styles.box}>
          <Text style={styles.name}>{t('Country')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("Country")}
            placeholderTextColor={Constants.customgrey}
            value={addressdata?.country}
            onChangeText={country =>
              setaddressdata({ ...addressdata, country })
            }></TextInput>
        </View>
        {submitted && addressdata.country === '' && (
          <Text style={styles.require}>{t('Country is required')}</Text>
        )}
        <TouchableOpacity style={styles.btn} onPress={() => submit()}>
          <Text style={styles.btntxt}>
            {propdata?.type === 'checkout' ? t('Continue') : t('Update Address')}
          </Text>
        </TouchableOpacity>
      </ScrollView>

    </SafeAreaView>
  );
};

export default Shipping;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.white,
    // padding: 20,
  },
  toppart: {
    backgroundColor: Constants.violet,
    paddingTop: 5,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  carttxt: {
    color: Constants.white,
    fontSize: 18,
    fontFamily: FONTS.Bold,
    marginLeft: 10,
  },
  image: {
    height: 100,
    width: 100,
    position: 'absolute',
    opacity: 0.1,
    display: 'flex',
    alignSelf: 'center',
    top: Dimensions.get('screen').height / 2 - 50,
  },
  headtxt: {
    fontSize: 24,
    // fontWeight: '700',
    color: Constants.black,
    fontFamily: FONTS.Bold,
  },
  input: {
    // flex:1,
    borderBottomWidth: 2,
    borderColor: Constants.black,
    color: Constants.black,
    fontWeight: '500',
    //    backgroundColor:Constants.lightblue,
    paddingVertical: -10,
    //    height:100,
    textAlign: 'left'
  },
  name: {
    color: Constants.black,
    fontSize: 12,
    fontFamily: FONTS.Regular,
  },
  box: {
    marginVertical: 20,
  },
  box2: {
    marginVertical: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  btntxt: {
    fontSize: 20,
    color: Constants.white,
    // fontWeight:'700'
    fontFamily: FONTS.Bold,
  },
  btn: {
    height: 60,
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
    backgroundColor: Constants.violet,
    width: '100%',
    alignSelf: 'center',
    marginBottom: 40,
  },
  require: {
    color: Constants.red,
    fontFamily: FONTS.Medium,
    marginLeft: 10,
    fontSize: 14,
  },

  locatcov: {
    height: 30,
    width: 30,
    backgroundColor: Constants.violet,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
});
