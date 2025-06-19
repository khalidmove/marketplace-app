import { Dimensions, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import DriverHeader from '../../Assets/Component/DriverHeader';
import Constants, { Currency, FONTS } from '../../Assets/Helpers/constant';
import { navigate } from '../../../navigationRef';
import { useIsFocused } from '@react-navigation/native';
import { LoadContext, ToastContext } from '../../../App';
import { GetApi, Post } from '../../Assets/Helpers/Service';
import moment from 'moment';
import { StatusIcon, ThreedotIcon, ViewIcon } from '../../../Theme';
import { useTranslation } from 'react-i18next';
import LabelWithColon from '../../Assets/Helpers/LabelWithColon';
import EmployeeHeader from '../../Assets/Component/EmployeeHeader';

const History = () => {
  const {t} = useTranslation();
  const dumydata = [1, 2, 3, 4, 5];
  const IsFocused = useIsFocused();
  const [toast, setToast] = useContext(ToastContext);
  const [loading, setLoading] = useContext(LoadContext);
  const [productlist, setproductlist] = useState([]);
  const [currentTab, setCurrentTab] = useState('pending')
  const [modalVisible, setModalVisible] = useState(false);
  const [assignmodel, setassignmodel] = useState(false);
  const [orderid, setorderid] = useState('');
  const [curentData, setCurrentData] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (IsFocused) {
      setproductlist([])
      getProducts(1);

    }
  }, [IsFocused]);

  const getProducts = (tab,p) => {
    setPage(p);
    setLoading(true);
    setCurrentTab(tab)
    Post(`getOrderHistoryByEmployee?page=${p}`, {}).then(
      async res => {
        setLoading(false);
        console.log(res);
setCurrentData(res?.data)
        if (p === 1) {
        setproductlist(res?.data);
        } else {
          setproductlist([...productlist, ...res?.data]);
        }
      },
      err => {
        setLoading(false);
        setproductlist([])
        console.log('errrrrrr===>',err);
      },
    );
  };

  const assigdriver = id => {
    const body={
      id:id,
      status:'Driverassigned'
    }
    setLoading(true);
    Post(`changeorderstatus`, body).then(
      async res => {
        setLoading(false);
        console.log(res);
        getProducts('pending');
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const fetchNextPage = () => {
    if (curentData.length === 20) {
      getorders(page + 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <EmployeeHeader item={t('History')} />
      
      {/* <View style={{marginBottom:200,}}> */}
      <FlatList
        data={productlist}
        style={{marginBottom:70}}
        showsVerticalScrollIndicator={false}
        renderItem={({ item },index) => (
          <View key={index}>
                <TouchableOpacity
                  style={[
                    styles.box,
                  ]}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <Image
                        // source={require('../../Assets/Images/profile.png')}
                        source={
                          item?.user?.img
                            ? {
                                uri: `${item?.user?.img}`,
                              }
                            : require('../../Assets/Images/profile.png')
                        }
                        style={styles.hi}
                        // onPress={()=>navigate('Account')}
                      />
                      <View>
                        <Text style={styles.name}>{item?.user?.username}</Text>
                        <Text style={styles.redeembtn}>
                          {moment(item?.createdAt).format('DD-MM-YYYY ')}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        setModalVisible(item._id), console.log(item._id);
                      }}
                      style={{height: 30, width: 30, alignItems: 'flex-end'}}>
                      <ThreedotIcon />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.secendpart}>
                  <LabelWithColon labelKey="Location" textStyle={styles.secendboldtxt}/>
                    <Text style={styles.secendtxt2}>{item?.shipping_address
?.address}</Text>
                  </View>

                  <View style={styles.txtcol}>
                    <View style={{}}>
                      <View style={styles.secendpart}>
                      <LabelWithColon labelKey="Qty" textStyle={styles.secendboldtxt}/>
                        <Text style={styles.secendtxt}>
                          {item?.productDetail?.length}
                        </Text>
                      </View>
                      
                      {/* <View style={styles.statuscov}>
                        {item?.status === 'Driverassigned' ? (
                          <Text style={styles.status}>Driver Assigned</Text>
                        ) : (
                          <Text></Text>
                        )}
                      </View> */}
                    </View>
                        <Text style={styles.amount}>{Currency}{item?.total}</Text>
                  </View>
                </TouchableOpacity>

                {modalVisible === item._id && (
                  <TouchableOpacity
                    style={styles.backdrop}
                    onPress={() => setModalVisible(null)}>
                    <View style={styles.centeredView}>
                      <View style={styles.modalView}>
                         
                        <TouchableOpacity
                          // style={styles.popuplistcov}
                          onPress={() => {
                            navigate('EmployeeOrderStatus', item),
                              setModalVisible(null);
                          }}>
                          <View style={styles.popuplistcov2}>
                            <StatusIcon />
                            <Text style={styles.popuptxt}>{t('Status')}</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
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
        onEndReached={() => {
          if (productlist && productlist.length > 0) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.05}
      />
      {/* </View> */}
      <Modal
        animationType="none"
        transparent={true}
        visible={assignmodel}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setassignmodel(!assignmodel);
        }}>
        <View style={styles.centeredView2}>
          <View style={styles.modalView2}>
            {/* <Text style={styles.alrt}>Alert !</Text> */}
            <View
              style={{
                backgroundColor: 'white',
                alignItems: 'center',
                paddingHorizontal: 30,
              }}>
              <Text style={styles.textStyle}>
                {t('Are you sure you want to assign driver !')}
              </Text>
              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setassignmodel(!assignmodel)}
                  style={styles.cancelButtonStyle}>
                  <Text
                    style={[
                      styles.modalText,
                      {color: Constants.violet},
                    ]}>
                    {t('No')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.logOutButtonStyle}
                  onPress={() => {
                    assigdriver(orderid), setassignmodel(false);
                  }}>
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

export default History;

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
    minWidth: 150,
    alignItems: 'center',
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
  popuptxt: {
    fontSize: 16,
    fontFamily: FONTS.Regular,
    color: Constants.black,
    paddingRight: 5,
  },

  /////model///
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
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
    // position: 'relative',
  },

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
  ////////end////////
  status: {
    color: Constants.violet,
    fontSize: 18,
    fontFamily: FONTS.Bold,
    // alignSelf: 'flex-end',
  },
  statuscov: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  modalText:{
    color:Constants.white,
    fontSize:16,
    fontFamily:FONTS.Bold
  }
});
