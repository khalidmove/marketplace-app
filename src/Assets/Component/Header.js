import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  TextInput,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import {
  DownarrIcon,
  LocationIcon,
  ProfileIcon,
  SearchIcon,
} from '../../../Theme';
import Constants, { FONTS } from '../Helpers/constant';
import { goBack, navigate } from '../../../navigationRef';
import { GetApi } from '../Helpers/Service';
import { PERMISSIONS, request } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import GetCurrentAddressByLatLong from './GetCurrentAddressByLatLong';
import { AddressContext, UserContext } from '../../../App';

const Header = props => {
  const [location, setlocation] = useState(null);
  const [locationadd, setlocationadd] = useContext(AddressContext);
  const [user, setuser] = useContext(UserContext);

  return (
    <View style={{ backgroundColor: Constants.violet }}>
      <StatusBar barStyle={Platform.OS === 'android' ? "light-content" : "dark-light"} backgroundColor={Constants.violet} />
      <View style={styles.toppart}>
        <View style={styles.firstrow}>
          <TouchableOpacity
            style={{ flexDirection: 'row' }}
            onPress={() => navigate('Shipping')}>
            <LocationIcon height={25} width={25} />
            {user?.shipping_address?.address ? (
              <Text style={styles.locationtxt} numberOfLines={1}>
                {user?.shipping_address?.house_no},{' '}
                {user?.shipping_address?.address}
              </Text>
            ) : (
              <Text style={styles.locationtxt} numberOfLines={1}>
                {locationadd}
              </Text>
            )}
            <DownarrIcon height={15} width={15} style={{ alignSelf: 'center' }} />
          </TouchableOpacity>
          {user?.img ? (
            <TouchableOpacity onPress={() =>
              user.email ? navigate('Account') : navigate('Auth')
            }>
              <Image
                source={{
                  uri: `${user.img}`,
                }}
                style={styles.hi}
              />
            </TouchableOpacity>
          ) : (
            <ProfileIcon
              height={25}
              width={25}
              onPress={() =>
                user.email ? navigate('Account') : navigate('Auth')
              }
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  toppart: {
    backgroundColor: Constants.violet,
    paddingTop: 5,
    // paddingBottom: 20,
  },
  firstrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 10,
  },
  locationtxt: {
    color: Constants.white,
    fontSize: 16,
    fontFamily: FONTS.Bold,
    marginLeft: 10,
    marginRight: 5,
    width: '70%',
  },
  hi: {
    height: 28,
    width: 28,
    borderRadius: 15,
  },
});
