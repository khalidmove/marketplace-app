import React, { useCallback, useRef } from 'react';
import { Animated, Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CartIcon, CategoriesIcon, HomeIcon, ReferalIcon } from '../../Theme';
import Constants, { FONTS } from '../Assets/Helpers/constant';
import Home from '../screen/app/Home';
import Categories from '../screen/app/Categories';
import Referal from '../screen/app/Referal';
import Cart from '../screen/app/Cart';
import { useTranslation } from 'react-i18next';



const Tab = createBottomTabNavigator();

export const TabNav = () => {
  const { t } = useTranslation();
  const TabArr = [
    {
      iconActive: <HomeIcon color={Constants.linearcolor} height={25} />,
      iconInActive: <HomeIcon color={Constants.tabgrey} height={25} />,
      component: Home,
      routeName: 'Home',
      name: 'Home',
    },
    {
      iconActive: <CategoriesIcon color={Constants.linearcolor} height={25} />,
      iconInActive: <CategoriesIcon color={Constants.tabgrey} height={25} />,
      component: Categories,
      routeName: 'Categories',
      name: 'Categories',
    },
    {
      iconActive: <ReferalIcon color={Constants.linearcolor} height={25} />,
      iconInActive: <ReferalIcon color={Constants.tabgrey} height={25} />,
      component: Referal,
      routeName: 'Referal',
      name: 'Referal',
    },
    {
      iconActive: <CartIcon color={Constants.linearcolor} height={25} />,
      iconInActive: <CartIcon color={Constants.tabgrey} height={25} />,
      component: Cart,
      routeName: 'Cart',
      name: 'Cart',
    },
  ];

  const TabButton = useCallback(
    (props) => {
      const isSelected = props?.['aria-selected'];
      const onPress = props?.onPress;
      const onclick = props?.onclick;
      const item = props?.item;
      const index = props?.index;
      return (
        <View style={styles.tabBtnView}>

          <TouchableOpacity
            onPress={onclick ? onclick : onPress}
            style={[
              styles.tabBtn,
              // isSelected ? styles.tabBtnActive : styles.tabBtnInActive,
            ]}>
            {isSelected ? item.iconActive : item.iconInActive}

          </TouchableOpacity>
          <Text style={[styles.tabtxt, { color: isSelected ? Constants.linearcolor : Constants.black }]}>{t(item.name)}</Text>
        </View>
      );
    },
    [],
  );

  return (

    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: 'absolute',
          width: '100%',
          height: Platform?.OS === 'android' ? 70 : 90,
          backgroundColor: Constants.white,
          borderTopRightRadius: 15,
          borderTopLeftRadius: 15,
          borderTopWidth: 0,
          //   paddingTop: Platform.OS === 'ios' ? 10 : 0,
        },
      }}>
      {TabArr.map((item, index) => {
        return (
          <Tab.Screen
            key={index}
            name={item.routeName}
            component={item.component}

            options={{
              tabBarShowLabel: false,
              tabBarButton: props => (
                <TabButton {...props} item={item} index={index} />
              ),
            }}
          />
        );
      })}
    </Tab.Navigator>

  );

}

const styles = StyleSheet.create({
  tabBtnView: {
    // backgroundColor: isSelected ? 'blue' : '#FFFF',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtn: {
    height: 40,
    width: 40,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtnActive: {
    backgroundColor: Constants.white,
  },
  tabBtnInActive: {
    backgroundColor: 'white',
  },
  tabtxt: {
    color: Constants.black,
    // fontWeight:'400',
    fontFamily: FONTS.Medium,
  }
});
