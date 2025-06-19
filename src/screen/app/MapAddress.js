import {
  Animated,
  Easing,
  ImageBackground,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {navigate} from '../../../navigationRef';
import MapView, {
  Marker,
  Polygon,
  Polyline,
  PROVIDER_GOOGLE,
  
} from 'react-native-maps';
import {
  request,
  PERMISSIONS,
  requestLocationAccuracy,
} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import GetCurrentAddressByLatLong from '../../Assets/Component/GetCurrentAddressByLatLong';
import Constants, { FONTS } from '../../Assets/Helpers/constant';
import { mapStyle } from './mapStyle';
import { useTranslation } from 'react-i18next';

console.log(mapStyle)


const MapAddress = (props) => {
  const {t} = useTranslation();
  const data=props?.route?.params
  console.log(data)
  const mapRef = useRef(null);
  const [location, setlocation] = useState({
    latitude: data.lat,
    longitude: data.long,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
    
  });
  const [locationadd, setlocationadd] = useState(null);



  
  const naviate = () => {
    navigate('Shipping', {location,type:'mapdata'});
  };


  return (
    <SafeAreaView style={[styles.container,{backgroundColor:Constants.white}]}>
      <View style={styles.container}>
       { <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          customMapStyle={mapStyle}
          region={location}
          showsUserLocation={true}
          onPress={(e)=>{
            
            setlocation({
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
              
            })
            // console.log('onclick==============>',e.nativeEvent.coordinate.latitude)
            // GetCurrentAddressByLatLong({
            //   lat: e.nativeEvent.coordinate.latitude,
            //   long: e.nativeEvent.coordinate.longitude,
            // }).then((res) => {
            //   console.log('res===>',res)
              
            //     setlocation({
            //       latitude: res.latlng.lat,
            //       longitude: res.latlng.long,
            //       latitudeDelta: 0.05,
            //       longitudeDelta: 0.05,
                  
            //     });
               
            //     setlocationadd(res.results[0].formatted_address)
           
            // });
        
          }}
          >
          
          <Marker
            // coordinate={location}
            // ref={mapRef}
            draggable={true}
            onDragEnd={e => {
              setlocation({
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
                // locationadd: add,
              });
              GetCurrentAddressByLatLong({
                lat: e.nativeEvent.coordinate.latitude,
                long: e.nativeEvent.coordinate.longitude,
              }).then((res) => {
                console.log('res===>',res)
                setlocationadd(res.results[0].formatted_address);
              });
            }}
            coordinate={{
              latitude: location?.latitude ? Number(location?.latitude) : 0,
              longitude: location?.longitude ? Number(location?.longitude) : 0,
            }}
          
            // pinColor={ 'green' }
          />

         
        </MapView>}
        
       
        {location && (
          <TouchableOpacity style={styles.button} onPress={naviate}>
            <Text style={styles.buttontxt}>{t('Confirm')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default MapAddress;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  container: {
    flex: 1,
    // backgroundColor: Constants.white,
    // padding: 20,
  },
  button: {
    backgroundColor: Constants.violet,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 5,
    // marginBottom: 70,
    borderRadius: 10,
    position:'absolute',
    bottom:50,
    width:'85%',
    alignSelf:'center',
    flexDirection:'row',
    paddingHorizontal:20
  },
  buttontxt: {
    color: Constants.white,
    fontSize: 18,
    fontFamily:FONTS.Bold
  },
});

