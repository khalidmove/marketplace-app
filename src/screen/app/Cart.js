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
import React, { useContext, useEffect, useRef, useState } from 'react';
import Constants, { Currency, FONTS } from '../../Assets/Helpers/constant';
import { BackIcon, CrossIcon, LocationIcon, MinusIcon, Plus2Icon } from '../../../Theme';
import { AddressContext, CartContext, LoadContext, UserContext } from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from 'react-native-swiper-flatlist/src/themes';
import { goBack, navigate } from '../../../navigationRef';
import { useTranslation } from 'react-i18next';
import { GetApi } from '../../Assets/Helpers/Service';
import { Dropdown } from 'react-native-element-dropdown';
import { useIsFocused } from '@react-navigation/native';

const Cart = () => {
  const dropdownRef = useRef();
  const { t } = useTranslation();
  const [cartdetail, setcartdetail] = useContext(CartContext);
  const [locationadd, setlocationadd] = useContext(AddressContext);
  const [user, setuser] = useContext(UserContext);
  const [loading, setLoading] = useContext(LoadContext);
  const [totalsum, settotalsum] = useState(null);
  const [totaloff, settotaloff] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [image, setimage] = useState();
  const [tips, setTips] = useState([]);
  const [seltips, setSelTips] = useState(null);
  const [taxrate, settaxrate] = useState(null);
  const [servicefee, setservicefee] = useState(null);
  const [deliveryfee, setdeliveryfee] = useState(null);
  const shaloowarray = [...cartdetail];

   const IsFocused = useIsFocused();
    // useEffect(() => {
    //   if (IsFocused) {
    //   }
    //   else{
    //     setSelTips(null)
    //   }
    // }, [IsFocused]);

  useEffect(() => {
    // getDeliveryPartnerTip();
    getDeliveryCharge();
    getTax();
    getserviceFee();
  }, []);
  useEffect(() => {
    const sumdata =
      cartdetail && cartdetail.length > 0
        ? cartdetail.reduce((a, item) => {
          return Number(a) + Number(item?.price) * Number(item?.qty);
        }, 0)
        : null;
    console.log(sumdata);
    settotalsum(sumdata);
    const offdata =
      cartdetail && cartdetail.length > 0
        ? cartdetail.reduce((a, item) => {
          return Number(a) + Number(item?.offer) * Number(item?.qty);
        }, 0)
        : null;
    console.log(sumdata);
    settotaloff(offdata);
  }, [cartdetail]);

  const submit = () => {
    // if (
    //   addressdata.username === '' ||
    //   addressdata.address === '' ||
    //   addressdata.pincode === '' ||
    //   addressdata.number === '' ||
    //   addressdata.city === '' ||
    //   addressdata.country === ''
    // ) {
    //   setSubmitted(true);
    //   return;
    // }
    // console.log('addressdata', addressdata);

    let newarr = cartdetail.map(item => {
      return {
        product: item.productid,
        image: item.productdata.image,
        color: item.productdata.color,
        size: item.size,
        productname: item.productname,
        price: item.price,
        qty: item.qty,
      };
    });
    // console.log('submit',newarr)
    const userdata = {
      ...addressdata,
      userId: user?._id,
    };

    console.log('userdata', userdata);
    const data = {
      productDetail: newarr,
      address: addressdata,
      pointtype: pointtype,
    };
    if (user?._id) {
      data.user = user._id;
    }
    if (pointtype === 'REDEEM') {
      data.total = sumdata - pointamount;
      data.point = point;
    }
    if (pointtype === 'EARN') {
      data.total = sumdata;
      data.point = (sumdata * 5 / 100).toFixed(2);
    }
    // console.log('data',addressdata)
    console.log('data', data);

    Post('createOrder', data, {}).then(
      async res => {
        setLoading(false);
        setTimeout(() => {
          setModalVisible(true)
        }, 500);
        console.log(res);
        setSubmitted(false);
        setaddressdata({
          username: '',
          address: '',
          pincode: '',
          number: '',
          city: '',
          country: '',
        });

        {
          user?._id &&
            (setLoading(true),
              Post('updateprofile', userdata, {}).then(
                async res => {
                  setLoading(false);
                  console.log(res);

                  if (res.status) {
                    // navigate('App');
                  } else {
                    setToast(res?.message);
                  }
                },
                err => {
                  setLoading(false);
                  console.log(err);
                },
              ));
        }
        await AsyncStorage.removeItem('cartdata');
        setcartdata([]);

      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const getDeliveryPartnerTip = () => {
    setLoading(true);
    GetApi(`getDeliveryPartnerTip`, {}).then(
      async res => {
        setLoading(false);
        console.log(res);
        const dropdownData = res?.data?.deliveryPartnerTip.map(item => ({
          label: `IQD${item}`,
          value: item,
        }));
        setTips(dropdownData);
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
  const getTax = () => {
    setLoading(true);
    GetApi(`getTax`, {}).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res?.data && res?.data?.length > 0) {
          settaxrate(res?.data[0]?.taxRate);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
  const getserviceFee = () => {
    setLoading(true);
    GetApi(`getServiceFee`, {}).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res?.data && res?.data?.length > 0) {
          setservicefee(res?.data[0]?.Servicefee);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
  const getDeliveryCharge = () => {
    setLoading(true);
    GetApi(`getDeliveryCharge`, {}).then(
      async res => {
        setLoading(false);
        console.log(res);
        setdeliveryfee(res?.data?.deliveryCharge);
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.toppart}>
        {/* <BackIcon color={Constants.white}/> */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => goBack()}
            style={{ width: 20, height: 20, marginHorizontal: 10, justifyContent: 'center' }}>
            <BackIcon color={Constants.white} height={15} width={15} style={{ alignSelf: 'center' }} />
          </TouchableOpacity>
          <Text style={styles.carttxt}>{t('Cart')} ({cartdetail.length})</Text>
        </View>
        {cartdetail && cartdetail.length > 0 && <Text style={styles.addbtn} onPress={() => setModalVisible(true)}>
          {t('Empty Cart')}
        </Text>}
      </View>
      {cartdetail && cartdetail.length > 0 ? <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ backgroundColor: Constants.white }}>
          {cartdetail.map((item, i) => (
            <View
              style={[
                styles.box,
                cartdetail.length === i + 1 ? null : { borderBottomWidth: 1 },
              ]}
              key={i}>
              <View style={styles.firstpart}>
                <View style={styles.firstleftpart}>
                  <TouchableOpacity onPress={() => {
                    setimage(item.image);
                    setModalVisible2(true);
                  }}>
                    <Image source={{ uri: item.image }} style={styles.cardimg} />
                    {item?.type === "combo" &&<Image source={require('../../Assets/Images/combo.png')} style={styles.comboimg} /> }
                  </TouchableOpacity>
                  <View>
                    <Text style={styles.productname}>{item.productname}</Text>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={styles.maintxt}> {Currency} {item.offer}</Text>
                      <Text style={styles.disctxt}> {Currency} {item.price}</Text>
                    </View>
                    <Text style={styles.qty}>{item?.price_slot?.value && item?.price_slot?.unit
                          ? item?.price_slot?.value +
                            " " +
                            item?.price_slot?.unit
                          : Array.isArray(item?.comboItems) &&
                            item?.comboItems.length > 0
                          ? item?.comboItems.map((comboItem, index) => (
                              <Text key={index}>
                                {comboItem?.selected_slot
                                  ? comboItem?.selected_slot?.value +
                                    " " +
                                    comboItem?.selected_slot?.unit
                                  : comboItem?.value}
                                {index < item?.comboItems.length - 1
                                  ? ", "
                                  : ""}
                              </Text>
                            ))
                          : "N/A"}</Text>
                  </View>
                </View>
                <CrossIcon
                  onPress={async () => {
                    shaloowarray.splice(i, 1),
                      await AsyncStorage.setItem(
                        'cartdata',
                        JSON.stringify(shaloowarray),
                      );
                    setcartdetail(shaloowarray);
                  }}
                />
              </View>
              <View style={styles.addcov}>
                <TouchableOpacity
                  style={styles.plus}
                  onPress={async () => {
                    const updatedCart = cartdetail.map(cartItem => {
                      if (
                        cartItem.productid === item.productid &&
                        cartItem.price_slot?.value === item.price_slot?.value
                      ) {
                        // Decrease only if qty is more than 1
                        if (cartItem.qty > 1) {
                          return {
                            ...cartItem,
                            qty: cartItem.qty - 1,
                          };
                        }
                      }
                      return cartItem;
                    });

                    setcartdetail(updatedCart);
                    await AsyncStorage.setItem('cartdata', JSON.stringify(updatedCart));

                  }}>
                  <MinusIcon color={Constants.white} height={20} width={20}/>
                </TouchableOpacity>
                <Text style={styles.plus2}>{item.qty}</Text>
                <TouchableOpacity
                  style={styles.plus3}
                  onPress={async () => {
                    // let newArr = cartdetail.map(_i => {
                    //   if (_i?.productid == item?.productid) {
                    //     return {..._i, qty: _i?.qty + 1};
                    //   } else {
                    //     return _i;
                    //   }
                    // });
                    // setcartdetail(newArr);
                    // await AsyncStorage.setItem(
                    //   'cartdata',
                    //   JSON.stringify(newArr),
                    // );
                    const updatedCart = cartdetail.map(cartItem => {
                      if (
                        cartItem.productid === item.productid &&
                        cartItem.price_slot?.value === item.price_slot?.value
                      ) {
                        return {
                          ...cartItem,
                          qty: cartItem.qty + 1,
                        };
                      }
                      return cartItem;
                    });

                    setcartdetail(updatedCart);
                    await AsyncStorage.setItem('cartdata', JSON.stringify(updatedCart));

                  }}>
                  <Plus2Icon color={Constants.white} height={20} width={20} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.btombg}>
          <View style={styles.totalcov}>
            <View style={styles.total}>
              <Text style={styles.boxtxt}>{t('Item Total')}</Text>
              <View style={styles.amount}>
                <Text style={styles.boxtxt2}>{Currency}{totalsum}</Text>
                <Text style={styles.boxtxt}>{Currency}{totaloff}</Text>
              </View>
            </View>
            {taxrate > 0 && <View style={styles.total}>
              <Text style={styles.boxtxt}>{t('Tax')}</Text>
              <View style={styles.amount}>
                <Text style={styles.boxtxt}>{Currency}{(totaloff * taxrate) / 100}</Text>
              </View>
            </View>}
            {servicefee > 0 && <View style={styles.total}>
              <Text style={styles.boxtxt}>{t('Service Fee')}</Text>
              <View style={styles.amount}>
                <Text style={styles.boxtxt}>{Currency}{servicefee}</Text>
              </View>
            </View>}
            <View style={styles.total}>
              <Text style={[styles.boxtxt, { color: deliveryfee === 0 ? Constants.custom_green : Constants.black }]}>
                {t('Delivery Fee')} {deliveryfee === 0 && <>(IQD35 {t('Saved')})</>}
              </Text>
              <View style={styles.amount}>
                {deliveryfee === 0 && <Text style={styles.boxtxt2}>{Currency}35</Text>}
                <Text style={styles.boxtxt}>{Currency}{deliveryfee?deliveryfee:0}</Text>
              </View>
            </View>
            {/* <View style={styles.total}>
              <Text style={[styles.boxtxt, { color: seltips ? Constants.black : Constants.customgrey }]}>
                {t('Delivery Partner Tip')}
              </Text>
              <View style={{ width: 100 }}>
                <Dropdown
                  ref={dropdownRef}
                  data={tips}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Tips"
                  value={seltips}
                  onChange={item => { }}
                  renderItem={(item) => (
                    <TouchableOpacity
                      style={styles.itemContainer}
                      onPress={() => {
                        setSelTips(item?.value);
                        dropdownRef.current?.close();
                      }}
                    >
                      <Text style={styles.itemText}>{item?.label}</Text>
                    </TouchableOpacity>
                  )}
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholder}
                  selectedTextStyle={styles.selectedText}
                />
              </View>
            </View> */}
            {/* {seltips&&<Text style={styles.clear} onPress={()=>setSelTips(null)}>Clear</Text>} */}
            <View style={styles.line}></View>
            <View style={styles.total}>
              <Text style={[styles.boxtxt, { fontFamily: FONTS.Bold }]}>
                {t('Total Payable')}
              </Text>
              <Text style={[styles.boxtxt, { fontFamily: FONTS.Bold }]}>
                {Currency}{Number(totaloff) + (taxrate > 0 ? (Number(totaloff) * taxrate) / 100 : 0)+ (servicefee > 0 ? servicefee : 0) +
                  Number(deliveryfee) +
                  Number(seltips)}
              </Text>
            </View>
          </View>
          <View style={styles.paycov}>
            <View style={styles.paycovtxt}>
              {user?.shipping_address?.address ? <Text style={styles.locationtxt} numberOfLines={1}>
                {user?.shipping_address?.house_no}, {user?.shipping_address?.address}
              </Text> :
                <Text style={styles.locationtxt} numberOfLines={1}>
                  {locationadd}
                </Text>}
              <TouchableOpacity style={{ flexDirection: 'row', width: '40%',gap:2 }} onPress={() => navigate('Shipping')}>
                <LocationIcon height={18} width={18} />
                <Text style={styles.changadd}>{t('CHANGE ADDRESS')}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.cartbtn} onPress={() => user?.shipping_address?.address ? navigate('Checkout', { deliveryfee: deliveryfee, deliveryPartnerTip: seltips, tax: (taxrate > 0 ? (Number(totaloff) * taxrate) / 100 : 0),servicefee:servicefee > 0 ? servicefee : 0 }) : navigate('Shipping', { type: 'checkout' })}>
              <Text style={styles.buttontxt}>
                {t('CONTINUE TO PAY')} {Currency}{Number(totaloff) + (taxrate > 0 ? (Number(totaloff) * taxrate) / 100 : 0)+ (servicefee > 0 ? servicefee : 0) +
                  Number(deliveryfee) +
                  Number(seltips)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView> : <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: Dimensions.get('window').height - 200,
        }}>
        {/* <BucketIcon color={Constants.black} height={100} width={100} /> */}
        <Image source={require('../../Assets/Images/empty2.png')} style={{ height: 100, width: 100 }} />
        <Text style={styles.carttxt2}>{t('Your Cart is empty')}</Text>
        <Text style={styles.browsprod} onPress={() => navigate('Categories')}>{t('Browse Products')}</Text>
      </View>}
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View
              style={{
                backgroundColor: 'white',
                alignItems: 'center',
                paddingHorizontal: 30,
              }}>
              <Text style={styles.textStyle}>
                {t('Are you sure of clearing your cart?')}
              </Text>
              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setModalVisible(!modalVisible)}
                  style={styles.cancelButtonStyle}>
                  <Text style={[styles.modalText, { color: Constants.pink }]}>
                    {t('No')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.logOutButtonStyle}
                  onPress={async () => {
                    await AsyncStorage.removeItem('cartdata'),
                      setcartdetail([]),
                      setModalVisible(false);
                  }}>
                  <Text style={styles.modalText}>{t('Yes, Clear')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible2(!modalVisible2);
        }}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView2]}>
            {/* <View
              style={{
                backgroundColor: Constants.white,
                alignItems: 'center',
                width:'100%'
              }}> */}
            <CrossIcon
              style={{
                alignSelf: 'flex-end',
                position: 'absolute',
                top: 10,
                right: 15,
              }}
              height={18}
              width={18}
              onPress={() => {
                setModalVisible2(!modalVisible2);
              }}
              color={Constants.black}
            />
            <View style={{ height: '95%', width: '100%', marginTop: 20, paddingHorizontal: 20 }}>
              <Image source={{ uri: image }} style={{ height: '100%', width: '100%', backgroundColor: 'red' }} />
            </View>
          </View>
          {/* </View> */}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.lightpink,
  },
  toppart: {
    backgroundColor: Constants.violet,
    paddingTop: 5,
    // paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // padding: 10,
    paddingBottom: 5
  },
  addbtn: {
    backgroundColor: Constants.pink,
    color: Constants.white,
    paddingHorizontal: 18,
    paddingVertical: 5,
    borderRadius: 10,
    fontSize: 14,
    fontFamily: FONTS.Bold,
    // marginTop: 5,
    borderWidth: 1,
    borderColor: Constants.white,
    marginRight: 10,
    marginVertical:3
  },
  box: {
    padding: 20,
    // borderBottomWidth: 1,
    borderColor: Constants.customgrey3,
    marginHorizontal: 10,
  },
  firstpart: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  firstleftpart: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  carttxt: {
    color: Constants.white,
    fontSize: 18,
    fontFamily: FONTS.Bold,
  },
  cardimg: {
    height: 75,
    width: 75,
    // resizeMode: 'stretch',,
  },
  disctxt: {
    fontSize: 12,
    color: Constants.pink,
    fontFamily: FONTS.Medium,
    textDecorationLine: 'line-through',
  },
  productname: {
    fontSize: 16,
    color: Constants.black,
    fontFamily: FONTS.Bold,
    marginBottom: 5,
  },
  qty: {
    fontSize: 14,
    color: Constants.customgrey,
    fontFamily: FONTS.Bold,
    // marginBottom: 5,
  },
  maintxt: {
    fontSize: 14,
    color: Constants.black,
    fontFamily: FONTS.Bold,
  },
  addcov: {
    flexDirection: 'row',
    width: 120,
    height: 40,
    alignSelf: 'flex-end',
    // borderRadius:10
  },
  plus: {
    backgroundColor: Constants.pink,
    flex: 1,
    height: '100%',
    alignSelf: 'center',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    justifyContent:'center',
    alignItems:'center'
  },
  plus2: {
    backgroundColor: '#F3F3F3',
    color: Constants.black,
    flex: 1,
    textAlign: 'center',
    height: '100%',
    paddingVertical: '5%',
    fontSize: 20,
    alignSelf: 'center',
    fontFamily: FONTS.Black,
  },
  plus3: {
    backgroundColor: Constants.pink,
    flex: 1,
    height: '100%',
    alignSelf: 'center',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent:'center',
    alignItems:'center'
  },
  btombg: {
    backgroundColor: Constants.lightpink,
    // flex: 1,
    paddingBottom: 70,
  },
  totalcov: {
    backgroundColor: Constants.white,
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  paycov: {
    backgroundColor: Constants.white,
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  boxtxt: {
    color: Constants.black,
    fontSize: 16,
    // fontWeight: '500',
    fontFamily: FONTS.Medium,
  },
  boxtxt2: {
    color: Constants.customgrey,
    fontSize: 16,
    // fontWeight: '500',
    fontFamily: FONTS.Medium,
    textDecorationLine: 'line-through',
  },
  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    alignItems: 'center',
  },
  amount: {
    flexDirection: 'row',
    gap: 10,
  },
  line: {
    height: 1,
    backgroundColor: Constants.customgrey,
    marginVertical: 10,
  },
  buttontxt: {
    color: Constants.white,
    fontSize: 16,
    fontFamily: FONTS.Bold,
  },
  cartbtn: {
    height: 60,
    // width: 370,
    borderRadius: 10,
    backgroundColor: Constants.pink,
    // marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // width: '90%',
    // alignSelf: 'center',
    paddingHorizontal: 20,
  },
  locationtxt: {
    color: Constants.black,
    fontSize: 16,
    fontFamily: FONTS.Bold,
    marginRight: 5,
    width: '55%',
  },
  changadd: {
    fontSize: 14,
    color: Constants.pink,
    fontFamily: FONTS.Medium,
  },
  paycovtxt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  //////model///
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
    paddingVertical: 20,
    alignItems: 'center',
    width: '90%',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
    // position: 'relative',
    boxShadow: '7 7 0 1 #FC0965',
  },
  modalView2: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: 'center',
    width: '90%',
    height: '70%',
    marginTop: 20
  },

  textStyle: {
    color: Constants.black,
    // fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: FONTS.Bold,
    fontSize: 16,
    margin: 20,
    marginBottom: 10,
  },
  cancelAndLogoutButtonWrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 3,
  },
  modalText: {
    color: Constants.white,
    // fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: FONTS.Black,
    fontSize: 14,
  },
  cancelButtonStyle: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginRight: 10,
    borderColor: Constants.pink,
    borderWidth: 1,
    borderRadius: 10,
  },
  logOutButtonStyle: {
    flex: 0.5,
    backgroundColor: Constants.pink,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  ////model end/////
  carttxt2: {
    color: Constants.black,
    fontSize: 18,
    // fontWeight: '500',
    marginVertical: 10,
    fontFamily: FONTS.Bold,
  },
  browsprod: {
    // flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderColor: Constants.pink,
    borderWidth: 1.5,
    borderRadius: 10,
    color: Constants.pink,
    fontSize: 18,
    fontFamily: FONTS.Bold,
  },
  dropdown: {
    height: 40,
  },
  placeholder: {
    color: Constants.black,
    fontSize: 14,
    fontFamily: FONTS.Medium,
    // paddingVertical:12
  },
  selectedText: {
    color: Constants.black,
    fontSize: 16,
    fontFamily: FONTS.Medium,
    // paddingVertical:12,
  },
  itemText: {
    fontSize: 14,
    color: Constants.white,
    fontFamily: FONTS.Medium,
  },
  itemContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Constants.violet,
    
  },
  clear: {
    fontSize: 14,
    color: Constants.pink,
    fontFamily: FONTS.Medium,
    textAlign:'right',
    marginTop:-10
  },
  comboimg:{
    height:30,
    width:30,
    position:'absolute',
    top:-10,
    right:-10
  }
});
