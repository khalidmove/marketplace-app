import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Constants, { FONTS } from '../../Assets/Helpers/constant';
import Header from '../../Assets/Component/Header';
import WebView from 'react-native-webview';

const Privacy = () => {
  return (
      <WebView  source={{ uri: 'https://main.d29wph1akkhrww.amplifyapp.com/privacy-policy' }} style={{ flex: 1 }} />
  );
};

export default Privacy;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Constants.white,
    padding: 20,
  },
 
});
