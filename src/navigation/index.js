import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { navigationRef } from '../../navigationRef';
import { TabNav } from './TabScreen';
import SignIn from '../screen/auth/SignIn';
import SignUp from '../screen/auth/SignUp';
import ForgotPassword from '../screen/auth/ForgotPassword';
import Preview from '../screen/app/Preview';
import Products from '../screen/app/Products';
import Account from '../screen/app/Account';
import Profile from '../screen/app/Profile';
import { Vendortab } from './VendorTab';
import Shipping from '../screen/app/Shipping';
import VendorForm from '../screen/vendor/VendorForm';
import { Drivertab } from './DriverTab';
import Driverform from '../screen/driver/Driverform';
import OrderDetail from '../screen/Employee/OrderDetail';
import OrderStatus from '../screen/vendor/OrderStatus';
import Map from '../screen/driver/Map';
import DriverOrder from '../screen/driver/DriverOrder';
import VendorAccount from '../screen/vendor/Account';
import VendorProfile from '../screen/vendor/VendorProfile';
import DriverProfile from '../screen/driver/DriverProfile';
import DriverAccount from '../screen/driver/Account';
import Myorder from '../screen/app/Myorder';
import Orderview from '../screen/app/Orderview';
import Searchpage from '../screen/app/Searchpage';
import MapAddress from '../screen/app/MapAddress';
import Checkout from '../screen/app/Checkout';
import Notification from '../screen/app/Notification';
import Webview from '../screen/app/Webview';
import Term from '../screen/app/Term';
import Privacy from '../screen/app/Privacy';
import TrackDriver from '../screen/app/TrackDriver';
import { Employeetab } from './Employee';
import EmployeeOrderStatus from '../screen/Employee/EmployeeOrderStatus';


const Stack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

const AuthNavigate = () => {
  return (
    <AuthStack.Navigator screenOptions={{headerShown: false}}>
      <AuthStack.Screen name="SignIn" component={SignIn} />
      <AuthStack.Screen name="SignUp" component={SignUp} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPassword} />
      
    </AuthStack.Navigator>
  );
};

export default function Navigation(props) {
  return (
    // <NavigationContainer>
      <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={props.initial}
       >
        
        <Stack.Screen name="App" component={TabNav} />
        <Stack.Screen name="Vendortab" component={Vendortab} />
        <Stack.Screen name="Drivertab" component={Drivertab} />
        <Stack.Screen name="Employeetab" component={Employeetab} />
        <Stack.Screen name="Auth" component={AuthNavigate} />
        <Stack.Screen name="Preview" component={Preview} />
        <Stack.Screen name="Products" component={Products} />
        <Stack.Screen name="Account" component={Account} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Shipping" component={Shipping} />
        <Stack.Screen name="VendorForm" component={VendorForm} />
        <Stack.Screen name="Driverform" component={Driverform} />
        <Stack.Screen name="OrderDetail" component={OrderDetail} />
        <Stack.Screen name="OrderStatus" component={OrderStatus} />
        <Stack.Screen name="Map" component={Map} />
        <Stack.Screen name="DriverOrder" component={DriverOrder} />
        <Stack.Screen name="VendorAccount" component={VendorAccount} />
        <Stack.Screen name="VendorProfile" component={VendorProfile} />
        <Stack.Screen name="DriverProfile" component={DriverProfile} />
        <Stack.Screen name="DriverAccount" component={DriverAccount} />
        <Stack.Screen name="Myorder" component={Myorder} />
        <Stack.Screen name="Orderview" component={Orderview} />
        <Stack.Screen name="Searchpage" component={Searchpage} />
        <Stack.Screen name="MapAddress" component={MapAddress} />
        <Stack.Screen name="Checkout" component={Checkout} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="Webview" component={Webview} />
        <Stack.Screen name="Term" component={Term} />
        <Stack.Screen name="Privacy" component={Privacy} />
        <Stack.Screen name="TrackDriver" component={TrackDriver} />
        <Stack.Screen name="EmployeeOrderStatus" component={EmployeeOrderStatus} />
        
   
      </Stack.Navigator>

    </NavigationContainer>
  );
}
