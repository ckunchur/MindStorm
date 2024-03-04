import { View, Text, SafeAreaView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default function WelcomeScreen() {
    const navigation = useNavigation();
  return (
    <SafeAreaView className="flex-1 flex justify-around bg-white">
        {/* title */}
        <View className="space-y-2 px-10">
            <Text style={{fontSize: wp(10)}} className="text-center font-bold text-gray-700">
                Ella
            </Text>
            <Text style={{fontSize: wp(4)}} className="text-center tracking-wider font-semibold text-gray-600">
                Turning your storm into clarity, one gentle plan at a time.
            </Text>
        </View>
        
        {/* assistant image */}
        <View className="flex-row justify-center">
            <Image  
                source={require('../../assets/images/welcome.png')}
                style={{height: wp(75), width: wp(75)}}
            />
        </View>
        
        {/* start button */}
        <TouchableOpacity onPress={()=> navigation.navigate('Home')} className="bg-emerald-600 mx-5 p-4 rounded-2xl">
            <Text style={{fontSize: wp(5)}} className="text-center font-semibold text-white">
                Begin
            </Text>
        </TouchableOpacity>
    </SafeAreaView>
  )
}