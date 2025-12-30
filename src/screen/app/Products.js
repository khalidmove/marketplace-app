import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Constants, {Currency, FONTS} from '../../Assets/Helpers/constant';
import {PlusIcon} from '../../../Theme';
import {CartContext, LoadContext, ToastContext} from '../../../App';
import {GetApi, Post} from '../../Assets/Helpers/Service';
import {navigate} from '../../../navigationRef';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../Assets/Component/Header';
import DriverHeader from '../../Assets/Component/DriverHeader';
import { useTranslation } from 'react-i18next';

const Products = props => {
  const {t} = useTranslation();
  const [cartdetail, setcartdetail] = useContext(CartContext);
  const [toast, setToast] = useContext(ToastContext);
  const [loading, setLoading] = useContext(LoadContext);
  const [productlist, setproductlist] = useState([]);
      const [page, setPage] = useState(1);
      const [curentData, setCurrentData] = useState([]);
  const [user, setuser] = useState();
  const IsFocused = useIsFocused();
  const data = props?.route?.params.item;
  const catname = props?.route?.params.name;
  const topsell = props?.route?.params.type;
  useEffect(() => {
    {
      data && getproduct(1);
    }
    {
      topsell==='topselling' && getTopSoldProduct(1);
    }
  }, []);

  
  useEffect(() => {
    if (IsFocused) {
      setInitialRoute()
    }
  }, [IsFocused]);

  const setInitialRoute = async () => {
    const user = await AsyncStorage.getItem('userDetail');
    setuser(JSON.parse(user));
  }

  const getproduct = (p) => {
    setPage(p)
    setLoading(true);
    GetApi(`getProductbycategory/${data}?page=${p}`, {}).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.status) {
          setCurrentData(res.data);
          if (p === 1) {
            setproductlist(res.data);
          } else {
            setproductlist([...productlist, ...res.data]);
          }
          
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

    const getTopSoldProduct = (p) => {
      setPage(p)
      setLoading(true);
      GetApi(`getTopSoldProduct?page=${p}`,).then(
        async res => {
          setLoading(false);
          console.log(res);
          if (res.status) {
            setCurrentData(res.data);
            if (p === 1) {
              setproductlist(res.data);
            } else {
              setproductlist([...productlist, ...res.data]);
            }
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

    // Clear old cart and add new item
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
  const fetchNextPage = () => {
    console.log('enter',curentData.length)
    if (curentData.length === 20) {
      console.log('enter1',topsell)
      if (topsell==='topselling') {
        console.log('enter2')
        getTopSoldProduct(page + 1);
      } else {
        getproduct(page + 1);
      }
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <DriverHeader item={t('Products')} showback={true} />
      <Text style={styles.headtxt}>{catname}</Text>
      <FlatList
        data={productlist}
        numColumns={2}
        style={{paddingRight:20,marginLeft:5,paddingTop:10}}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: Dimensions.get('window').height - 200,
            }}>
            <Text
              style={{
                color: Constants.black,
                fontSize: 20,
                fontFamily: FONTS.Medium,
              }}>
              {t('No Products')}
            </Text>
          </View>
        )}
        // style={{gap:'2%'}}
        renderItem={({item}, i) => (
          <View style={styles.shadowWrapper} key={i}>
          <TouchableOpacity style={styles.box} onPress={()=>navigate('Preview',item._id)}>
          {/* <ImageBackground source={require('../../Assets/Images/start.png')} style={styles.star}></ImageBackground> */}
          <Image
            // source={require('../../Assets/Images/salt.png')}
            source={{uri: item.varients[0].image[0]}}
            style={styles.cardimg}
            resizeMode='stretch'
          />
         {item?.price_slot&&item?.price_slot?.length>0 && <ImageBackground
            source={require('../../Assets/Images/star1.png')}
            style={styles.cardimg2}
          >
            <Text style={styles.offtxt}>{(((item?.price_slot[0]?.other_price-item?.price_slot[0]?.our_price)/item?.price_slot[0]?.other_price)*100).toFixed(0)}%</Text>
            <Text style={styles.offtxt}>{t('off')}</Text>
          </ImageBackground>}
          <Text style={styles.proname}>{item.name}</Text>
          {/* <Text style={styles.weight}>500g</Text> */}
          <View style={{flexDirection: 'row', flex: 1,  marginHorizontal: 15,marginBottom:10,marginTop:5 }}>
            <View style={{flex: 1}}>
              {item?.price_slot&&item?.price_slot?.length>0 &&<Text style={styles.maintxt}>{Currency}{item?.price_slot[0]?.other_price}</Text>}
              {item?.price_slot&&item?.price_slot?.length>0 &&<Text style={styles.disctxt}>{Currency}{item?.price_slot[0]?.our_price}</Text>}
            </View>
            <TouchableOpacity style={styles.pluscov} onPress={()=>cartdata(item)}>
              <PlusIcon height={25} width={25} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        </View>
        )}
        onEndReached={() => {
          if (productlist && productlist.length > 0) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.05}
      />
    </SafeAreaView>
  );
};

export default Products;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.white,
    // paddingBottom: 20,
  },
 
  headtxt: {
    color: Constants.black,
    // fontWeight: '700',
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
    fontFamily: FONTS.Bold,
    // marginVertical:10
  },
    shadowWrapper: {
  boxShadow: '0px 0px 6px 0.5px grey',
  borderRadius: 20,
  marginVertical: 10,
  marginHorizontal: 10,
  backgroundColor: '#fff', // necessary for iOS shadows
  width: '47%',
},
  box: {
    width: '100%',
    // flex:1,
    // height:250,
    // borderWidth: 1,
    // borderColor: Constants.customgrey2,
    marginVertical: 5,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 20,
    // marginHorizontal: 10,
    // width:'50%',
    // boxShadow:'3 2 2 0.5 grey',
    // boxShadow:'0 0 16 10 grey',
    // boxShadow:'rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px',
    // boxShadow: '0 0 6 0.5 grey',
    // boxShadow: 'inset 0 0 8 0.5 grey',
  },
  cardimg: {
    height: 110,
    width: '90%',
    resizeMode: 'stretch',
    alignSelf: 'center',
  },
  cardimg2: {
    height: 55,
    width: 55,
    position:'absolute',
    right:-14,
    top:-20,
    justifyContent:'center',
    alignItems:'center',
    // backgroundColor:Constants.red,
  },
  disctxt: {
    fontSize: 16,
    color: Constants.linearcolor,
    fontFamily: FONTS.Bold,
  },
  maintxt: {
    fontSize: 14,
    color: Constants.black,
    fontFamily: FONTS.Medium,
    textDecorationLine: 'line-through',
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
    marginLeft:7
  },
  pluscov: {
    // backgroundColor:Constants.blue,
    height: 40,
    alignSelf:'flex-end',
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 0px 6px 0px grey',
    borderRadius: 10,
    // marginRight:20
  },
 
});
