import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { createRef, useContext, useEffect, useRef, useState } from 'react';
import Constants, { Currency, FONTS } from '../../Assets/Helpers/constant';
import { BackIcon, CrossIcon, PlusIcon, SearchIcon, SortIcon } from '../../../Theme';
import {
  CartContext,
  LoadContext,
  ToastContext,
  UserContext,
} from '../../../App';
import { GetApi, Post } from '../../Assets/Helpers/Service';
import { goBack, navigate } from '../../../navigationRef';
// import RenderHtml from 'react-native-render-html';
import ActionSheet from 'react-native-actions-sheet';
import { RadioButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

const Searchpage = () => {
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const [toast, setToast] = useContext(ToastContext);
  const [loading, setLoading] = useContext(LoadContext);
  const [user, setuser] = useContext(UserContext);
  const [cartdetail, setcartdetail] = useContext(CartContext);
  const [productlist, setproductlist] = useState([]);
  const [searchkey, setsearchkey] = useState('');
  const [jobtype, setjobtype] = useState('');
  const [page, setPage] = useState(1);
  const [curentData, setCurrentData] = useState([]);
  const sortRef = createRef();

  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 200);
  }, []);

  const getsearchproducts = (p, text, sort) => {
    setPage(p);
    // setLoading(true);
    console.log(p)
    GetApi(`productSearch?page=${p}&key=${text}`).then(
      async res => {
        // setLoading(false);
        console.log(res);
        // setproductlist(res);
        setCurrentData(res.data);
        if (p === 1) {
          setproductlist(res.data);
        } else {
          setproductlist([...productlist, ...res.data]);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const cartdata = async (productdata) => {

    // let data = {
    //   productid: productdata._id,
    //   productname: productdata.name,
    //   price: productdata?.price_slot[0]?.other_price,
    //   offer: productdata?.price_slot[0]?.our_price,
    //   image:productdata.varients[0].image[0],
    //   price_slot:productdata?.price_slot[0],
    //   qty: 1,
    //   seller_id:productdata.userid
    // };
    // console.log('data', data);
    // if (cartdetail) {
    //   let alreadyexsit =
    //     cartdetail &&
    //     cartdetail.length > 0 &&
    //     cartdetail.filter(it => it.productid === data.productid).length > 0;
    //   let stringdata;
    //   if (alreadyexsit) {
    //     stringdata = cartdetail.map(_i => {
    //       if (_i?.productid == data.productid) {
    //         return {..._i, qty: _i?.qty + 1};
    //       } else {
    //         return _i;
    //       }
    //     });
    //   } else {
    //     stringdata = [...cartdetail, data];

    //   }
    //   console.log('stringdata', stringdata);
    //   setcartdetail(stringdata);
    //   await AsyncStorage.setItem('cartdata', JSON.stringify(stringdata));
    // } else {
    //   let stringdata = [data];

    //   console.log('stringdata', stringdata);
    //   setcartdetail(stringdata);
    //   await AsyncStorage.setItem('cartdata', JSON.stringify(stringdata));
    // }
    const existingCart = Array.isArray(cartdetail)
      ? cartdetail
      : [];

    // Check if the exact product with selected price_slot exists
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
        seller_id: productdata.userid
      };

      const updatedCart = [...existingCart, newProduct];
      setcartdetail(updatedCart);
      await AsyncStorage.setItem('cartdata', JSON.stringify(updatedCart))
      console.log("Product added to cart:", newProduct);
    } else {
      console.log(
        "Product already in cart with this price slot:",
        existingProduct
      );
      let stringdata = cartdetail.map(_i => {
        if (_i?.productid == productdata._id) {
          console.log('enter')
          return { ..._i, qty: _i?.qty + 1 };
        } else {
          return _i;
        }
      });
      console.log(stringdata)
      setcartdetail(stringdata);
      await AsyncStorage.setItem('cartdata', JSON.stringify(stringdata))
    }
    setToast("Successfully added to cart.")
    // navigate('Cart');
  };


  const mixedStyle = {
    body: {
      whiteSpace: 'normal',
      color: '#000000',
      fontSize: '14px',
      fontWeight: 'bold'
    },
    p: {
      color: '#000000',
      fontSize: '14px',
      fontWeight: 'bold',
      whiteSpace: 'normal',
      fontFamily: FONTS.Bold
    }
  }
  const fetchNextPage = () => {
    if (curentData.length === 20) {
      // if (jobtype) {
      //   getsearchproducts(page + 1, searchkey,jobtype);
      // } else {
      getsearchproducts(page + 1, searchkey);
      // }
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchcov}>
        <BackIcon
          color={Constants.white}
          width={30}
          height={20}
          style={{ alignSelf: 'center' }}
          onPress={() => goBack()}
        />
        <View style={[styles.inpcov]}>
          <SearchIcon height={20} width={20} />
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder={t("What are u looking for ?")}
            placeholderTextColor={Constants.light_black}
            onChangeText={name => { getsearchproducts(1, name), setsearchkey(name) }}></TextInput>
        </View>
        {/* <SortIcon
                  height={30}
                  width={30}
                  onPress={() => sortRef.current.show()}
                  style={{alignSelf:'center'}}
                  color={Constants.white}
                /> */}
      </View>
      {/* <View style={{paddingHorizontal: 15, flex: 1}}> */}
      <FlatList
        data={productlist}
        numColumns={2}
        style={{ paddingRight: 20, marginLeft: 5, paddingTop: 10, flex: 1 }}
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
        renderItem={({ item }, i) => (
           <View style={styles.shadowWrapper} key={i}>
          <TouchableOpacity style={styles.box} onPress={() => navigate('Preview', item._id)}>
            {/* <ImageBackground source={require('../../Assets/Images/start.png')} style={styles.star}></ImageBackground> */}
            <Image
              // source={require('../../Assets/Images/salt.png')}
              source={{ uri: item.varients[0].image[0] }}
              style={styles.cardimg}
              resizeMode='stretch'
            />
            {item?.price_slot && item?.price_slot?.length > 0 && <ImageBackground
              source={require('../../Assets/Images/star1.png')}
              style={styles.cardimg2}
            >
              <Text style={styles.offtxt}>{(((item?.price_slot[0]?.other_price - item?.price_slot[0]?.our_price) / item?.price_slot[0]?.other_price) * 100).toFixed(0)}%</Text>
              <Text style={styles.offtxt}>{t('off')}</Text>
            </ImageBackground>}
            <Text style={styles.proname}>{item.name}</Text>
            {/* <Text style={styles.weight}>500g</Text> */}
            <View style={{ flexDirection: 'row', flex: 1, marginHorizontal: 15,marginBottom:10,marginTop:5  }}>
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
        )}
        onEndReached={() => {
          if (productlist && productlist.length > 0) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.05}
      />
      {/* </View> */}
      {/* <ActionSheet
        ref={sortRef}
        closeOnTouchBackdrop={true}
      >
        <View style={{margin: 10}}>
          <View
            style={{
              flexDirection: 'row',
              margin: 10,
              justifyContent: 'space-between',
            }}>
            <Text style={styles.toptxt}>Sort by</Text>
            <CrossIcon
              height={15}
              width={15}
              style={{alignSelf: 'center'}}
              onPress={() => sortRef.current.hide()}
            />
          </View>
          <RadioButton.Group
            onValueChange={type => {
              setjobtype(type);
              getsearchproducts(1,searchkey,type);
              sortRef.current.hide();
            }}
            value={jobtype}>
            <View style={{}}>
            
              <RadioButton.Item
                mode="android"
                // style={{fontSize: 12}}
                label="Price -- Low to High" //Individual
                value="price_asc"
                position="trailing"
                color={Constants.custom_green}
                uncheckedColor={Constants.black}
                labelStyle={{
                  color:
                    jobtype === 'price'
                      ? Constants.custom_green
                      : Constants.black,
                  fontSize: 16,
                  fontWeight: '700',
                }}
              />
              <RadioButton.Item
                mode="android"
                // style={{fontSize: 12}}
                label="Price -- High to Low" //Individual
                value="price_desc"
                position="trailing"
                color={Constants.custom_green}
                uncheckedColor={Constants.black}
                labelStyle={{
                  color:
                    jobtype === 'price'
                      ? Constants.custom_green
                      : Constants.black,
                  fontSize: 16,
                  fontWeight: '700',
                }}
              />
             
            </View>
          </RadioButton.Group>
        </View>
      </ActionSheet> */}
    </SafeAreaView>
  );
};

export default Searchpage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.white,
    // padding: 20,
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
    flex: 1,
  },
  input: {
    flex: 1,
    color: Constants.black,
    fontFamily: FONTS.Regular,
    fontSize: 16,
    marginLeft: 10,
    textAlign: 'left',
    minHeight: 45
    // backgroundColor:Constants.red
  },
  searchcov: {
    backgroundColor: Constants.violet,
    padding: 20,
    flexDirection: 'row',
  },
 shadowWrapper: {
  boxShadow: '0 0 6 0.5 grey',
  borderRadius: 20,
  marginVertical: 10,
  marginHorizontal: 10,
  backgroundColor: '#fff', // necessary for iOS shadows
  width: '46%',
},
  box: {
    width: '100%',
    // flex:1,
    // height:250,
    // borderWidth: 1,
    // borderColor: Constants.customgrey2,
    marginVertical: 5,
    paddingTop: 10,
    paddingBottom: 0,
    borderRadius: 20,
    // backgroundColor:'red'
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
    position: 'absolute',
    right: -14,
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:Constants.red,
  },
  disctxt: {
    fontSize: 18,
    color: Constants.linearcolor,
    fontFamily: FONTS.Bold,
  },
  maintxt: {
    fontSize: 17,
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
  offtxt: {
    fontSize: 14,
    color: Constants.white,
    fontFamily: FONTS.Black,
    marginLeft: 7
  },
  pluscov: {
    // backgroundColor:Constants.blue,
    width: 40,
    height: 40,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 0 6 0 grey',
    borderRadius: 10,
    // marginRight:20
  },
});
