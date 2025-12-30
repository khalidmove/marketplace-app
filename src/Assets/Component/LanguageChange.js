import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
// import ActionSheet from 'react-native-actions-sheet';
import { CrossIcon, RadiooffIcon, RadioonIcon } from '../../../Theme';
import Constants, { FONTS } from '../Helpers/constant';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n';

const LanguageChange = (props) => {
     const [selectLanguage, setSelectLanguage] = useState('English');

        useEffect(() => {
    checkLng();
  }, []);
  const checkLng = async () => {
    const x = await AsyncStorage.getItem('LANG');
    if (x != null) {
      let lng =
        x == 'en'
          ? 'English'
          : x == 'ar' ? 'العربية' : 'کوردی'
      setSelectLanguage(lng);
    }
  };
  const onCancel = () => {
    if (props?.cancel !== undefined) {
      props?.cancel();    }
  };
  return (
            <Modal
                    visible={props?.show}
                    transparent={true}
                    style={styles.modal1}
                    onRequestClose={onCancel}>
                      <View style={styles.container}>
          <View style={styles.modal}>
            <View style={styles.headcov}>
              <Text style={[styles.heading, { color: Constants.black }]}>Select Language</Text>
              <CrossIcon height={13}
                width={13}
                style={{ alignSelf: 'center' }}
                color={Constants.black}
                onPress={() => props?.cancel()} />
            </View>

            <TouchableOpacity
              style={[styles.item, { borderColor: selectLanguage === 'English' ? Constants.violet : Constants.black }]}
              onPress={async () => {
                await AsyncStorage.setItem('LANG', 'en');
                i18n.changeLanguage('en');
                setSelectLanguage('English');
                props.selLang('English');
                props?.cancel()
              }}>

              {selectLanguage == 'English' ? <RadioonIcon color={Constants.violet} height={25} width={25} /> :
                <RadiooffIcon color={Constants.violet} height={25} width={25} />}
              <Text style={[styles.itemTxt, { color: Constants.black }]}>English</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.item, { borderColor: selectLanguage === 'العربية' ? Constants.violet : Constants.black }]}
              onPress={async () => {
                await AsyncStorage.setItem('LANG', 'ar');
                i18n.changeLanguage('ar');
                setSelectLanguage('العربية');
                props.selLang('العربية');
                props?.cancel()
              }}>
              {selectLanguage == 'العربية' ? <RadioonIcon color={Constants.violet} height={25} width={25} /> :
                <RadiooffIcon color={Constants.violet} height={25} width={25} />}
              <Text style={[styles.itemTxt, { color: Constants.black }]}>العربية</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.item, { borderColor: selectLanguage === 'کوردی' ? Constants.violet : Constants.black }]}
              onPress={async () => {
                await AsyncStorage.setItem('LANG', 'ku');
                i18n.changeLanguage('ku');
                setSelectLanguage('کوردی');
                props.selLang('کوردی');
                props?.cancel()
              }}>

              {selectLanguage == 'کوردی' ? <RadioonIcon color={Constants.violet} height={25} width={25} /> :
                <RadiooffIcon color={Constants.violet} height={25} width={25} />}
              <Text style={[styles.itemTxt, { color: Constants.black }]}>کوردی</Text>
            </TouchableOpacity>

          </View>
          </View>
        </Modal>
  )
}

export default LanguageChange

const styles = StyleSheet.create({
  modal1: {
    flex: 1,
  },
  container: {
    flex: 1,
    // backgroundColor: Constants.customgrey4,
    // opacity:0.3,
    justifyContent: 'flex-end',
  },
    modal: {
    paddingBottom: 20,
    backgroundColor: Constants.customgrey4,
    borderWidth:1,
    borderColor:Constants.violet,
    borderBottomWidth:0,
    borderRadius:10
  },
  heading: {
    fontSize: 16,
    color: Constants.black,
    fontFamily:FONTS.SemiBold,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    height: 50,
    borderWidth: 0.5,
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 8,
  },
  itemTxt: {
    marginLeft: 10,
    fontSize: 14,
    color: Constants.black,
    fontFamily:FONTS.Medium,
  },
  headcov:{
    flexDirection:'row',
    justifyContent:'space-between',
    margin: 20
  },
})