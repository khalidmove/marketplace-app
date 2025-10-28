import {
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import Constants, {Currency, FONTS} from '../../Assets/Helpers/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CartContext, LoadContext, ToastContext} from '../../../App';
import {CartIcon, Cross2Icon, CrossIcon, MinusIcon, Plus2Icon} from '../../../Theme';
import Header from '../../Assets/Component/Header';
import {navigate} from '../../../navigationRef';
import {GetApi} from '../../Assets/Helpers/Service';
import moment from 'moment';
import DriverHeader from '../../Assets/Component/DriverHeader';
import {useTranslation} from 'react-i18next';

const Preview = props => {
  const productid = props?.route?.params;
  const {t} = useTranslation();
  console.log(productid);
  const [isalreadyadd, setisalreadyadd] = useState(false);
  const [currentproduct, setcurrentproduct] = useState({});
  const [cartdetail, setcartdetail] = useContext(CartContext);
  const [toast, setToast] = useContext(ToastContext);
  const [loading, setLoading] = useContext(LoadContext);
  const [selectedslot, setsselectedslot] = useState();
  const [productdata, setproductdata] = useState();
  const [combolist, setcombolist] = useState([]);
  const [isInCart, setIsInCart] = useState(false);
  const [availableQty, setAvailableQty] = useState(0);
  const [image, setimage] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  const sumdata =
    cartdetail && cartdetail.length > 0
      ? cartdetail.reduce((a, item) => {
          return Number(a) + Number(item?.offer) * Number(item?.qty);
        }, 0)
      : null;
  console.log(sumdata);

  useEffect(() => {
    if (productid) {
      getProductById();
      getComboInclueProduct();
    }
  }, []);
  useEffect(() => {
    const currentproduct = cartdetail.find(
      item => item?.productid === productdata?._id,
    );
    setcurrentproduct(currentproduct);
  }, [cartdetail]);

  useEffect(() => {
    if (cartdetail.length > 0) {
      const cartItem = cartdetail.find(
        f =>
          f.productid === productdata?._id &&
          f.price_slot?.value === selectedslot?.value,
      );

      if (cartItem) {
        console.log('enter');
        setIsInCart(true);
        setAvailableQty(cartItem.qty);
      } else {
        setIsInCart(false);
        setAvailableQty(0);
      }
    } else {
      setIsInCart(false);
      setAvailableQty(0);
    }
  }, [cartdetail, productdata, selectedslot]);

  const getProductById = () => {
    setLoading(true);
    GetApi(`getProductById/${productid}`).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.status) {
          setproductdata(res.data);
          if (res?.data?.price_slot && res?.data?.price_slot?.length > 0) {
            setsselectedslot(res?.data?.price_slot[0]);
          }
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
  const getComboInclueProduct = () => {
    setLoading(true);
    GetApi(`getCombosIncludProduct?product_id=${productid}`).then(
      async res => {
        setLoading(false);
        console.log(res);
        setcombolist(res?.data);
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  console.log('cartdetail', cartdetail);
  console.log('currentproduct', currentproduct);

  const cartdata = async () => {

    const existingCart = Array.isArray(cartdetail) ? cartdetail : [];

    // Check if the exact product with selected price_slot exists
    const existingProduct = existingCart.find(
      f =>
        f.productid === productdata._id &&
        f.price_slot?.value === selectedslot?.value,
    );

    if (!existingProduct) {
      const newProduct = {
        // ...productdata,
        // qty: availableQty || 1,
        // price: selectedslot.our_price,
        // price_slot: selectedslot,
        productid: productdata._id,
        productname: productdata.name,
        price: selectedslot.other_price,
        offer: selectedslot.our_price,
        price_slot: selectedslot,
        image: productdata.varients[0].image[0],
        qty: 1,
        seller_id: productdata.userid,
      };

      const updatedCart = [...existingCart, newProduct];
      setcartdetail(updatedCart);
      await AsyncStorage.setItem('cartdata', JSON.stringify(updatedCart));
      console.log('Product added to cart:', newProduct);
    } else {
      console.log(
        'Product already in cart with this price slot:',
        existingProduct,
      );
    }
  };
  const handleAddToCart = async(item) => {
    setcartdetail((prevCartData) => {
      const existingItem = prevCartData.find((f) => f.productid === item?._id);

      if (!existingItem) {
        const newItem = {
          productid: item._id, // Unique combo ID
          productname: item.comboItems
            .map((comboItem) => comboItem?.product?.name)
            .join(", "),
          comboItems: item.comboItems,
          qty: 1,
          offer: Number(item.offer_price.toFixed(2)),
          type: "combo",
          image:
            item.comboItems?.[0]?.product?.varients?.[0]?.image?.[0] ||
            "https://cdn.pixabay.com/photo/2022/08/22/21/58/grocery-7404621_640.png",
          price: item.old_price,
          seller_id: item?.userid?._id,
        };

        const updatedCart = [...prevCartData, newItem];
        AsyncStorage.setItem('cartdata', JSON.stringify(updatedCart));
        return updatedCart;
      }else{
         const updatedCart = prevCartData.map((_i) => {
        if (_i.productid === item._id) {
          return { ..._i, qty: _i.qty + 1 };
        } else {
          return _i;
        }
      });

      AsyncStorage.setItem("cartdata", JSON.stringify(updatedCart));
      return updatedCart;
      }
    });

    setToast("Combo added to cart");
  };

  const formatPricePerUnit = (price, quantity, unit) => {
    let unitText = '';
    let factor = 1;

    switch (unit?.toLowerCase()) {
      case 'kg':
        unitText = '1 kg';
        factor = 1; // 1 kg = 1000 g → 100 g = 1/10 of the price
        break;
      case 'gm':
        unitText = '100 gms';
        factor = 100; // Convert the given grams into 100 gms equivalent
        break;
      case 'litre':
        unitText = '1 liter';
        factor = 1; // 1 litre = 1000 ml → 100 ml = 1/10 of the price
        break;
      case 'ml':
        unitText = '100 ml';
        factor = 100; // Convert the given ml into 100 ml equivalent
        break;
      case 'piece':
        unitText = 'per piece';
        factor = 1; // Price remains the same
        break;
      case 'pack':
        unitText = 'per pack';
        factor = 1; // Price remains the same
        break;
      default:
        return 'Invalid unit';
    }

    const calculatedPrice = (price / quantity) * factor;
    return `${Currency} ${calculatedPrice.toFixed(2)} / ${unitText}`;
  };

  const width = Dimensions.get('window').width - 40;
  return (
    <SafeAreaView style={styles.container}>
      <DriverHeader item={t('Product Detail')} showback={true} />
      <ScrollView showsVerticalScrollIndicator={false} style={{padding: 20}}>
        <View style={{marginTop: 0}}>
          <SwiperFlatList
            // autoplay
            // autoplayDelay={2}
            // autoplayLoop
            // index={2}
            showPagination
            paginationActiveColor="red"
            data={productdata?.varients[0].image || []}
            // renderItem={({item}) => (
            //   <View style={[styles.child, {backgroundColor: item}]}>
            //     <Text style={styles.text}>{item}</Text>
            //   </View>
            // )}
            renderItem={({item, index}) => (
              <TouchableOpacity
              onPress={() => {setimage(item),setModalVisible(true)}}
                style={{paddingBottom: 35, width: width, alignItems: 'center'}}>
                <Image
                  source={{uri: `${item}`}}
                  // source={item.images}
                  style={{
                    height: 250,
                    width: '93%',
                    borderRadius: 15,
                    // marginLeft:-40,
                    // backgroundColor: 'red',
                  }}
                  resizeMode="stretch"
                  key={index}
                />
              </TouchableOpacity>
            )}
          />
        </View>
        <Text style={styles.proname}>{productdata?.name}</Text>
        <Text style={[styles.dectitle, {marginLeft: 10}]}>
          {productdata?.short_description}
        </Text>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {productdata?.price_slot &&
            productdata?.price_slot.length > 0 &&
            productdata?.price_slot[0].unit &&
            productdata.price_slot.map((item, i) => (
              <TouchableOpacity
                style={[
                  styles.box,
                  {
                    marginRight:
                      productdata?.price_slot.length === i + 1 ? 20 : 10,
                    backgroundColor:
                      selectedslot?.value === item.value
                        ? Constants.lightpink
                        : Constants.customgrey3,
                    borderColor:
                      selectedslot?.value === item.value
                        ? Constants.linearcolor
                        : Constants.customgrey,
                  },
                ]}
                key={i}
                onPress={() => setsselectedslot(item)}>
                <ImageBackground
                  source={require('../../Assets/Images/star1.png')}
                  style={styles.cardimg2}>
                  <Text style={styles.offtxt}>
                    {(
                      ((item?.other_price - item?.our_price) /
                        item?.other_price) *
                      100
                    ).toFixed(0)}
                    %
                  </Text>
                  <Text style={styles.offtxt}>{t('off')}</Text>
                </ImageBackground>
                <Text style={styles.weight}>
                  {item?.value}
                  {item.unit}
                </Text>
                <View style={{}}>
                  <Text style={styles.maintxt}>
                    {Currency}
                    {item.our_price}
                  </Text>
                  <Text style={styles.disctxt}>
                    {formatPricePerUnit(item.our_price, item?.value, item.unit)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
        </ScrollView>
        <View style={styles.pricecov}>
          <View style={{flexDirection: 'row', gap: 10}}>
            <Text style={styles.maintxt2}>
              {Currency} {selectedslot?.our_price}
            </Text>
            {selectedslot?.our_price && (
              <Text
                style={[styles.weight, {textDecorationLine: 'line-through'}]}>
                {Currency} {selectedslot?.other_price}
              </Text>
            )}
            {selectedslot?.our_price && (
              <Text style={styles.disctxt2}>
                {(
                  ((selectedslot?.other_price - selectedslot?.our_price) /
                    selectedslot?.other_price) *
                  100
                ).toFixed(0)}
                % {t('off')}
              </Text>
            )}
          </View>
          {isInCart ? (
            <View style={styles.addcov}>
              <TouchableOpacity
                style={styles.plus}
                onPress={async () => {
                  if (availableQty > 1) {
                    // Decrease quantity
                    const updatedCart = cartdetail.map(item => {
                      if (
                        item.productid === currentproduct?.productid &&
                        item.price_slot?.value === selectedslot?.value
                      ) {
                        return {
                          ...item,
                          qty: item.qty - 1,
                          price: selectedslot.other_price,
                          offer: selectedslot.our_price,
                          price_slot: selectedslot,
                        };
                      }
                      return item;
                    });

                    setcartdetail(updatedCart);
                    await AsyncStorage.setItem(
                      'cartdata',
                      JSON.stringify(updatedCart),
                    );
                    console.log(
                      'Product quantity decreased:',
                      currentproduct?.productname,
                    );

                    setAvailableQty(availableQty - 1);
                  } else {
                    // Remove product from cart if qty is 1
                    const updatedCart = cartdetail.filter(item => {
                      return !(
                        item.productid === currentproduct?.productid &&
                        item.price_slot?.value === selectedslot?.value
                      );
                    });

                    setcartdetail(updatedCart);
                    await AsyncStorage.setItem(
                      'cartdata',
                      JSON.stringify(updatedCart),
                    );
                    console.log(
                      'Product removed from cart:',
                      currentproduct?.productname,
                    );

                    setIsInCart(false);
                    setAvailableQty(0);
                  }
                }}>
                <MinusIcon color={Constants.white} height={20} width={20} />
              </TouchableOpacity>
              <Text style={styles.plus2}>{availableQty}</Text>
              <TouchableOpacity
                style={styles.plus3}
                onPress={async () => {
                  const updatedCart = cartdetail.map(item => {
                    if (
                      item.productid === currentproduct?.productid &&
                      item.price_slot?.value === selectedslot?.value
                    ) {
                      return {
                        ...item,
                        qty: item.qty + 1,
                        price: selectedslot.other_price,
                        offer: selectedslot.our_price,
                        price_slot: selectedslot,
                      };
                    }
                    return item;
                  });

                  setcartdetail(updatedCart);
                  await AsyncStorage.setItem(
                    'cartdata',
                    JSON.stringify(updatedCart),
                  );
                  console.log(
                    'Product quantity increased:',
                    currentproduct?.productname,
                  );
                }}>
                <Plus2Icon color={Constants.white} height={20} width={20} />
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.addbtn} onPress={() => cartdata()}>
              {t('ADD')}
            </Text>
          )}
        </View>
        <View style={styles.line}></View>
        <View style={styles.productinfocov}>
          <Text style={styles.proddec}>{t('Product Information')}</Text>
          <View style={styles.expirycard}>
            <Text style={styles.exptxt}>{t('EXPIRY DATE')}</Text>
            <Text style={styles.exptxt2}>
              {moment(productdata?.expirydate).format('DD MMM yyyy')}
            </Text>
          </View>
        </View>
        <View style={{marginVertical: 10}}>
          <Text style={styles.dechead}>{t('COUNTRY OF ORIGIN')}</Text>
          <Text style={styles.dectitle}>{productdata?.origin}</Text>
        </View>
        {/* <View style={{marginVertical: 10}}>
          <Text style={styles.dechead}>SHELF LIFE</Text>
          <Text style={styles.dectitle}>{productdata?.selflife}</Text>
        </View> */}
        <View style={{marginVertical: 10}}>
          <Text style={styles.dechead}>{t('MANUFACTURER NAME')}</Text>
          <Text style={styles.dectitle}>{productdata?.manufacturername}</Text>
        </View>
        <View style={{marginVertical: 10, marginBottom: 10}}>
          <Text style={styles.dechead}>{t('MANUFACTURER ADDRESS')}</Text>
          <Text style={styles.dectitle}>{productdata?.manufactureradd}</Text>
        </View>
        {combolist &&
            combolist.length > 0 &&<Text style={styles.proname3}>Combo Products</Text>}
        <View style={{marginBottom:100}}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {combolist &&
            combolist.length > 0 &&
            combolist.map((it, i) => (
              <View
                style={[
                  styles.shadowWrapper,
                  {marginRight: combolist.length === i + 1 ? 20 : 10},
                ]}
                key={i}>
                <View style={[styles.box2]}>
                  {it?.comboItems.map((item, ind) => (
                    <View key={ind} style={styles.productcov}>
                      <Image
                        // source={require('../../Assets/Images/salt.png')}
                        source={{uri: item?.product?.varients[0].image[0]}}
                        style={styles.cardimg}
                        resizeMode="stretch"
                      />

                      {/* <ImageBackground
                        source={require('../../Assets/Images/star1.png')}
                        style={styles.cardimg2}>
                        <Text style={styles.offtxt}>
                          {(
                            ((item?.selected_slot?.other_price -
                              item?.selected_slot?.our_price) /
                              item?.selected_slot?.other_price) *
                            100
                          ).toFixed(0)}
                          %
                        </Text>
                        <Text style={styles.offtxt}>{t('off')}</Text>
                      </ImageBackground> */}

                      <Text style={styles.proname2} numberOfLines={2}>
                        {item?.product?.name}
                      </Text>
                      <Text style={styles.weight}>
                        {item?.selected_slot?.value} {item?.selected_slot?.unit}
                      </Text>
                      <View style={{flex: 1}}>
                        {/* <Text style={styles.weight2}>
                          {Currency}
                          {item?.selected_slot?.other_price}
                        </Text> */}

                        <Text style={styles.disctxt}>
                          {Currency}
                          {item?.selected_slot?.our_price}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
                  <View style={{flexDirection:'row',gap:10,alignItems:'center',alignSelf:'center',marginBottom:10}}>
                    <Text style={[styles.maintxt,{textDecorationLine:'line-through'}]}>{Currency}{it?.old_price}</Text>
                    <Text style={styles.maintxt2}>{Currency}{it?.offer_price}</Text>
                  </View>
                  <Text style={styles.addbtn2} onPress={() => handleAddToCart(it)}>
              {t('ADD')}
            </Text>
              </View>
            ))}
        </ScrollView>
        </View>
      </ScrollView>
      {currentproduct && (
        <TouchableOpacity
          style={styles.cartbtn}
          onPress={() => navigate('Cart')}>
          <Text style={styles.buttontxt}>
            {' '}
            {cartdetail.length} {t('items')} | {Currency}
            {sumdata}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <CartIcon color={Constants.white} style={{marginRight: 5}} />
            <Text style={styles.buttontxt}>{t('View Cart')}</Text>
          </View>
        </TouchableOpacity>
      )}
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView2]}>
            {/* <View
              style={{
                backgroundColor: Constants.white,
                alignItems: 'center',
                width:'100%'
              }}> */}
            <Cross2Icon
              style={{
                alignSelf: 'flex-end',
                position: 'absolute',
                top: -40,
                right: -10,
              }}
              height={30}
              width={30}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
              color={Constants.red}
            />
            <View style={{ height: '100%', width: '100%', }}>
              <Image source={{ uri: image }} style={{ height: '100%', width: '100%', }} />
            </View>
          </View>
          {/* </View> */}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Preview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.white,
    // padding: 20,
  },
  proname: {
    fontSize: 16,
    color: Constants.black,
    fontFamily: FONTS.Bold,
    marginVertical: 7,
  },
  proname3: {
    fontSize: 16,
    color: Constants.black,
    fontFamily: FONTS.Bold,
  },
  proname2: {
    fontSize: 14,
    color: Constants.black,
    fontFamily: FONTS.Medium,
    marginTop: 7,
    width: 100,
  },
  weight: {
    fontSize: 14,
    color: Constants.black,
    fontFamily: FONTS.Regular,
    marginVertical: 5,
  },
  weight2: {
    fontSize: 14,
    color: Constants.black,
    fontFamily: FONTS.Regular,
    marginBottom: 5,
    textDecorationLine: 'line-through',
  },
  disctxt: {
    fontSize: 14,
    color: Constants.linearcolor,
    fontFamily: FONTS.Regular,
  },
  disctxt2: {
    fontSize: 16,
    color: Constants.pink,
    fontFamily: FONTS.Medium,
    alignSelf: 'center',
  },
  maintxt: {
    fontSize: 16,
    color: Constants.black,
    fontFamily: FONTS.Bold,
    // textDecorationLine: 'line-through',
  },
  maintxt2: {
    fontSize: 18,
    color: Constants.linearcolor,
    fontFamily: FONTS.Bold,
    // textDecorationLine: 'line-through',
  },
  box: {
    backgroundColor: Constants.lightpink,
    width: 150,
    padding: 10,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: Constants.linearcolor,
    marginLeft: 10,
    marginTop: 10,
  },
  cardimg2: {
    height: 45,
    width: 45,
    position: 'absolute',
    right: -7,
    top: -10,
    justifyContent: 'center',
    alignItems: 'center',
    // zIndex:99
    // backgroundColor:Constants.red
  },
  offtxt: {
    fontSize: 12,
    color: Constants.white,
    fontFamily: FONTS.Black,
    marginLeft: 2,
  },
  addbtn: {
    backgroundColor: Constants.pink,
    color: Constants.white,
    paddingHorizontal: 25,
    paddingVertical: 7,
    borderRadius: 5,
    fontSize: 16,
    fontFamily: FONTS.Bold,
    // position: 'absolute',
    // right: 0,
  },
  addbtn2: {
    backgroundColor: Constants.pink,
    color: Constants.white,
    paddingHorizontal: 25,
    paddingVertical: 7,
    borderRadius: 5,
    fontSize: 16,
    fontFamily: FONTS.Bold,
    // justifyContent:'center',
    alignSelf:'center',
    marginBottom:10
    // position: 'absolute',
    // right: 0,
  },
  line: {
    height: 4,
    backgroundColor: Constants.customgrey3,
    width: '120%',
    marginLeft: -20,
  },
  pricecov: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  proddec: {
    fontSize: 16,
    color: Constants.black,
    fontFamily: FONTS.Bold,
    // marginTop:20
  },
  dechead: {
    fontSize: 14,
    color: Constants.black,
    fontFamily: FONTS.Medium,
    // marginTop:20
  },
  dectitle: {
    fontSize: 14,
    color: Constants.customgrey,
    fontFamily: FONTS.Regular,
    // marginTop:20
  },
  productinfocov: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  expirycard: {
    backgroundColor: '#EDEDED',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
  },
  exptxt: {
    fontSize: 12,
    color: Constants.black,
    fontFamily: FONTS.Bold,
  },
  exptxt2: {
    fontSize: 14,
    color: Constants.linearcolor,
    fontFamily: FONTS.Medium,
  },
  addcov: {
    flexDirection: 'row',
    width: 120,
    height: 40,
    // borderRadius:10
  },
  plus: {
    backgroundColor: Constants.pink,
    // color: Constants.white,
    flex: 1,
    // textAlign: 'center',
    height: '100%',
    // paddingVertical: '5%',
    // fontSize: 30,
    alignSelf: 'center',
    // fontFamily: FONTS.Bold,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
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
    // color: Constants.white,
    flex: 1,
    // textAlign: 'center',
    height: '100%',
    // paddingVertical: '2%',
    // fontSize: 30,
    alignSelf: 'center',
    // fontFamily: FONTS.Bold,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttontxt: {
    color: Constants.white,
    fontSize: 18,
    fontFamily: FONTS.Bold,
  },
  cartbtn: {
    height: 60,
    // width: 370,
    borderRadius: 10,
    backgroundColor: Constants.pink,
    // marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    width: '90%',
    alignSelf: 'center',
    paddingHorizontal: 20,
  },

  cardimg: {
    height: 100,
    width: 100,
    borderRadius: 10,
    resizeMode: 'contain',
    alignSelf: 'center',
    // backgroundColor:'red'
  },
  shadowWrapper: {
    boxShadow: '0 0 6 0.5 grey',
    borderRadius: 20,
    marginVertical: 15,
    marginHorizontal: 10,
    backgroundColor: '#fff', // necessary for iOS shadows
  },
  box2: {
    // width:170,
    paddingTop: 15,
    paddingBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 20,
    gap: 10,
    flexDirection: 'row',
    overflow: 'visible', // still needed if your child extends outside
    backgroundColor: 'transparent', // make sure this doesn't override shadow
  },
   //////model///
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
    backgroundColor: '#rgba(0, 0, 0, 0.5)',
  },
  modalView2: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    // paddingVertical: 10,
    alignItems: 'center',
    width: '95%',
    height: '70%',
    marginTop: 20
  },
});
