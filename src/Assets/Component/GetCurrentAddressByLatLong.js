/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { View, Text } from 'react-native';
import React from 'react';
import {
  setKey,
  setDefaults,
  setLanguage,
  setRegion,
  fromAddress,
  fromLatLng,
  fromPlaceId,
  setLocationType,
  geocode,
  RequestType,
} from 'react-geocode';



const GetCurrentAddressByLatLong = (props) => {
  console.log(props);
  // setKey('AIzaSyDHd5FoyP2sDBo0vO2i0Zq7TIUZ_7GhBcI');
  setDefaults({
    key: 'AIzaSyDHd5FoyP2sDBo0vO2i0Zq7TIUZ_7GhBcI', // Your API key here.
    language: 'en', // Default language for responses.
    region: 'es', // Default region for responses.
  });
  let address = '';
  return new Promise((resolve, reject) => {
    fromLatLng(props.lat.toString(), props.long.toString())
      .then(({ results }) => {
        const { lat, lng } = results[0].geometry.location;
        const l = results.filter(
          (f) =>
            f.geometry.location.lat === props.lat &&
            f.geometry.location.lng === props.long,
        );
        console.log('l----------->', l);
        console.log('results----------->', results);
        address = results;
        resolve({ results, latlng: props });
      })
      .catch(console.error);

    return address;
  });
};

// const GetCurrentAddressByLatLong = async ({ lat, long }) => {
//   console.log(lat, long)
//   try {
//     const apiKey = 'AIzaSyDHd5FoyP2sDBo0vO2i0Zq7TIUZ_7GhBcI';
//     const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${apiKey}`;

//     const response = await fetch(url);
//     const data = await response.json();

//     if (data.status === 'OK') {
//       console.log(data.results[0].formatted_address);

//       //       const { lat, lng } = results[0].geometry.location;
//       // const l = data.results.filter(
//       //   (f) =>
//       //     f.geometry.location.lat === props.lat &&
//       //     f.geometry.location.lng === props.long,
//       // );
//       // console.log('l----------->', l);
//       console.log('results----------->', data.results);
//       address = results;
//       resolve({ results, latlng: props });
//     } else {
//       console.log('Geocoding failed:', data.status);
//     }
//     return address
//   } catch (error) {
//     console.log('Network request failed:', error);
//   }
// };

export default GetCurrentAddressByLatLong;
