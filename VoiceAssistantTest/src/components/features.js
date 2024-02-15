import { View, Text, ScrollView, Image } from 'react-native'
import React from 'react'

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


export default function Features() {
  return (
    <ScrollView style={{height: hp(60)}} bounces={false} showsVerticalScrollIndicator={false} className="space-y-4">
        <Text style={{fontSize: wp(6.5), marginBottom: 30}} className="font-semibold text-gray-700">Ask me to...</Text>
        <View className="bg-emerald-200 p-4 rounded-xl space-y-2" style={{marginBottom: 30}}>
            <View className="flex-row items-center space-x-1">
                <Image className="rounded-ful" source={require('../../assets/images/chatgptIcon.png')} style={{height: hp(4), width: hp(4)}} />
                <Text style={{fontSize: wp(4.8)}} className="font-semibold text-gray-700">Start a plan</Text>
            </View>
            
            <Text style={{fontSize: wp(3.8)}} className="text-gray-700 font-medium">
                Start a personalized stress/anxiety management plan. Keep you on track with daily check-ins and make recommendations based on your situation and preferences.  </Text>
        </View>

        <View className="bg-purple-200 p-4 rounded-xl space-y-2">
            <View className="flex-row items-center space-x-1">
                <Image className="rounded-ful" source={require('../../assets/images/dalleIcon.png')} style={{height: hp(4), width: hp(4)}} />
                <Text style={{fontSize: wp(4.8)}} className="font-semibold text-gray-700">Organize your thoughts</Text>
            </View>
            
            <Text style={{fontSize: wp(3.8)}} className="text-gray-700 font-medium">
                Word vomit, rant - I got you covered. I can work through your chaos and give you a gentle actionable plan to help you feel better ASAP.
            </Text>
        </View>

    </ScrollView>
  )
}