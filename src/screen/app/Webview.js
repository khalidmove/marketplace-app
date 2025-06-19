import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import WebView from 'react-native-webview'
import Header from '../../Assets/Component/Header'

const Webview = () => {
  return (
    <>
    {/* <SafeAreaView>
    <Header  />
    </SafeAreaView> */}
    <WebView source={{ uri: 'https://tawk.to/chat/66ea5a7783ab531891e85670/1i81n2p3t' }} style={{ flex: 1 }} />
    <SafeAreaView>
    </SafeAreaView>
    </>
  )
}

export default Webview