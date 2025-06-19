import { Dimensions, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import DriverHeader from '../../Assets/Component/DriverHeader';
import Constants, { Currency, FONTS } from '../../Assets/Helpers/constant';
import { navigate } from '../../../navigationRef';
import { useIsFocused } from '@react-navigation/native';
import { LoadContext, ToastContext } from '../../../App';
import { GetApi, Post } from '../../Assets/Helpers/Service';
import moment from 'moment';
import CuurentLocation from '../../Assets/Component/CuurentLocation';
import { DeleteIcon, StatusIcon, ThreedotIcon, ViewIcon } from '../../../Theme';
import { useTranslation } from 'react-i18next';
import LabelWithColon from '../../Assets/Helpers/LabelWithColon';

const Work = () => {
  const {t} = useTranslation();
  const dumydata = [1, 2, 3, 4, 5];
  const IsFocused = useIsFocused();
  const [toast, setToast] = useContext(ToastContext);
  const [loading, setLoading] = useContext(LoadContext);
  const [productlist, setproductlist] = useState([]);
  const [currentTab, setCurrentTab] = useState('pending')
  const [acceptmodel, setacceptmodel] = useState(false);
  const [modalVisible, setModalVisible] = useState(null);
  const [orderid, setorderid] = useState('');


  useEffect(() => {
    if (IsFocused) {
      setproductlist([])
      nearbylocation();
      setCurrentTab('pending')
    }
  }, [IsFocused]);

const nearbylocation = () => {
  CuurentLocation(res => {
    //   const data = {
    //     track: {
    //       type: 'Point',
    //       coordinates: [res.coords.longitude, res.coords.latitude],
    //     },

    //   }
    // console.log('longitude===>', location.longitude);
    const data2 = {
      location: [Number(res.coords.longitude), Number(res.coords.latitude)]
    };
    // const data2 = {
    //   location: [87.56486769765615, 22.471533774911393],
    //   categoryId:data
    // };
    console.log('data==========>', data2);
    setLoading(true);
    Post('nearbyorderfordriver', data2, {}).then(
      async res => {
        setLoading(false);
        console.log('$%#@^&**', res);
        setproductlist(res?.data);
      },
      err => {
        setLoading(false);
        setproductlist([])
        console.log(err);
      },
    );
  });
};
const acceptedorderfordriver = () => {
    setLoading(true);
    GetApi('acceptedorderfordriver', {}).then(
      async res => {
        setLoading(false);
        console.log('$%#@^&**', res);
        setproductlist(res?.data);
      },
      err => {
        setLoading(false);
        setproductlist([])
        console.log(err);
      },
    );
};


  const Acceptorder = (id) => {
    setLoading(true);
    Post(`acceptorderdriver/${id}`, {}).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res?.status) {
          nearbylocation()
          
        } else {
          if (res?.message) {
            setToast(res?.message)
          }
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <DriverHeader item={t('My orders')} />
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          style={{
            flex: 1,
            borderBottomColor: currentTab === 'pending' ? Constants.violet : 'lightgray',
            borderBottomWidth: currentTab === 'pending' ? 5 : 2,
            height: 50,
            backgroundColor: currentTab === 'pending' ? 'white' : Constants.lightgrey,
            justifyContent: 'center'
          }}
          onPress={() => { setproductlist([]); setCurrentTab('pending'),nearbylocation() }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 20,
              fontWeight: '700',
              color: currentTab === 'pending' ? Constants.violet : 'black'
            }}
          >{t('Pending')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
          flex: 1,
          borderBottomColor: currentTab === 'ongoing' ? Constants.violet : 'lightgray',
          borderBottomWidth: currentTab === 'ongoing' ? 5 : 2,
          height: 50,
          backgroundColor: currentTab === 'ongoing' ? 'white' : Constants.lightgrey,
          justifyContent: 'center'
        }}
          onPress={() => { setproductlist([]); setCurrentTab('ongoing'),acceptedorderfordriver() }}>
          <Text style={{
            textAlign: 'center',
            fontSize: 20,
            fontWeight: '700',
            color: currentTab === 'ongoing' ? Constants.violet : 'black'
          }}>{t('Ongoing')}</Text>
        </TouchableOpacity>
      </View>
      {/* <View style={{marginBottom:200,}}> */}
      <FlatList
        data={productlist}
        style={{marginBottom:70}}
        renderItem={({ item }) => (
          <View>
          <TouchableOpacity
            style={styles.box}
            onPress={() => navigate('Map', {
              orderid: item._id,
              type: item.status==='Collected'?'client':'shop',
            })}
          >
            <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
            <View style={{ flexDirection: 'row' }}>
              <Image
                source={
                  item?.user?.image
                    ? {
                      uri: `${item.user?.image}`,
                    }
                    : require('../../Assets/Images/profile.png')
                }
                style={styles.hi}
              // onPress={()=>navigate('Account')}
              />
              <View>
                <Text style={styles.name}>{item.user.username}</Text>
                <Text style={styles.redeembtn}>{moment(item?.createdAt).format('DD-MM-YYYY hh:mm A')}</Text>
              </View>
                  </View>
              <TouchableOpacity
                    onPress={() => {setModalVisible(item._id),console.log(item.index)}}
                    style={{height:30,width:30,alignItems:'flex-end'}}>
                    <ThreedotIcon />
                  </TouchableOpacity>
            </View>
             <View style={{flexDirection:'row',alignItems:'center',gap:10}}>
            <Text style={styles.timeslotxt}>
                      {item?.timeslot}
                    </Text>
                    <Text textStyle={styles.secendboldtxt}>{item?.orderId}</Text>
                    </View>
            <View style={styles.secendpart}>
              
              <LabelWithColon labelKey="Location" textStyle={styles.secendboldtxt}/>
              <Text style={styles.secendtxt2}>
                {item.shipping_address.address}
              </Text>
            </View>
            <View style={styles.txtcol}>
              <View style={{}}>
                
                <View style={styles.secendpart}>
                  
                  <LabelWithColon labelKey="Qty" textStyle={styles.secendboldtxt}/>
                  <Text style={styles.secendtxt}>{item?.productDetail.length}</Text>
                </View>
              </View>
              <Text style={styles.amount}>{Currency}{item?.finalAmount}</Text>
            </View>
            {!item?.driver_id&&<TouchableOpacity style={styles.acceptButtonStyle} onPress={()=>{setacceptmodel(true),setorderid(item?._id)}}>
                    <Text style={styles.modalText}>{t('Accept')}</Text>
                  </TouchableOpacity>}
          </TouchableOpacity>
          {modalVisible === item._id && (
                  <TouchableOpacity
                    style={styles.backdrop}
                    onPress={() => setModalVisible(null)}>
                    <View style={styles.centeredView}>
                      <View style={styles.modalView}>
                        <TouchableOpacity
                          style={styles.popuplistcov}
                          onPress={() => {
                            navigate('DriverOrder', item._id),
                              setModalVisible(null);
                          }}>
                          <View style={styles.popuplistcov2}>
                            <ViewIcon />
                            <Text>{t('View Order Details')}</Text>
                          </View>
                        </TouchableOpacity>
                        {item?.status != 'Collected' && (
                          <TouchableOpacity
                            style={styles.popuplistcov}
                            onPress={() => {
                              navigate('Map', {
                                orderid: item._id,
                                type: 'shop',
                              }),
                                setModalVisible(null);
                            }}>
                            <View style={styles.popuplistcov2}>
                              <StatusIcon />
                              <Text>{t('Shop location')}</Text>
                            </View>
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity
                          style={styles.popuplistcov}
                          onPress={() => {
                            navigate('Map', {
                              orderid: item._id,
                              type: 'client',
                            }),
                              setModalVisible(null);
                          }}>
                          <View style={styles.popuplistcov2}>
                            <StatusIcon />
                            <Text>{t('Client location')}</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View></View>
                  </TouchableOpacity>
                )}
          </View>
        )}
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
                fontFamily: FONTS.Bold,
              }}>
              {t('No Order Available')}
            </Text>
          </View>
        )}
      />
      {/* </View> */}
      <Modal
          animationType="none"
          transparent={true}
          visible={acceptmodel}
          onRequestClose={() => {
            // Alert.alert('Modal has been closed.');
            setacceptmodel(!acceptmodel);
          }}>
          <View style={styles.centeredView2}>
            <View style={styles.modalView2}>
              <Text style={styles.alrt}>{t('Alert !')}</Text>
              <View
                style={{
                  backgroundColor: 'white',
                  alignItems: 'center',
                  paddingHorizontal: 30,
                }}>
                <Text style={styles.textStyle}>
                  {('Are you sure you want to Accept this ride to delivery !')}
                </Text>
                <View style={styles.cancelAndLogoutButtonWrapStyle}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => setacceptmodel(!acceptmodel)}
                    style={styles.cancelButtonStyle}>
                    <Text
                      style={[styles.modalText, {color: Constants.custom_yellow}]}>
                      {t('No')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.logOutButtonStyle} onPress={()=>{Acceptorder(orderid),setacceptmodel(false)}}>
                    <Text style={styles.modalText}>{t('Yes')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
    </SafeAreaView>
  );
};

