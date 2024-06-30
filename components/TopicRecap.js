import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ImageBackground, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGlobalFonts } from '../styles/globalFonts';
import { COLORS, IMAGES } from '../styles/globalStyles';
import { useUser } from "../contexts/UserContext";
import { ScrollView } from 'react-native-gesture-handler';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const island_topics = {
    "Career": require("../assets/career-mountain.png"),
};

const action_items = ["Update LinkedIn", "Schedule coffee chat with Melissa"];
const affirmations = ["I have the power to ask for help when I need it.", "I am capable of improving my skillset.", "I know how to be a good leader."];


const WelcomeTitle = ({ title, style }) => <Text style={[styles.titleText, style]}>{title}</Text>;
const WelcomeMessage = ({ message, style }) => <Text style={[styles.messageText, style]}>{message}</Text>;

const RecapCard = ({ topic, image, domain, message, buttonText, onPress }) => {
    return (
        <View style={styles.cardContainer}>
            <View style={styles.labelContainer}>
                <Text style={styles.cardLabel}>{topic}</Text>
            </View>
            <Text style={styles.cardMessage}>{message}</Text>
        </View>
    );
};



export default function TopicRecap({ navigation }) {
    const fontsLoaded = useGlobalFonts();
    if (!fontsLoaded) {
        return null;
    }

    const { userId } = useUser(); // pulled from global state
    const handleViewAffirmations = () => {
        navigation.navigate('Affirmations');
    };
    
    return (
        <View style={styles.fullScreenContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back-circle-outline" color={COLORS.mindstormLightBlue} size={48} />
            </TouchableOpacity>
            <ImageBackground
                resizeMode="cover"
                source={IMAGES.gradientbg}
                style={styles.fullScreen}
            >
               

                <WelcomeTitle title="Recap" style={styles.title} />
                <Image source={island_topics["Career"]} style={styles.cardImage} />

                <WelcomeMessage message="Opening up isn’t easy. You’re making strides already! Let’s recap what we've talked about." style={styles.subheaderText} />
                <ScrollView>
                <RecapCard
                    topic="Latest Thoughts"
                    image={island_topics["Self Care"]}
                    message="We recently worked to tackle your anxiety about your future career prospects. You expressed how you are thinking about making a switch to product management but are unsure how to do so."
                />
                <View style={styles.cardContainer}>
                    <View style={styles.labelContainer}>
                        <Text style={styles.cardLabel}>Action Items</Text>
                    </View>
                    {action_items.map((item, index) => (
                        <Text key={index} style={styles.cardMessage}>{item}</Text>
                    ))}
                </View>
                <View style={styles.cardContainer}>
                    <View style={styles.labelContainer}>
                        <Text style={styles.cardLabel}>Affirmations</Text>
                    </View>
                    {affirmations.map((item, index) => (
                        <Text key={index} style={styles.cardMessage}>{item}</Text>
                    ))}
                     <TouchableOpacity
                        style={styles.continueButton}
                        onPress={() => handleViewAffirmations()}
                    >
                        <Text style={styles.continueButtonText}>View Affirmations</Text>
                    </TouchableOpacity>
                </View>
                </ScrollView>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    fullScreenContainer: {
        flex: 1,
        
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 1,
    },
    fullScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 32,
        fontFamily: 'Inter-Medium',
        color: COLORS.maintextcolor,
        textAlign: 'center',
        marginTop: 80,
    },
    messageText: {
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        color: COLORS.maintextcolor,
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    cardContainer: {
        width: windowWidth * 0.9,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
        marginVertical: 20,
    },

    cardLabel: {
        fontSize: 16,
        fontFamily: 'Inter-SemiBold',
        padding: 4,
        color: 'white',
        marginTop: 10,
    },
    labelContainer: {
        position: 'absolute',
        top: -20,
        width: '90%',
        backgroundColor: '#7CB6B5', // Adjust color as needed
        borderRadius: 15,
        paddingVertical: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },

    cardDomain: {
        fontSize: 20,
        fontFamily: 'Inter-Medium',
        color: COLORS.maintextcolor,
        marginTop: 10,
    },
    cardMessage: {
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        color: COLORS.maintextcolor,
        textAlign: 'center',
        marginTop: 10,
    },
    cardButton: {
        backgroundColor: COLORS.mindstormLightBlue,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    cardButtonText: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        color: 'white',
    },
    continueButton: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 48,
        backgroundColor: 'white',
        position: "relative",
        borderColor: COLORS.mindstormLightBlue,
        borderWidth: 1,
        textAlign: "center",
        margin: 8, 
        padding: 8,
        fontSize: 16,
        fontWeight: "700",
        fontFamily: "Inter-Regular",
    },

    continueButtonText: {
        color: COLORS.maintextcolor,
        fontFamily: "Inter-Medium"
    },
});
