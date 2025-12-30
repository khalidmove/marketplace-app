import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Constants, { Currency, FONTS } from '../../Assets/Helpers/constant';
import { useIsFocused } from '@react-navigation/native';
import {
  CartContext,
  LoadContext,
  ToastContext,
  UserContext,
} from '../../../App';
import { GetApi, Post } from '../../Assets/Helpers/Service';
import moment from 'moment';
import {
  CheckboxactiveIcon,
  CheckboxIcon,
  DeliveryIcon,
  PriceTagIcon,
  StarIcon,
} from '../../../Theme';
import DriverHeader from '../../Assets/Component/DriverHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from '../../../navigationRef';
import { RadioButton } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
// import { Picker } from 'react-native-wheel-pick';
// import StarRating from 'react-native-star-rating-widget';

const Checkout = props => {
  const propdata = props?.route?.params;
 
  const { t } = useTranslation();
  const [toast, setToast] = useContext(ToastContext);
  const [loading, setLoading] = useContext(LoadContext);
  const [cartdetail, setcartdetail] = useContext(CartContext);
  const [user, setuser] = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [pointtype, setpointtype] = useState('EARN');
  const [pointamount, setpointamount] = useState(null);
  const [jobtype, setjobtype] = useState('pay');
  const [lessamount, setlessamount] = useState(false);
  const [times, setTimes] = useState([]);
  // const [times, setTimes] = useState([
  //   '9:00 AM to 10:00 AM',
  //   '10:00 AM to 11:00 AM',
  //   '11:00 AM to 12:00 PM',
  //   '12:00 PM to 1:00 PM',
  //   '1:00 PM to 2:00 PM',
  //   '2:00 PM to 3:00 PM',
  //   '3:00 PM to 4:00 PM',
  //   '4:00 PM to 5:00 PM',
  //   '5:00 PM to 6:00 PM',
  //   '6:00 PM to 7:00 PM',
  // ]);
  const [selectedTime, setSelectedTime] = useState();

  useEffect(() => {
    getProfile();
    gettimeslot()
  }, []);

  const sumdata =
    cartdetail && cartdetail.length > 0
      ? cartdetail.reduce((a, item) => {
        return (
          Number(a) +
          Number(item?.offer ? item?.offer : item?.price) * Number(item?.qty)
        );
      }, 0)
      : null;
  const submit = () => {
    setLoading(true)
    let newarr=[]; 
    let comboProductDetail = [];

     cartdetail.map(item => {
    if (item.type === "combo") {
        comboProductDetail.push({
          comboId: item.productid,
          qty: item.qty,
          price: item.price,
          total: item.offer,
          comboItems: item.comboItems.map((it) => ({
            product: it.product._id,
            seller_id: item.seller_id,
            qty: it.qty || 1,
            price: it.selected_slot.our_price,
            price_slot: it.selected_slot,
          })),
        });
      } else {
        newarr.push({
          product: item.productid,
        image: item.image,
        productname: item.productname,
        price: item.offer,
        total: item.offer,
        qty: item.qty,
        seller_id: item.seller_id,
        price_slot: item.price_slot,
        });
      }
     })

    const data = {
      productDetail: newarr,
      comboProductDetail: comboProductDetail,
      shipping_address: user.shipping_address,
      location: user.shipping_address.location,
      total: sumdata,
      paymentmode: jobtype,
      timeslot: selectedTime,
      deliveryCharge:propdata?.deliveryfee > 0 ? propdata?.deliveryfee : 0,
      // deliveryTip:propdata?.deliveryPartnerTip>0?propdata?.deliveryPartnerTip:0
    };
    if (user?._id) {
      data.user = user._id;
    }
    if (pointtype === 'REDEEM') {
      data.point = Math.floor(pointamount );
      // data.point = Math.floor(pointamount / 1000) * 1000;
      data.pointtype = 'REDEEM';
    }

    console.log('data', data);

    Post('createProductRquest', data, {}).then(
      async res => {
        setLoading(false);
        setTimeout(() => {
          setModalVisible(true);
        }, 500);
        console.log(res);

        await AsyncStorage.removeItem('cartdata');
        setcartdetail([]);
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const getProfile = () => {
    setLoading(true);
    GetApi(`getProfile`, {}).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.status) {
          setuser(res.data);
          setpointamount(res.data.referalpoints);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
  const gettimeslot = () => {
    setLoading(true);
    GetApi(`get-timeslot`, {}).then(
      async res => {
        setLoading(false);
        console.log(res);
        const formatted = res?.data?.timeSlots.filter(item => item.status)
          .map(item => `${item.startTime} - ${item.endTime}`);
        setTimes(formatted);
        setSelectedTime(formatted[0])
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <DriverHeader item={t('Checkout')} showback={true} />
      {cartdetail && cartdetail.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false} style={{ paddingTop: 10 }}>
          {/* <View style={[styles.box, styles.shadowProp]}>
            {cartdetail.map((item, i) => {
              return (
                <View
                  style={{flexDirection: 'row', marginVertical: 10}}
                  key={i}>
                  <Image
                    // source={require('../../Assets/Images/meal.png')}
                    source={
                      item?.image
                        ? {
                            uri: `${item.image}`,
                          }
                        : require('../../Assets/Images/veg.png')
                    }
                    style={styles.cartimg}
                  />
                  <View style={{flex: 1, marginLeft: 10}}>
                    <Text style={styles.boxtxt}>{item?.productname}</Text>
                    <Text style={styles.qty}>{item?.price_slot?.value} {item?.price_slot?.unit}</Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginVertical: 5,
                      }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.boxtxt2}>{t('Qty')}</Text>
                      <Text style={styles.boxtxt2}> :- {item?.qty}</Text>
                      </View>
                      <Text style={styles.boxtxt3}>
                        {Currency} {item?.offer ? item?.offer : item?.price}{' '}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View> */}
          <Text style={styles.deliveloctxt}>{t('Delivery Location')}</Text>
          <View
            style={[
              styles.totalpointcov,
              { alignItems: 'center', marginBottom: 30 },
            ]}>
            <View style={styles.locatcov}>
              <DeliveryIcon height={30} width={30} color={Constants.black} />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.boxtxt}>{user?.username}</Text>
              <Text style={styles.boxtxt} numberOfLines={1}>
                {user?.shipping_address?.house_no},{' '}
                {user?.shipping_address?.address}
              </Text>
            </View>
          </View>

          <View style={styles.timePickerView}>
            <Text style={[styles.deliveloctxt, { marginBottom: 0 }]}>{t('Select Time Slot')}</Text>
            {/* {times && times?.length > 0 && <Picker
              textSize={20}
              // selectTextColor={Constants.blue}
              // TextColor="white"
              style={styles.timePickerStyle}
              selectedValue={selectedTime}
              // selectBackgroundColor={Constants.white}
              pickerData={times}
              onValueChange={value => {
                console.log(value);
                setSelectedTime(value);
              }}
            />} */}
          </View>

          <Text style={styles.deliveloctxt}>{('Payment Options')}</Text>
          <RadioButton.Group
            onValueChange={type => {
              setjobtype(type);
            }}
            value={jobtype}>
            <RadioButton.Item
              mode="android"
              label={t("Pay Online")} //Organization
              value="pay"
              position="trailing"
              style={[styles.box2, { flexDirection: 'row-reverse' }]}
              color={Constants.pink}
              uncheckedColor={Constants.black}
              labelStyle={{
                color: jobtype === 'pay' ? Constants.pink : Constants.black,
                fontSize: 16,
                fontWeight: '700',
                marginLeft: 10,
              }}
            // labelVariant="displayLarge"
            />

            <RadioButton.Item
              mode="android"
              label={t("Cash on delivery")} //Organization
              value="cod"
              position="trailing"
              style={[styles.box2, { flexDirection: 'row-reverse' }]}
              // style={{width:"60%"}}
              color={Constants.pink}
              uncheckedColor={Constants.black}
              labelStyle={{
                color: jobtype === 'cod' ? Constants.pink : Constants.black,
                fontSize: 16,
                fontWeight: '700',
                marginLeft: 10,
                // flex:1
              }}
            // labelVariant="displayLarge"
            />
          </RadioButton.Group>

          <View
            style={[styles.totalpointcov, { marginBottom: 5, marginTop: 20 }]}>
            <Text style={styles.boxtxt}>{t('You have total')}</Text>
            <View style={{ flexDirection: 'row' }}>
              <StarIcon
                height={20}
                width={20}
                style={{ marginHorizontal: 5 }}
                color={Constants.pink}
              />
              <Text style={styles.boxtxt}>{pointamount} {t('point')}</Text>
            </View>
          </View>
          {pointamount > 250 ? (
            <View style={styles.totalpointcov}>
              {pointtype === 'EARN' ? (
                <CheckboxIcon
                  color={Constants.pink}
                  height={20}
                  width={20}
                  onPress={() => {
                    if (
                      pointamount >
                      // ((Math.floor(pointamount / 1000) * 1000) / 1000) >
                      (sumdata + 20)
                    ) {
                      setlessamount(true);
                      return
                    } else {
                      setpointtype('REDEEM');
                    }
                  }}
                />
              ) : (
                <CheckboxactiveIcon
                  color={Constants.pink}
                  height={20}
                  width={20}
                  onPress={() => setpointtype('EARN')}
                />
              )}
              <Text style={styles.boxtxt}> Use</Text>
              <View style={{ flexDirection: 'row' }}>
                <StarIcon
                  height={20}
                  width={20}
                  style={{ marginHorizontal: 5 }}
                  color={Constants.pink}
                />
                <Text style={styles.boxtxt}>
                  {pointamount}{t('point')}
                  {/* {Math.floor(pointamount / 1000) * 1000} {t('point')} */}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.totalpointcov}>
              <Text style={[styles.boxtxt, { color: Constants.violet }]}>
                {t('Minimum 250 points required to redeem.')}
              </Text>
            </View>
          )}

          {lessamount && (
            <View style={styles.totalpointcov2}>
              <Text style={[styles.boxtxt4]}>
                {t('Order amount is less than the discount. Please add more products.')}
              </Text>
            </View>
          )}
          {/* {pointtype === 'REDEEM' && ( */}
          {true && (
            <View>
              <View style={styles.amountlist}>
                <Text style={styles.boxtxt}>{t('Total Amount')}</Text>
                <Text style={styles.boxtxt}>{Currency} {sumdata}</Text>
              </View>
              {propdata?.tax > 0 && <View style={styles.amountlist}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.boxtxt}>{t('Tax')}</Text>
                </View>
                <Text style={styles.boxtxt}>{Currency} {propdata?.tax}</Text>
              </View>}
              {propdata?.servicefee > 0 && <View style={styles.amountlist}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.boxtxt}>{t('Service Fee')}</Text>
                </View>
                <Text style={styles.boxtxt}>{Currency} {propdata?.servicefee}</Text>
              </View>}
              <View style={styles.amountlist}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.boxtxt}>{t('Delivery Fee')}</Text>
                </View>
                <Text style={styles.boxtxt}>{Currency} {propdata?.deliveryfee > 0 ? propdata?.deliveryfee : 0}</Text>
              </View>
              {/* {propdata?.deliveryPartnerTip > 0 && <View style={styles.amountlist}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.boxtxt}>{t('Delivery Partner Tip')}</Text>
                </View>
                <Text style={styles.boxtxt}>{Currency} {propdata?.deliveryPartnerTip}</Text>
              </View>} */}
              {pointtype === 'REDEEM' && (
                <View style={styles.amountlist}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.boxtxt}>{t('Discount')}</Text>
                  </View>
                  <Text style={styles.boxtxt}>
                    - {Currency} {pointamount}
                    {/* - {Currency} {(Math.floor(pointamount / 1000) * 1000) / 1000} */}
                  </Text>
                </View>
              )}
            </View>
          )}

          <View style={[styles.box, styles.shadowProp]}>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                flex: 1,
              }}>
              <Text
                style={styles.boxtxt}
                onPress={async () => await AsyncStorage.removeItem('cartdata')}>
                {t('Final Amount')}
              </Text>
              <Text style={styles.boxtxt}>
                {Currency}{' '}
                {pointtype === 'REDEEM'
                  ? Number(sumdata) -
                  pointamount + (propdata?.taxrate > 0 ? (Number(sumdata) * propdata?.taxrate) / 100 : 0) +
                  Number(propdata?.deliveryfee) 
                  // +Number(propdata?.deliveryPartnerTip)
                  : Number(sumdata) + (propdata?.taxrate > 0 ? (Number(sumdata) * propdata?.taxrate) / 100 : 0) +
                  Number(propdata?.deliveryfee)+
                  (propdata?.servicefee > 0 ? propdata?.servicefee : 0) 
                  // +Number(propdata?.deliveryPartnerTip)
                  }
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.cartbtn} onPress={() => submit()}>
            <Text style={styles.buttontxt}>{t('Place Order')}</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: Dimensions.get('window').height - 200,
          }}>
          <Text style={styles.carttxt}>{t('Loading...')}</Text>
        </View>
      )}
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible(false);
          navigate('App');
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ backgroundColor: 'white', alignItems: 'center' }}>
              <Text style={styles.txt}>{t('Your Order is Confirmed.')}</Text>
              <Text style={styles.txt2}>{t('Thanks for your Order')}</Text>
              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={async () => {
                    setModalVisible(!modalVisible);
                    navigate('App');
                  }}
                  style={styles.logOutButtonStyle}>
                  <Text style={styles.modalText}>{t('OK')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Checkout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.white,
    // padding: 20,
  },
  box: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    // borderRadius: 20,
    marginVertical: 20,
    backgroundColor: Constants.white,
    width: '90%',
    alignSelf: 'center',
    // flexDirection: 'row',
    // height:300,
    // backgroundColor:Constants.red
  },
  shadowProp: {
    // shadowColor: Constants.black,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  boxtxt: {
    color: Constants.black,
    fontSize: 16,
    // fontWeight: '500',
    fontFamily: FONTS.Medium,
  },
  boxtxt4: {
    color: Constants.red,
    fontSize: 12,
    fontFamily: FONTS.Medium,
  },
  boxtxt3: {
    color: Constants.black,
    fontSize: 16,
    // fontWeight: '500',
    fontFamily: FONTS.Bold,
  },
  boxtxt2: {
    color: Constants.black,
    fontSize: 16,
    fontFamily: FONTS.Medium,
  },
  cartimg: {
    height: 70,
    width: 70,
    resizeMode: 'stretch',
  },
  carttxt: {
    color: Constants.black,
    fontSize: 18,
    // fontWeight: '500',
    marginVertical: 10,
    fontFamily: FONTS.Bold,
  },
  txt: {
    color: Constants.black,
    fontSize: 20,
    marginVertical: 10,
    fontFamily: FONTS.Medium,
  },
  txt2: {
    color: Constants.black,
    fontSize: 16,
    marginBottom: 10,
    fontFamily: FONTS.Medium,
  },
  modalText: {
    color: Constants.white,
    // fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: FONTS.Bold,
    fontSize: 14,
  },
  cancelAndLogoutButtonWrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 5,
  },
  cancelButtonStyle: {
    flex: 0.5,
    backgroundColor: Constants.black,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginRight: 15,
  },
  logOutButtonStyle: {
    flex: 0.5,
    backgroundColor: Constants.violet,
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
    backgroundColor: '#rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
  },
  buttontxt: {
    color: Constants.white,
    fontSize: 16,
    fontFamily: FONTS.Bold,
  },
  cartbtn: {
    height: 55,
    borderRadius: 10,
    backgroundColor: Constants.pink,
    marginTop: 40,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  amountlist: {
    marginHorizontal: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 15,
  },
  totalpointcov: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  totalpointcov2: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  locatcov: {
    height: 40,
    width: 40,
    backgroundColor: Constants.customgrey2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  deliveloctxt: {
    fontSize: 16,
    color: Constants.black,
    fontFamily: FONTS.Bold,
    marginLeft: 20,
    marginBottom: 10,
  },
  box2: {
    paddingHorizontal: 10,
    paddingVertical: 1,
    backgroundColor: Constants.white,
    alignItems: 'center',
    // width: '90%',
    // alignSelf: 'center',
    flexDirection: 'row',
  },
  qty: {
    fontSize: 14,
    color: Constants.customgrey,
    fontFamily: FONTS.Bold,
    // marginBottom: 5,
  },
  timePickerStyle: {
    backgroundColor: Constants.white,
    width: Dimensions.get('window').width - 40,
    height: 150,
    alignSelf: 'center',
    fontFamily: FONTS.Medium,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Constants.violet,
    // color: Constants.white
  },
  timePickerView: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 10
  },
});