export default Work;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.lightgrey,
  },
  box: {
    backgroundColor: Constants.white,
    marginVertical: 10,
    padding: 20,
  },
  hi: {
    marginRight: 10,
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  redeembtn: {
    color: Constants.white,
    fontSize: 16,
    fontFamily: FONTS.Medium,
    backgroundColor: Constants.violet,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 7,
    borderRadius: 8,
  },
  name: {
    color: Constants.black,
    fontFamily: FONTS.Bold,
    fontSize: 14,
  },
  secendpart: {
    flexDirection: 'row',
    // flex: 1,
    // justifyContent: 'space-between',
    marginLeft: 10,
    marginVertical: 5,
  },
  secendboldtxt: {
    color: Constants.black,
    fontSize: 15,
    fontFamily: FONTS.Bold,
    alignSelf: 'center',
  },
  secendtxt: {
    color: Constants.black,
    fontSize: 15,
    textAlign: 'left',
  },
  secendtxt2: {
    color: Constants.black,
    fontSize: 15,
    textAlign: 'left',
    flex: 1,
  },
  txtcol: {
    flexDirection: 'row',
    justifyContent: 'space-between'
    // flex: 1,
  },
  amount: {
    color: Constants.violet,
    fontSize: 18,
    fontFamily: FONTS.Bold,
    alignSelf: 'flex-end'
  },
  cancelAndLogoutButtonWrapStyle2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 3,
  },
  cancelButtonStyle: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginRight: 10,
    borderColor: Constants.violet,
    borderWidth: 1,
    borderRadius: 10,
  },
  logOutButtonStyle: {
    flex: 0.5,
    backgroundColor: Constants.violet,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  //////Model////////

  textStyle: {
    color: Constants.black,
    // fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: FONTS.Medium,
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
  alrt: {
    color: Constants.black,
    fontSize: 18,
    fontFamily: FONTS.Bold,
    // backgroundColor: 'red',
    width: '100%',
    textAlign: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: Constants.customgrey2,
    paddingBottom: 20,
  },
  modalText: {
    color: Constants.white,
    // fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: FONTS.Bold,
    fontSize: 14,
  },
  acceptButtonStyle: {
    flex: 1,
    backgroundColor: Constants.violet,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  ////model
  centeredView2: {
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
    paddingVertical: 20,
    alignItems: 'center',
    width: '90%',
  },
  ///////Pop up model////
  centeredView: {
    position: 'absolute',
    right: 20,
    top: 60,
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    // margin: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    // paddingVertical: 20,
    // alignItems: 'center',
    boxShadow: '0 0 8 0.05 grey',
    // paddingHorizontal:10
  },
  popuplistcov: {
    // marginVertical:10,
    borderBottomWidth: 1,
    borderColor: Constants.customgrey,
  },
  popuplistcov2: {
    flexDirection: 'row',
    gap: 10,
    margin: 10,
    // borderBottomWidth:1,
    // borderColor:Constants.customgrey
  },
  backdrop: {
    // flex:1,
    // backgroundColor:Constants.red,
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
  },
  timeslotxt: {
    color: Constants.violet,
    fontSize: 16,
    fontFamily: FONTS.Medium,
    borderWidth:1,
    borderColor:Constants.violet,
    borderRadius:5,
    width:'50%',
    textAlign:'center',
    marginVertical:5
    // alignSelf:'center'
  },
});
