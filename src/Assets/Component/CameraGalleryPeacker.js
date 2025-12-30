/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Modal,
  StyleSheet,
} from 'react-native';
import React, { useEffect } from 'react';
// import ImagePicker from 'react-native-image-crop-picker';
// import ActionSheet from 'react-native-actions-sheet';
import { check, PERMISSIONS, RESULTS, request, requestMultiple } from 'react-native-permissions';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
// import ImagePicker from 'react-native-image-picker';
import Constants, { FONTS } from '../Helpers/constant';
import { CameraIcon, CrossIcon, ImageIcon } from '../../../Theme';

const CameraGalleryPeacker = (props) => {
  // useEffect(() => {
  //   ImagePicker.clean()
  //     .then(() => {
  //       // console.log('removed tmp images from tmp directory');
  //       alert('Temporary images history cleared');
  //     })
  //     .catch(e => {
  //       alert(e);
  //     });
  // }, []);

  const options2 = {
    mediaType: 'photo',
    maxWidth: props?.width || 300,
    maxHeight: props?.height || 300,
    quality: props?.quality || 1,
    includeBase64: props.base64,
    saveToPhotos: true
    // cameraType: props?.useFrontCamera ? 'front' : 'back',
  };

  const options = {
    width: props?.width || 300,
    height: props?.height || 300,
    cropping: props?.crop || false,
    compressImageQuality: props?.quality || 1,
    includeBase64: props.base64,
    useFrontCamera: props?.useFrontCamera ? props?.useFrontCamera : false,
  };

  const launchCameras = async () => {
    // console.log(options);
    // ImagePicker.openCamera(options)
    //   .then(
    //     image => {
    //       console.log(image);
    //       props.getImageValue(image);
    //     },
    //     err => {
    //       console.log(err);
    //     },
    //   )
    //   .catch(e => {
    //     alert(e);
    //   });
    launchCamera(options2, (response) => {
      console.log(response)
      if (response.didCancel) {
        props?.cancel()
        console.log('User cancelled image picker');
      } else if (response.error) {
        props?.cancel()
        console.log('ImagePicker Error:', response.error);
        // setErrorMessage('Error selecting image. Please try again.');
      } else if (response.customButton) {
        props?.cancel()
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        onCancel()
        props.getImageValue(response);
        // setSelectedImage(source);
      }
    });

    // const result = await launchCamera(options2);
    // props.getImageValue(result);
  };

  const launchImageLibrarys = async () => {
    // if (Platform.OS === 'ios') {
    //   request(PERMISSIONS.IOS.PHOTO_LIBRARY).then(result => {
    //     console.log('result ====>', result);
    //     if (result === 'granted') {
    //       ImagePicker.openPicker(options).then(
    //         image => {
    //           props.getImageValue(image);
    //         },
    //         err => {
    //           console.log(err);
    //         },
    //       );
    //     }
    //   });
    // }

    // ImagePicker.openPicker(options)
    //   .then(
    //     image => {
    //       console.log(image);
    //       props.getImageValue(image);
    //     },
    //     err => {
    //       console.log(err);
    //     },
    //   )
    //   .catch(e => {
    //     alert(e);
    //   });

    // const result = await launchImageLibrary(options2);
    // props.getImageValue(result);

    launchImageLibrary(options2, (response) => {
      if (response.didCancel) {
        props?.cancel()
        console.log('User cancelled image picker');
      } else if (response.error) {
        props?.cancel()
        console.log('ImagePicker Error:', response.error);
        // setErrorMessage('Error selecting image. Please try again.');
      } else if (response.customButton) {
        props?.cancel()
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
      setTimeout(() => {
        props.cancel()
      }, 100);
        props.getImageValue(response);
        // setSelectedImage(source);
      }
    });
  };

  // const checkAndroidPermission = async type => {
  //   console.log(Platform.Version);
  //   if (Platform.OS !== 'android') {
  //     const granted = await PermissionsAndroid.requestMultiple([
  //       'android.permission.CAMERA',
  //       'android.permission.READ_EXTERNAL_STORAGE',
  //       // 'android.permission.WRITE_EXTERNAL_STORAGE',
  //     ]);
  //     if (
  //       granted['android.permission.CAMERA'] !== 'granted' &&
  //       granted['android.permission.READ_EXTERNAL_STORAGE'] !== 'granted'
  //       //  &&
  //       // granted['android.permission.WRITE_EXTERNAL_STORAGE'] !== 'granted'
  //     ) {
  //       throw new Error('Required permission not granted');
  //     } else {
  //       // try {
  //       //   const result = await launchCamera({saveToPhotos: true});
  //       //   console.log(result);
  //       // } catch (err) {
  //       //   console.log(err);
  //       // }
  //       type();
  //       // launchCameras();
  //     }
  //   } else {
  //     type();
  //     // launchCameras();
  //   }
  // };

  const requestMediaPermission = async (type, permission) => {
    // props.refs.current?.hide();
    try {
      const result = await check(permission);

      if (result === RESULTS.GRANTED) {

        setTimeout(() => {
          type();
        }, 500);

        console.log('Permission already granted');
        return;
      }

      if (result === RESULTS.DENIED || result === RESULTS.UNAVAILABLE) {
        const permissionResult = await request(permission);
        console.log(permissionResult)
        if (permissionResult === RESULTS.GRANTED) {
          console.log('Permission granted');
   
setTimeout(() => {
  type();
}, 500);
        } else {
          console.log('Permission denied');

        }
      }
    } catch (error) {
      console.error('Error checking or requesting permission:', error);
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
        style={styles.modal}
        onRequestClose={onCancel}>
        <View style={styles.container}>
          <View style={styles.cardView}>
<View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:'100%',padding:15}}>
  <View style={{width:30}}></View>
            <Text style={styles.title}>{props?.title ? props?.title : 'Modal title'}</Text>
                        <TouchableOpacity style={styles.crossBtn} onPress={onCancel}>
              <CrossIcon size={25} color={Constants.white}/>
            </TouchableOpacity>
            </View>

            <View style={styles.body}>
              <TouchableOpacity onPress={()=>Platform.OS === 'ios' ? requestMediaPermission(launchCameras, PERMISSIONS.IOS.CAMERA) : launchCameras()} style={styles.smallCard}>
                <CameraIcon height={20} width={20} color={Constants.white}/>
                <Text style={styles.optionTxt}>Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={()=>Platform.OS === 'ios' ? requestMediaPermission(launchImageLibrarys, PERMISSIONS.IOS.PHOTO_LIBRARY) : launchImageLibrarys()}
                style={styles.smallCard}>
                <ImageIcon height={20} width={20} color={Constants.white}/>
                <Text style={styles.optionTxt}>Gallery</Text>
              </TouchableOpacity>
            </View>


          </View>
        </View>
      </Modal>
  );
};

export default CameraGalleryPeacker;

const styles = StyleSheet.create({
    modal: {
    flex: 1,
  },
  container: {
    flex: 1,
    // backgroundColor: Constants.white,
    justifyContent: 'flex-end',
  },
  container2: {
    flex: 1,
    backgroundColor: Constants.red,
    justifyContent: 'center',
  },
  cardView: {
    backgroundColor: Constants.black,
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardView2: {
    backgroundColor: Constants.black,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 15,
    padding: 10,
  },
  title: {
    color: Constants.white,
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
  },
  title2: {
    color: Constants.white,
    fontSize: 14,
    fontFamily: FONTS.RobotoMedium,
  },
  crossBtn: {
    alignSelf: 'center',
  },
  btnWraper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    gap:50,
    marginBottom:30
  },
  smallCard: {
    height: 100,
    width: 100,
    backgroundColor: Constants.customgrey,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  optionTxt: {
    color: Constants.white,
    fontSize: 16,
    fontFamily: FONTS.Medium,
  },
  })
