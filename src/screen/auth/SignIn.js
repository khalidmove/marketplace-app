import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import React, { createRef, useContext, useEffect, useState } from 'react';
import styles from './styles';
import Constants from '../../Assets/Helpers/constant';
import { navigate, reset } from '../../../navigationRef';
import Spinner from '../../Assets/Component/Spinner';
import { LoadContext, ToastContext, UserContext } from '../../../App';
import { Post } from '../../Assets/Helpers/Service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OneSignal } from 'react-native-onesignal';
import { checkEmail } from '../../Assets/Helpers/InputsNullChecker';
import { CrossIcon, Downarrow, RadiooffIcon, RadioonIcon } from '../../../Theme';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n';
import LanguageChange from '../../Assets/Component/LanguageChange';

const SignIn = props => {
  const [showPass, setShowPass] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useContext(ToastContext);
  const [loading, setLoading] = useContext(LoadContext);
  const [user, setuser] = useContext(UserContext);
  const [title, settile] = useState('')
  const [userDetail, setUserDetail] = useState({
    password: '',
    username: '',
  });
  const [selectLanguage, setSelectLanguage] = useState('English');
  const { t } = useTranslation();
  const [showLanguage, setShowLanguage] = useState(false);

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

  const submit = async () => {
    if (userDetail.username.trim() === '' || userDetail.password === '') {
      setSubmitted(true);
      return;
    }
    const emailcheck = checkEmail(userDetail.username.toLowerCase().trim());
    if (!emailcheck) {
      setToast('Your email id is invalid');
      return;
    }

    const player_id = await OneSignal.User.pushSubscription.getIdAsync()
    const device_token = await OneSignal.User.pushSubscription.getTokenAsync()
    const data = {
      username: userDetail.username.toLowerCase().trim(),
      password: userDetail.password,
      player_id,
      device_token
    };

    console.log('data==========>', userDetail);
    // userDetail.email = userDetail.email.toLowerCase();
    setLoading(true);
    console.log('data2==========>', userDetail);
    Post('login', data, { ...props }).then(
      async (res) => {
        setLoading(false);
        console.log(res);
        setSubmitted(false);
        if (res.status) {
          setUserDetail({
            password: '',
            username: '',
          });
          setLoading(false);
          await AsyncStorage.setItem(
            'userDetail', JSON.stringify(res.data),
          );
          setuser(res.data)
          setTimeout(() => {
            if (res.data.type === 'SELLER') {
              setLoading(false);
              if (res.data.status === 'Verified') {

                reset('Vendortab');
              } else {
                reset('VendorForm');

              }
            }
            else if (res.data.type === 'DRIVER') {
              setLoading(false);
              if (res.data.status === 'Verified') {

                reset('Drivertab');
              } else {
                reset('Driverform');

              }
            }
            else if (res.data.type === 'EMPLOYEE') {
              setLoading(false);
              reset('Employeetab');
            }
            else {
              setLoading(false);
              reset('App');
            }
          }, 1000);

          // setToast(res.message);

        } else {
          setLoading(false);
          console.log('error------>', res);
          if (res.message !== undefined) {
            console.log('error------>');
            setToast(res.message);
          }
        }
      },
      (err) => {
        setLoading(false);
        console.log(err);
        setSubmitted(false);
      },
    );
  };
  return (
    <SafeAreaView style={styles.container} >
    <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{flex:1}}
            >
      <ScrollView style={[styles.container,{padding:Platform.OS==='ios'?20: 0}]} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={[styles.langView, { borderColor: Constants.black }]}
          onPress={() => setShowLanguage(true)}>
          <Text style={[styles.lang, { color: Constants.black }]}>{selectLanguage}</Text>
          <Downarrow height={15} width={15} color={Constants.black} />
        </TouchableOpacity>
        <View style={{ marginTop: 30 }}>
          <Text style={styles.logintitle}>{t('WELCOME')}</Text>
          <Text style={styles.title2}>{t('Please enter your Sign in details')}</Text>
        </View>
        <Image
          source={require('../../Assets/Images/loginlogo.png')}
          style={styles.logo}
        />
        <View style={styles.textInput}>
          <TextInput
            style={styles.input}
            placeholder={t('Enter email')}
            placeholderTextColor={Constants.customgrey}
            value={userDetail.username}
            onChangeText={username => setUserDetail({ ...userDetail, username })}
          />
          <View style={[styles.mylivejobtitle]}>
            <Text style={styles.jobtitle}>{t('Email')}</Text>
          </View>
        </View>
        {submitted && userDetail.username === '' && (
          <Text style={styles.require}>{t('Email is required')}</Text>
        )}
        <View style={styles.textInput}>
          <TextInput
            style={styles.input}
            placeholder={t('Password')}
            placeholderTextColor={Constants.customgrey}
            secureTextEntry={showPass}
            value={userDetail.password}
            onChangeText={password => setUserDetail({ ...userDetail, password })}
          />
          <TouchableOpacity
            onPress={() => {
              setShowPass(!showPass);
            }}
            style={[styles.iconView, { borderRightWidth: 0 }]}>
            <Image
              source={
                showPass
                  ? require('../../Assets/Images/eye-1.png')
                  : require('../../Assets/Images/eye.png')
              }
              style={{ height: 28, width: 28 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={[styles.mylivejobtitle]}>
            <Text style={styles.jobtitle}>{t('Password')}</Text>
          </View>
        </View>
        {submitted && userDetail.password === '' && (
          <Text style={styles.require}>{t('Password is required')}</Text>
        )}
        <TouchableOpacity
          onPress={() => navigate('ForgotPassword')}>
          <Text style={styles.forgot}>{t('Forgot password ?')}</Text>
        </TouchableOpacity>
        {/* <View style={styles.pp}>
        <Text style={styles.pp2}>{t('By clicking Sign In, you agree with our')}</Text>
        <View style={styles.pt}>
          <Text style={styles.pp3} onPress={() => navigate('Term')}>{t('Terms and Condition')}</Text>
          <Text style={styles.pp2}>{t('and')}</Text>
          <Text style={styles.pp3} onPress={() => navigate('Privacy')}>{t('Privacy Policy')}</Text>
        </View>
      </View> */}

        <TouchableOpacity style={styles.signInbtn} onPress={() => submit()}>
          <Text style={styles.buttontxt}>{t('Sign In')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigate('App')}>
          <Text style={styles.skip}>{t('Skip')}</Text>
        </TouchableOpacity>

        <View style={{ alignSelf: 'center', marginBottom: 40 }}>
          <View style={[styles.acountBtn]}>
            <Text style={styles.Already}>{t('Donot have an Account ?')}</Text>
            <TouchableOpacity onPress={() => navigate('SignUp')}>
              <Text style={styles.signin}>{t('signup')}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <LanguageChange show={showLanguage} cancel={() => setShowLanguage(false)} selLang={(item)=>{setSelectLanguage(item)}}/>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


export default SignIn;
