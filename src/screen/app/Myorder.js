import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import Constants, {Currency, FONTS} from '../../Assets/Helpers/constant';
import {OrderIcon, SearchIcon} from '../../../Theme';
import {navigate} from '../../../navigationRef';
import {useIsFocused} from '@react-navigation/native';
import {GetApi, Post} from '../../Assets/Helpers/Service';
import {LoadContext, ToastContext, UserContext} from '../../../App';
import moment from 'moment';
import DriverHeader from '../../Assets/Component/DriverHeader';
import {useTranslation} from 'react-i18next';

const Myorder = () => {
  const {t} = useTranslation();
  const [orderlist, setorderlist] = useState();
  const [toast, setToast] = useContext(ToastContext);
  const [loading, setLoading] = useContext(LoadContext);
  const [user, setuser] = useContext(UserContext);
  const [page, setPage] = useState(1);
  const [alredyfavorite, setalredyfavorite] = useState(false);
  const [curentData, setCurrentData] = useState([]);
  const IsFocused = useIsFocused();
  const dumydata = [1, 2, 3];
  useEffect(() => {
    if (IsFocused) {
      getorders(1);
      setalredyfavorite(false);
    }
  }, [IsFocused]);

  const getorders = (p, text, favorite) => {
    setPage(p);
    let url;
    if (text) {
      url = `order/my-orders?page=${p}&search=${text}`;
    } else if (favorite) {
      url = `order/my-orders?page=${p}&filter=favorite`;
      setLoading(true);
    } else {
      url = `getProductRequestbyUser?page=${p}`;

      // setLoading(true);
    }
    GetApi(url, {}).then(
      async res => {
        setLoading(false);
        console.log(res);
        // setorderlist(res.data);
        setCurrentData(res.data);
        if (p === 1) {
          setorderlist(res.data);
        } else {
          setorderlist([...orderlist, ...res.data]);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
  const getordersearch = text => {
    // setLoading(true);
    GetApi(`order/my-orders?page=1&search=${text}`).then(
      async res => {
        // setLoading(false);
        console.log(res);
        setorderlist(res.data);
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
  const fetchNextPage = () => {
    // console.log('end');
    // console.log('end', curentData.length);
    if (curentData.length === 20) {
      getorders(page + 1);
      // setPage(page + 1);
    }
  };
  const rating = (id2, rate) => {
    const d = {
      id: id2,
      rating: rate,
    };
    console.log(d);
    setLoading(true);
    Post('rating', d).then(async res => {
      setLoading(false);
      console.log(res);
      getorders(1);
    });
  };
  const reorder = id => {
    setLoading(true);
    Post(`order/re-order/${id}`).then(async res => {
      setLoading(false);
      console.log(res);
      getorders(1);
    });
  };
  const setfavorite = id => {
    setLoading(true);
    Post(`order/favorite/${id}`).then(async res => {
      setLoading(false);
      console.log(res);
      if (res.success) {
        setToast(res?.message);
        getorders(1);
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <DriverHeader item={t('My Order')} showback={true} />
      {/* <View style={styles.toppart}>
          <Image
            source={require('../../Assets/Images/logosmall.png')}
            style={styles.logoimg}
          />
          <Text style={styles.ordertxt}>My orders</Text>
          <TouchableOpacity onPress={() => navigate('Profile')}>
            <Image
              // source={require('../../Assets/Images/profile3.png')}
              style={styles.logoimg}
              source={
                user?.avatar
                  ? {
                      uri: `${user.avatar}`,
                    }
                  : require('../../Assets/Images/profile3.png')
              }
            />
          </TouchableOpacity>
        </View> */}
      {/* <View style={[styles.inpcov]}>
          <SearchIcon height={20} width={20} />
          <TextInput
            style={styles.input}
            placeholder="Search order"
            placeholderTextColor={Constants.light_black}
            onChangeText={name => getorders(1, name)}></TextInput>
          {orderlist && orderlist.length > 0 && alredyfavorite ? (
            <TouchableOpacity
              onPress={() => {
                getorders(1), setalredyfavorite(false);
              }}>
              <Image
                source={require('../../Assets/Images/favorite.png')}
                style={{height: 20, width: 20, alignSelf: 'center'}}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                getorders(1, null, 'favorite'), setalredyfavorite(true);
              }}>
              <Image
                source={require('../../Assets/Images/love.png')}
                style={{height: 20, width: 20, alignSelf: 'center'}}
              />
            </TouchableOpacity>
          )}
        </View> */}

      <View style={{paddingHorizontal: 20, flex: 1}}>
        <FlatList
          data={orderlist}
          ListEmptyComponent={() => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: Dimensions.get('window').height - 300,
              }}>
              <Text
                style={{
                  color: Constants.black,
                  fontSize: 20,
                  fontFamily: FONTS.Medium,
                }}>
                {!orderlist ? t('Loading...') : t('No Orders')}
              </Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigate('Orderview', {id: item?._id})}>
              <View style={{flexDirection: 'row', marginBottom: 10}}>
                <View style={{flexDirection: 'row', flex: 1}}>
                  <View style={styles.ordiccov}>
                    <OrderIcon />
                  </View>
                  <View
                    style={{
                      marginLeft: 10,
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.txt1}>{t('Date')}</Text>
                    <Text style={styles.txt1}>
                      :- {moment(item?.createdAt).format('DD MMM, hh:mm A')}
                    </Text>
                  </View>
                </View>
                <View>
                  {/* {item?.is_favorite == 0 ? (
                      <TouchableOpacity onPress={() => setfavorite(item?.id)}>
                        <Image
                          source={require('../../Assets/Images/love.png')}
                          style={{height: 20, width: 20, alignSelf: 'center'}}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={() => setfavorite(item?.id)}>
                        <Image
                          source={require('../../Assets/Images/favorite.png')}
                          style={{height: 20, width: 20, alignSelf: 'center'}}
                        />
                      </TouchableOpacity>
                    )} */}
                  <Text style={styles.delevered}>{item?.status}</Text>
                </View>
              </View>
              {item?.productDetail.map((prod, index) => (
                // {[1].map((prod, index) => (
                <View key={index}>
                  <View style={{flexDirection: 'row', marginBottom: 5}}>
                    <TouchableOpacity onPress={()=>navigate('Preview', prod?.product?._id)}>
                    <Image
                      // source={require('../../Assets/Images/meal.png')}
                      source={
                        prod?.image
                          ? {
                              uri: `${prod.image}`,
                            }
                          : require('../../Assets/Images/veg.png')
                      }
                      style={styles.cartimg}
                      resizeMode="contain"
                    />
                    </TouchableOpacity>
                    <View style={{flex: 1, marginLeft: 10}}>
                      <Text style={styles.boxtxt}>{prod?.product?.name}</Text>
                      <Text style={styles.qty}>
                        {prod?.price_slot?.value} {prod?.price_slot?.unit}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          // marginVertical: 10,
                        }}>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Text style={styles.boxtxt2}>{t('Qty')}</Text>
                          <Text style={styles.boxtxt2}> :- {prod?.qty}</Text>
                        </View>
                        <Text style={styles.boxtxt3}>
                          {Currency} {prod?.price}{' '}
                        </Text>
                      </View>
                    </View>
                  </View>
                  {/* <View style={{alignSelf: 'center', marginBottom: 5}}>
                      <StarRating
                        rating={prod?.rating}
                        enableHalfStar={false}
                        color={Constants.violet}
                        onChange={() => {}}
                        onRatingEnd={e => rating(prod.id, e)}
                      />
                    </View> */}
                </View>
              ))}
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text></Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.txt3}>
                    {t('Total')}
                  </Text>
                  <Text style={styles.txt3}>
                    {''} {Currency} {item?.finalAmount}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          onEndReached={() => {
            if (orderlist && orderlist.length > 0) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.05}
        />
      </View>
    </SafeAreaView>
  );
};

export default Myorder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.white,
    // padding: 20,
  },
  logoimg: {
    height: 40,
    width: 40,
    borderRadius: 70,
  },
  toppart: {
    padding: 20,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  inpcov: {
    borderWidth: 1,
    borderColor: Constants.customgrey,
    backgroundColor: Constants.white,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginHorizontal: 20,
  },
  input: {
    flex: 1,
    color: Constants.black,
    fontFamily: FONTS.Regular,
    fontSize: 16,
    // backgroundColor:Constants.red
  },
  ordertxt: {
    color: Constants.black,
    fontSize: 18,
    fontFamily: FONTS.Bold,
    alignSelf: 'center',
  },
  ordiccov: {
    height: 40,
    width: 40,
    backgroundColor: Constants.violet,
    borderRadius: 30,
    padding: 7,
    alignSelf: 'center',
  },
  txt1: {
    color: Constants.black,
    fontSize: 14,
    fontFamily: FONTS.Medium,
    // flex: 1,
    marginVertical: 5,
  },
  txt3: {
    color: Constants.black,
    fontSize: 16,
    fontFamily: FONTS.Medium,
    // alignSelf: 'center',
  },
  txt2: {
    color: Constants.black,
    fontSize: 14,
    fontFamily: FONTS.Regular,
    // flex:1
  },
  card: {
    // flexDirection: 'row',
    justifyContent: 'space-between',
    // flex:1,
    // height:75,
    borderBottomWidth: 2,
    borderColor: Constants.customgrey,
    paddingBottom: 10,
    width: '100%',
    marginVertical: 10,
  },
  delevered: {
    color: Constants.white,
    fontSize: 16,
    fontFamily: FONTS.Regular,
    backgroundColor: Constants.violet,
    padding: 5,
    borderRadius: 3,
    marginVertical: 5,
    textAlign: 'center',
  },
  boxtxt3: {
    color: Constants.black,
    fontSize: 14,
    // fontWeight: '500',
    fontFamily: FONTS.Bold,
  },
  boxtxt2: {
    color: Constants.black,
    fontSize: 14,
    fontFamily: FONTS.Regular,
  },
  cartimg: {
    height: 40,
    width: 40,
    // resizeMode: 'contain',
  },
  boxtxt: {
    color: Constants.black,
    fontSize: 14,
    // fontWeight: '500',
    fontFamily: FONTS.Medium,
  },
  favfiltxt: {
    color: Constants.violet,
    fontSize: 16,
    fontFamily: FONTS.Bold,
  },
  favfilcov: {
    borderWidth: 1,
    borderColor: Constants.violet,
    // width:'50%',
    gap: 5,
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignSelf: 'flex-end',
    marginTop: 10,
    marginRight: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: {
    fontSize: 14,
    color: Constants.customgrey,
    fontFamily: FONTS.Bold,
    // marginBottom: 5,
  },
});
