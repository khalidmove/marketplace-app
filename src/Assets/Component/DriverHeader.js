import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Constants, { FONTS } from '../Helpers/constant';
import { goBack, navigate, reset } from '../../../navigationRef';
import { GetApi } from '../Helpers/Service';
import { UserContext } from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackIcon } from '../../../Theme';

const DriverHeader = props => {
  const [loading, setLoading] = useState(false);
  const [user, setuser] = useContext(UserContext);
  const [userDetail, setUserDetail] = useState({
    email: '',
    username: '',
    number: '',
    img: '',
  });

  return (
    <View style={styles.toppart}>
      <StatusBar barStyle={Platform.OS === 'android' ? "light-content" : "dark-light"} backgroundColor={Constants.violet} />
      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          height: '100%',
          alignItems: 'center',
        }}>
        {props.showback ? (
          <TouchableOpacity
            onPress={() => goBack()}
            style={{ width: 20, height: 20, marginRight: 5,justifyContent:'center' }}>
            <BackIcon color={Constants.white} height={15} width={15} style={{alignSelf:'center'}}/>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() =>
              user.type === 'DRIVER'
                ? navigate('DriverAccount')
                : user.type === 'SELLER'
                  ? navigate('VendorAccount')
                  : user.type === 'USER'
                    ? navigate('Account')
                    : navigate('Auth')
            }>
            <Image
              // source={require('../Images/profile.png')}
              source={
                user?.img
                  ? {
                    uri: `${user.img}`,
                  }
                  : require('../../Assets/Images/profile2.png')
              }
              style={styles.hi}
            />
          </TouchableOpacity>
        )}
        <Text style={styles.backtxt}>{props?.item}</Text>
      </View>
    </View>
  );
};

export default DriverHeader;

const styles = StyleSheet.create({
  backtxt: {
    color: Constants.white,
    fontWeight: '600',
    fontSize: 16,
    fontFamily: FONTS.dmsansedium,
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
});
