import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Constants, { FONTS } from '../Helpers/constant';
import { goBack, navigate, reset } from '../../../navigationRef';
import { GetApi } from '../Helpers/Service';
import { UserContext } from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackIcon, SignoutIcon } from '../../../Theme';
import { useTranslation } from 'react-i18next';

const EmployeeHeader = props => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [user, setuser] = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [userDetail, setUserDetail] = useState({
    email: '',
    username: '',
    number: '',
    img: '',
  });

  return (
    <>
      <View style={styles.toppart}>
        <StatusBar barStyle="light-content" backgroundColor={Constants.violet} />
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            height: '100%',
            alignItems: 'center',
            justifyContent: "space-between",
            //   backgroundColor:'red',
            width: '100%'
          }}>
          <View style={{ flexDirection: 'row', gap: 5 }}>
            {props.showback &&
              <TouchableOpacity
                onPress={() => goBack()}
                style={{ width: 20, height: 20, marginRight: 5, justifyContent: 'center' }}>
                <BackIcon color={Constants.white} height={15} width={15} style={{ alignSelf: 'center' }} />
              </TouchableOpacity>}
            <Text style={styles.backtxt}>{props?.item}</Text>
          </View>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{ width: 20, height: 20, marginRight: 10 }}>
            <SignoutIcon color={Constants.white} />
          </TouchableOpacity>
        </View>
      </View>
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
            <View style={{ backgroundColor: 'white', alignItems: 'center' }}>
              <Text style={styles.textStyle}>
                {t('Are you sure you want to sign out?')}
              </Text>
              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setModalVisible(!modalVisible)}
                  style={styles.cancelButtonStyle}>
                  <Text style={styles.modalText}>{t('Cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={async () => {
                    setModalVisible(!modalVisible);
                    await AsyncStorage.removeItem('userDetail');
                    reset('Auth');
                  }}
                  style={styles.logOutButtonStyle}>
                  <Text style={styles.modalText}>{t('Sign out')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default EmployeeHeader;

const styles = StyleSheet.create({
  backtxt: {
    color: Constants.white,
    fontWeight: '600',
    fontSize: 20,
    fontFamily: FONTS.Medium,
  },
  toppart: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Constants.violet,
  },
  hi: {
    marginRight: 10,
    height: 25,
    width: 25,
    borderRadius: 15,
  },
  aliself: {
    alignSelf: 'center',
    // fontWeight:'bold'
    // fontFamily:FONTS.Bold
  },
  /////////logout model //////
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
    backgroundColor: '#rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 17,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
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

  textStyle: {
    color: Constants.black,
    // fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: FONTS.Bold,
    fontSize: 16,
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
    gap: 3,
  },
  cancelButtonStyle: {
    flex: 0.5,
    backgroundColor: Constants.black,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginRight: 10,
  },
  logOutButtonStyle: {
    flex: 0.5,
    backgroundColor: Constants.red,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
});
