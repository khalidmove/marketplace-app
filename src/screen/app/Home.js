import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Constants, { Currency, FONTS } from '../../Assets/Helpers/constant';
import {
  DiscountIcon,
  DownarrIcon,
  LocationIcon,
  PlusIcon,
  ProfileIcon,
  RightarrowIcon,
  SearchIcon,
} from '../../../Theme';
import LinearGradient from 'react-native-linear-gradient';
import { navigate } from '../../../navigationRef';
import { GetApi } from '../../Assets/Helpers/Service';
import { CartContext, LoadContext, ToastContext } from '../../../App';
import Header from '../../Assets/Component/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SwiperFlatList from 'react-native-swiper-flatlist';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();
  const [cartdetail, setcartdetail] = useContext(CartContext);
  const [toast, setToast] = useContext(ToastContext);
  const [loading, setLoading] = useContext(LoadContext);
  const [categorylist, setcategorylist] = useState();
  const [topsellinglist, settopsellinglist] = useState([]);
  const [carosalimg, setcarosalimg] = useState([]);
  // const dumydata = [
  //   {
  //     name: 'Tata Salt',
  //     weight: '500g',
  //     off: '5',
  //     mainprice: 25,
  //     price: 24,
  //   },
  //   {
  //     name: 'Kurkure Yummy Puffcorn Yumm...',
  //     weight: '50g',
  //     price: 22,
  //   },
  //   {
  //     name: 'The Whole Truth Mini Proteine B...',
  //     weight: '27g',
  //     price: 44,
  //     off: '20',
  //     mainprice: 55,
  //   },
  // ];
  // const dumydata2 = [
  //   {img: require('../../Assets/Images/veg.png'), name: 'Fruits & Vegetables'},
  //   {
  //     img: require('../../Assets/Images/oil.png'),
  //     name: 'Atta, Rice, Oil & Dals',
  //   },
  //   {
  //     img: require('../../Assets/Images/dairy.png'),
  //     name: 'Dairy, Bread & Eggs',
  //   },
  //   {
  //     img: require('../../Assets/Images/cold.png'),
  //     name: 'Cold Drinks & Juices',
  //   },
  // ];
  useEffect(() => {
    getCategory();
    getTopSoldProduct()
    getSetting()
  }, []);

  const getCategory = () => {
    setLoading(true);
    GetApi(`getCategory?limit=8`, {}).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.status) {
          setcategorylist(res.data);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
  const getTopSoldProduct = () => {
    setLoading(true);
    GetApi(`getTopSoldProduct?limit=5`, {}).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.status) {
          settopsellinglist(res.data);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
  const getSetting = () => {
    setLoading(true);
    GetApi(`getsetting`, {}).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.success) {
          setcarosalimg(res?.setting[0].carousel);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
  const cartdata = async (productdata) => {

   const existingCart = Array.isArray(cartdetail) ? cartdetail : [];

// Check if the cart already has items
if (existingCart.length > 0) {
  const currentSellerId = existingCart[0].seller_id;

  // If trying to add a product from a different seller
  if (productdata.userid !== currentSellerId) {
    console.log("Different seller detected, clearing cart...");

    // 🧹 Clear old cart and add new item
    const newProduct = {
      productid: productdata._id,
      productname: productdata.name,
      price: productdata?.price_slot[0]?.other_price,
      offer: productdata?.price_slot[0]?.our_price,
      image: productdata.varients[0].image[0],
      price_slot: productdata?.price_slot[0],
      qty: 1,
      seller_id: productdata.userid,
    };

    const updatedCart = [newProduct];
    setcartdetail(updatedCart);
    await AsyncStorage.setItem("cartdata", JSON.stringify(updatedCart));
    setToast("New product added (previous seller's cart cleared)");
    console.log("New product added after clearing cart:", newProduct);
    return;
  }
}

// Same seller or empty cart
const existingProduct = existingCart.find(
  (f) =>
    f.productid === productdata._id &&
    f.price_slot?.value === productdata?.price_slot[0]?.value
);

if (!existingProduct) {
  const newProduct = {
    productid: productdata._id,
    productname: productdata.name,
    price: productdata?.price_slot[0]?.other_price,
    offer: productdata?.price_slot[0]?.our_price,
    image: productdata.varients[0].image[0],
    price_slot: productdata?.price_slot[0],
    qty: 1,
    seller_id: productdata.userid,
  };

  const updatedCart = [...existingCart, newProduct];
  setcartdetail(updatedCart);
  await AsyncStorage.setItem("cartdata", JSON.stringify(updatedCart));
  setToast("Product added to cart successfully");
  console.log("Product added to cart:", newProduct);
} else {
  const updatedCart = cartdetail.map((item) => {
    if (item.productid === productdata._id) {
      return { ...item, qty: item.qty + 1 };
    }
    return item;
  });

  setcartdetail(updatedCart);
  await AsyncStorage.setItem("cartdata", JSON.stringify(updatedCart));
  setToast("Product quantity increased");
  console.log("Product quantity updated:", existingProduct);
}

  };
  const width = Dimensions.get('window').width;
  const width2 = Dimensions.get('window').width - 30;
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={{ backgroundColor: Constants.violet, paddingBottom: 15 }}>
        <TouchableOpacity
          style={[styles.inpcov]}
          onPress={() => {console.log('enter'),navigate('Searchpage')}}
        >
          <SearchIcon height={20} width={20} />
          <TextInput
            style={styles.input}
            editable={false}
            placeholder={t('Search')}
            onPress={() =>navigate('Searchpage')}
            placeholderTextColor={Constants.light_black}></TextInput>
        </TouchableOpacity>
      </View>
      <ScrollView style={{ marginBottom: Platform.OS === 'android' ? 70 : 70 }} showsVerticalScrollIndicator={false}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['#D7176C', '#95267C']}
          style={styles.btn}>
          <Text style={styles.btntxt}>
            {t('We provide you the instant delivery !')}
          </Text>
        </LinearGradient>
        {/* <Image
          source={require('../../Assets/Images/carosal.png')}
          style={styles.caroimg}
        /> */}
        <View style={{ marginVertical: 20 }}>
          <SwiperFlatList
            autoplay
            autoplayDelay={2}
            autoplayLoop
            // index={2}
            // showPagination
            // paginationActiveColor="red"
            data={carosalimg || []}
            // renderItem={({item}) => (
            //   <View style={[styles.child, {backgroundColor: item}]}>
            //     <Text style={styles.text}>{item}</Text>
            //   </View>
            // )}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={{ width: width, alignItems: 'center', }}
                onPress={() => { item.product_id && navigate('Preview', item.product_id) }}>
                <Image
                  source={{ uri: `${item.image}` }}
                  // source={item.images}
                  style={{
                    height: 180,
                    width: width2,
                    borderRadius: 20,
                    // marginLeft:-10,
                    // backgroundColor: 'red',
                    alignSelf: 'center'
                  }}
                  resizeMode="stretch"
                  key={index}
                />
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={styles.covline}>
          <Text style={styles.categorytxt}>{t('Top Selling Items')}</Text>
          <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => navigate('Products', { name: 'Top Selling Items', type: 'topselling' })}>
            <Text style={styles.seealltxt}>{t('See all')}</Text>
            <RightarrowIcon
              height={16}
              width={16}
              style={{ alignSelf: 'center' }}
              color={Constants.pink}
            />
          </TouchableOpacity>
        </View>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
          {topsellinglist && topsellinglist.length > 0 && topsellinglist.map((item, i) => (
            <View style={[styles.shadowWrapper,{ marginRight: topsellinglist.length === i + 1 ? 20 : 10 }]} key={i}>
            <TouchableOpacity
              style={[styles.box, ]}
              
              onPress={() => navigate('Preview', item._id)}
            >
              {/* <ImageBackground source={require('../../Assets/Images/start.png')} style={styles.star}></ImageBackground> */}
              <Image
                // source={require('../../Assets/Images/salt.png')}
                source={{ uri: item.varients[0].image[0] }}
                style={styles.cardimg}
                resizeMode='stretch'
              />
              {item?.price_slot && item?.price_slot?.length > 0 && (
                <ImageBackground
                  source={require('../../Assets/Images/star1.png')}
                  style={styles.cardimg2}>
                  <Text style={styles.offtxt}>{(((item?.price_slot[0]?.other_price - item?.price_slot[0]?.our_price) / item?.price_slot[0]?.other_price) * 100).toFixed(0)}%</Text>
                  <Text style={styles.offtxt}>{t('off')}</Text>
                </ImageBackground>
              )}
              <Text style={styles.proname}>{item.name}</Text>
              {/* <Text style={styles.weight}>500g</Text> */}
              <View style={{ flexDirection: 'row', flex: 1, marginHorizontal: 15,marginBottom:10,marginTop:5 }}>
                <View style={{ flex: 1 }}>
                  {item?.price_slot && item?.price_slot?.length > 0 && <Text style={styles.maintxt}>{Currency}{item?.price_slot[0]?.other_price}</Text>}
                  {item?.price_slot && item?.price_slot?.length > 0 && <Text style={styles.disctxt}>{Currency}{item?.price_slot[0]?.our_price}</Text>}
                </View>
                <TouchableOpacity style={styles.pluscov} onPress={() => cartdata(item)}>
                  <PlusIcon height={25} width={25} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        <View style={styles.covline}>
          <Text style={styles.categorytxt}>{t('Explore By Categories')}</Text>
          <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => navigate('Categories')}>
            <Text style={styles.seealltxt}>{t('See all')}</Text>
            <RightarrowIcon
              height={16}
              width={16}
              style={{ alignSelf: 'center' }}
              color={Constants.pink}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          data={categorylist}
          scrollEnabled={false}
          numColumns={4}
          style={{ width: '100%', gap: 5, marginVertical: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ flex: 1, marginVertical: 10 }}
              onPress={() =>
                navigate('Products', { item: item._id, name: item.name })
              }>
              <View style={styles.categorycircle}>
                <Image
                  // source={item.img}
                  source={
                    item?.image
                      ? {
                        uri: `${item?.image}`,
                      }
                      : require('../../Assets/Images/veg.png')
                  }
                  style={styles.categoryimg}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.categorytxt2}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
        {/* <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          colors={['#D7176C', '#95267C']}
          style={styles.btn2}>
          <DiscountIcon />
          <Text style={styles.btntxt2}>
            Get 10% Off on adding items worth {Currency}999 to cart!
          </Text>
        </LinearGradient> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.white,
  },
  inpcov: {
    // borderWidth: 1,
    borderColor: Constants.customgrey,
    backgroundColor: Constants.white,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginHorizontal: 20,
  },
  input: {
    flex: 1,
    color: Constants.black,
    fontFamily: FONTS.Medium,
    fontSize: 16,
    textAlign: 'left',
    minHeight: 45,
    marginLeft:10
    // backgroundColor:Constants.red
  },
  btn: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn2: {
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 30,
    marginHorizontal: 10,
  },
  btntxt: {
    color: Constants.white,
    fontSize: 16,
    fontFamily: FONTS.Black,
    fontStyle: 'italic',
    fontWeight: '700',
  },
  btntxt2: {
    color: Constants.white,
    fontSize: 14,
    fontFamily: FONTS.Bold,
    marginLeft: 10,
  },
  caroimg: {
    width: '100%',
    // resizeMode:'contain',
    // backgroundColor:'red',
    marginVertical: 20,
  },
  // box: {
  //   width: 180,
  //   marginVertical: 20,
  //   paddingTop: 30,
  //   paddingBottom: 10,
  //   borderRadius: 20,
  //   marginHorizontal: 10,
  //   boxShadow: '0 0 6 0.5 grey',
  //   overflow: 'visible',
  //   zIndex: 10
  // },
  cardimg: {
    height: 110,
    width: '90%',
    resizeMode: 'contain',
    alignSelf: 'center',
    // backgroundColor:'red'
  },
  // cardimg2: {
  //   height: 65,
  //   width: 65,
  //   position: 'absolute',
  //   right: -14,
  //   top: -20,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   // zIndex: 10
  //   // backgroundColor:Constants.red
  // },
  shadowWrapper: {
  boxShadow: '0px 0px 6px 0.5px grey',
  borderRadius: 20,
  marginVertical: 20,
  marginHorizontal: 10,
  backgroundColor: '#fff', // necessary for iOS shadows
},
box: {
  width:170,
  paddingTop: 15,
  paddingBottom: 10,
  borderRadius: 20,
  overflow: 'visible', // still needed if your child extends outside
  backgroundColor: 'transparent', // make sure this doesn't override shadow
},
cardimg2: {
  height: 55,
  width: 55,
  position: 'absolute',
  right: -14,
  top: -20,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 999, // very high to force render on top
},

  seealltxt: {
    fontSize: 18,
    color: Constants.pink,
    fontFamily: FONTS.Bold,
    marginHorizontal: 10,
  },
  categorytxt: {
    fontSize: 18,
    color: Constants.black,
    fontFamily: FONTS.Bold,
  },
  disctxt: {
    fontSize: 14,
    color: Constants.linearcolor,
    fontFamily: FONTS.Bold,
  },
  maintxt: {
    fontSize: 16,
    color: Constants.black,
    fontFamily: FONTS.Medium,
    textDecorationLine: 'line-through',
  },
  covline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 10,
    // backgroundColor:Constants.red
  },
  proname: {
    fontSize: 16,
    color: Constants.black,
    fontFamily: FONTS.Bold,
    marginLeft: 20,
    marginTop: 10,
  },
  weight: {
    fontSize: 16,
    color: Constants.customgrey,
    fontFamily: FONTS.Regular,
    marginLeft: 20,
    marginTop: 10,
  },
  offtxt: {
    fontSize: 14,
    color: Constants.white,
    fontFamily: FONTS.Black,
    marginLeft: 7,
  },
  pluscov: {
    // backgroundColor:Constants.blue,
    width: 40,
    height: 40,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 0px 6px 0px grey',
    borderRadius: 10,
    // marginRight:20
  },
  star: {
    height: 30,
    width: 30,
    position: 'absolute',
  },
  categorycircle: {
    height: 70,
    width: 70,
    borderRadius: 10,
    backgroundColor: Constants.lightpink,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  categoryimg: {
    height: 65,
    width: 65,
    resizeMode: 'contain',
    borderRadius: 60,
  },
  categorytxt2: {
    fontSize: 14,
    color: Constants.black,
    fontFamily: FONTS.Regular,
    fontWeight: '500',
    textAlign: 'center',
    marginVertical: 5,
    // flex:1,
    // height:100,
    // width:'100%',
    // backgroundColor: Constants.lightblue,
  },
});
