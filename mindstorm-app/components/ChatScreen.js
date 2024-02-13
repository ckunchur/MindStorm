import React from 'react';
import { StyleSheet, View, ImageBackground, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function ChatScreen() {
    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/background-beach.png')}
                style={styles.bgImage}
            >
                {/* Additional content can be added here if needed */}
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bgImage: {
        width: windowWidth,
        height: windowHeight,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
