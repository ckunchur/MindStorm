import { View, Text, StyleSheet, TouchableOpacity, 
    Image, SafeAreaView, ImageBackground, Dimensions } from 'react-native';
  
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  
  export default function HomeScreen({ navigation, setPressed }) {
    return (
      <View style={styles.container}>
        <ImageBackground source={require('../assets/background-beach.png')} style={styles.landingImage}>
              <View style={styles.taglineView}>
              <Text style={styles.titleText}>Welcome to Mindstorm</Text>
              <Text style={styles.taglineText}>Learn how to find the calm in your storm.</Text>
              </View>
            <View>
  
  
            <TouchableOpacity style={styles.button} onPress={() => setPressed(true)} >
              <Text style={styles.landingButtonText}>Get started.</Text>
            </TouchableOpacity>
            <Text style={styles.loginText}>Have an account? Log in.</Text>
  
            </View>
  
        </ImageBackground>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    landingImage: {
      width: windowWidth,
      height: windowHeight * 1.03,
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    taglineView: {
      position: 'absolute',
      bottom: 0.8 * windowHeight,
      // marginLeft: 0.33 * windowWidth,
      alignItems: 'center',
      justifyContent: 'center'
      
    },
    titleText: {
      fontWeight: 'bold', 
      fontSize: windowWidth * 0.07, 
      marginLeft: 0.12 * windowWidth,
  
      color: 'white',
    },
    taglineText: { 
      fontSize: windowWidth * 0.04, 
      marginLeft: 0.15 * windowWidth,
  
      
      color: 'white',
    },
    button: {
      alignItems: "center",
      borderColor: 'white',
      borderWidth: 1,
      backgroundColor: 'white',
      borderRadius: 99999,
      width: windowWidth * 0.5,
      height: windowHeight * 0.06,
      //padding: 20,
      position: 'absolute',
      alignItems: 'center',
      alignContent: 'center',
      paddingTop: windowHeight * 0.015,
      paddingRight: windowWidth * 0.04,
      marginLeft: 0.25 * windowWidth,
      bottom: 0.12 * windowHeight,
    },
    landingButtonText: {
      fontSize: windowWidth * 0.04,
      fontWeight: "bold",
      color: '#4A9BB4',
      marginLeft: 20,
     alignContent: 'center',
     alignItems: 'center',
  
    },
    loginText: {
      fontSize: windowWidth * 0.04, 
      marginLeft: 0.3 * windowWidth,
      position: 'absolute',
      alignItems: 'center',
      alignContent: 'center',
      bottom: 0.08 * windowHeight,
      color: 'white',
  
    }
  });
  