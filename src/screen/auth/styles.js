import { StyleSheet, Dimensions, Platform } from 'react-native';
import Constants, { FONTS } from '../../Assets/Helpers/constant';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.white,
    padding: 20,

  },
  logintitle: {
    fontSize: 24,
    color: Constants.black,
    fontFamily:FONTS.Black
  },
  title: {
    fontSize: 24,
    color: Constants.black,
    fontWeight: 'bold'
  },
  title2: {
    fontSize: 18,
    color: Constants.customgrey,
    fontFamily:FONTS.Regular
  },
  require:{
    color:Constants.red,
    fontFamily:FONTS.Medium,
    marginLeft:10,
    fontSize:14,
    marginTop:10
  },
  buttontxt:{
    color:Constants.white,
    fontSize:18,
    fontFamily:FONTS.Bold
  },
  title3: {
    fontSize: 20,
    color: Constants.black,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  pp2: {
    fontSize: 16,
    color: Constants.customgrey,
    textAlign: 'center',
    fontFamily: FONTS.Regular,
  },
  pp3: {
    fontSize: 16,
    color: Constants.black,
    fontWeight: 'bold',
    textAlign: "center",
    fontFamily: FONTS.Bold,
  },
  logo: {
    height: 180,
    width: 140,
    alignSelf: 'center',
    marginTop: 20
  },
  logo2: {
    height: 220,
    width: 220,
    alignSelf: 'center',
    marginTop: 20
  },
  textInput: {
    borderColor: Constants.customgrey,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 7,
    // width: 370,
    height: 60,
    marginTop: 40,
    flexDirection: 'row',

  },
  input: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '400',
    // fontFamily: 'Helvetica',
    color: Constants.black,
    flex: 1,
    textAlign:'left'
  },
  acountBtn: {
    // alignItems: 'center',
    // marginTop: 10,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
    marginTop: 30,
  },
  Already: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Helvetica',
    color: Constants.customgrey,
    fontFamily: FONTS.Regular,
  },
  signin: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
    color: Constants.black,
      fontFamily: FONTS.Bold,
  },
  signInbtn: {
    height: 60,
    // width: 370,
    borderRadius: 10,
    backgroundColor: Constants.violet,
    // marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgot: {
    alignSelf: 'flex-end',
    marginTop: 15,
    color: Constants.black,
    fontSize: 16,
    fontFamily:FONTS.Bold,
    marginBottom:20
  },
  skip: {
    alignSelf: 'center',
    marginTop: 15,
    color: Constants.violet,
    fontSize: 16,
    fontFamily:FONTS.Bold
  },
  pp: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 10
  },
  pt: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: "center"

  },
  iconView: {
    // height: 45,
    // width: 70,
    // justifyContent: 'center',
    marginRight: 10,
    alignSelf: 'center',
    borderRightWidth: 4,
    borderRightColor: 'blue',
  },
  mylivejobtitle: {
    position: 'absolute',
    backgroundColor: Constants.white,
    paddingHorizontal: 5,
    top: -10,
    left: 30
  },
  jobtitle: {
    color: Constants.black,
    fontSize: 13,
    textAlign: 'center',
    fontFamily:FONTS.Medium
  },
  btnCov: {
    // width: wp(100),
    height: 50,
    flex: 1,
    flexDirection: 'row',
    marginTop: 20
  },
  cencelBtn: {
    // backgroundColor: Constants.customblue,
    // width: '50%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    // borderLeftWidth:2,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderColor: Constants.customgrey
  },
  cencelBtn2: {
    // backgroundColor: Constants.customblue,
    // width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    flex: 1,
    // borderLeftWidth:2,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: Constants.customgrey,
  },
  btntxt: {
    fontSize: 18,
    color: Constants.white,
  },
  codeFieldRoot2: { width: Dimensions.get('window').width - 40 },
  cell: {
    width: 70,
    height: 70,
    lineHeight: 68,
    fontSize: 30,
    fontWeight: '700',
    // fontFamily: 'Helvetica',
    // borderWidth: 2,
    // borderColor: '#fff',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
    color: Constants.white,
    backgroundColor: Constants.customblue,
    borderColor: Constants.white,
    borderWidth: 1,
  },
  focusCell: {
    borderColor: Constants.customblue,
  },
  box: {
    borderWidth: 2,
    borderColor: Constants.customblue,
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 10,
    marginVertical: 20
  },
  // radioView: {
  //   flexDirection: 'row',
  //   // justifyContent: 'space-around',
  //   // flexWrap: 'wrap',
  //   // width: 240,
  // },
  // keyboard: {
  //   flex: 1,
  //   flexDirection: 'column',
  // },
  // subtitle: {
  //   fontSize: 13,
  //   color: 'white',
  //   fontWeight: '400',
  //   fontFamily: 'Helvetica',
  //   marginTop: 10,
  //   marginBottom: 10,
  // },
  applyBtn: {
    backgroundColor: "#2048BD",
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    // width: '90%',
    paddingHorizontal: 10,
    borderColor: '#2048BD',
    borderWidth: 3,
  },
  applyBtnTxt: {
    color: Constants.white,
    fontWeight: '700',
    fontFamily: 'Helvetica',
    fontSize: 12,

    lineHeight: 18,
  },
///type option///
  btnCov2: {
    //   width: '50%',
    height: 60,
    flex:1,
    flexDirection: 'row',
    // justifyContent:'space-around',
    marginVertical: 20,
    borderRadius:20,
    borderWidth:1,
    borderColor:Constants.violet
  },
  unselectBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    borderRadius:10,
  },
  selectBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    borderRadius:10,
    // boxShadow:'inset 0 0 8 8 #1b1e22',
    // boxShadow:'0 0 8 0.05 grey',
    backgroundColor:Constants.violet
  },
  selebtntxt:{
    
    color:Constants.white,
    fontFamily:FONTS.Bold,
    fontSize:16,
  },
  unselebtntxt:{
    
    color:Constants.violet,
    fontFamily:FONTS.Bold,
    fontSize:16,
  },
  selectshad:{
    // boxShadow:'inset 0 0 8 8 #966c1e',
    height:'100%',
    width:'100%',justifyContent:'center',
    alignItems:'center',
    borderRadius:10
  },
  langView: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    borderColor: '#9e9e9e',
    position: 'absolute',
    top: 15,
    right: 10,
    alignItems: 'center',
    flexDirection: 'row',
    gap:5,
    zIndex:10
  },
  lang: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
})
export default styles;