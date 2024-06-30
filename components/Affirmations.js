import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGlobalFonts } from '../styles/globalFonts';
import { COLORS, IMAGES } from '../styles/globalStyles';
import { useUser } from "../contexts/UserContext";
import { WebView } from 'react-native-webview';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const affirmations = [
    { category: "Career", affirmation: "I am capable of improving my skillset." },
    { category: "Career", affirmation: "I have the power to ask for help when I need it." },
    { category: "Career", affirmation: "I will seek out people who share my interests." },
    { category: "Career", affirmation: "I do not have to commit to one path for the rest of my life." },
    { category: "Career", affirmation: "I will be successful in achieving my goals." },
    { category: "Self-Love", affirmation: "I am a kind and caring friend." },
    { category: "Productivity", affirmation: "I just need to open the assignment to get started." }
];

const affirmation_options = ["Career", "Self-Love", "Productivity"];

const WelcomeTitle = ({ title, style }) => <Text style={[styles.titleText, style]}>{title}</Text>;
const WelcomeMessage = ({ message, style }) => <Text style={[styles.messageText, style]}>{message}</Text>;

const AffirmationCard = ({ category, affirmation, isSelected }) => {
    return (
        <View style={[
            styles.cardContainer,
            isSelected && styles.selectedCardContainer
        ]}>
            <Text style={styles.cardMessage}>{affirmation}</Text>
            <View style={styles.affirmationContainer}>
                <Text style={styles.affirmationCategory}>{category}</Text>
            </View>
        </View>
    );
};

export default function Affirmations({ navigation }) {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedAffirmationIndex, setSelectedAffirmationIndex] = useState(null);
    const scrollViewRef = useRef(null);
    const fontsLoaded = useGlobalFonts();

    if (!fontsLoaded) {
        return null;
    }

    const { userId } = useUser(); // pulled from global state

    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
    };

    const handleRoll = () => {
        const filteredAffirmations = affirmations.filter(
            item => selectedCategory === null || item.category === selectedCategory
        );
        if (filteredAffirmations.length === 0) return;

        const randomIndex = Math.floor(Math.random() * filteredAffirmations.length);
        setSelectedAffirmationIndex(randomIndex);

        // Scroll to the selected affirmation
        setTimeout(() => {
            scrollViewRef.current.scrollTo({
                y: randomIndex * 150, // Assuming each card is 150 in height, adjust if needed
                animated: true
            });
        }, 100); // Small delay to ensure state update before scrolling
    };

    return (
        <View style={styles.fullScreenContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back-circle-outline" color={COLORS.mindstormBlue} size={48} />
            </TouchableOpacity>
            <ImageBackground
                resizeMode="cover"
                source={IMAGES.gradientbg}
                style={styles.fullScreen}
            >
                <WelcomeTitle title="Affirmations" style={styles.title} />
                <WelcomeMessage message="Think or say an affirmation from below as loud as you can. Hearing it is believing it." style={styles.subheaderText} />

                <View style={styles.topicFilterContainer}>
                    <Text style={styles.topicFilterText}>Topic Filter</Text>
                    <View style={styles.topicRow}>
                        {affirmation_options.map((category) => (
                            <TouchableOpacity key={category} onPress={() => handleSelectCategory(category)}>
                                <View style={[
                                    styles.affirmationContainer,
                                    selectedCategory === category && styles.selectedAffirmationContainer
                                ]}>
                                    <Text style={[
                                        styles.affirmationCategory,
                                        selectedCategory === category && styles.selectedAffirmationText
                                    ]}>{category}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                <View style={styles.spotifyPlayerContainer}>
                    <WebView
                        source={{ uri: 'https://open.spotify.com/embed/track/0ENM2WvAqPr8XJFXlkiuCe?utm_source=generator' }}
                        style={styles.spotifyPlayer}
                    />
                </View>
                <ScrollView ref={scrollViewRef}>



                    {affirmations
                        .filter(item => selectedCategory === null || item.category === selectedCategory)
                        .map((item, index) => (
                            <AffirmationCard
                                key={index}
                                category={item.category}
                                affirmation={item.affirmation}
                                isSelected={selectedAffirmationIndex === index}
                            />
                        ))}

                </ScrollView>
                <View style={[{ display: "flex", flexDirection: "row" }]}>
                    <TouchableOpacity
                        style={styles.continueButton}
                        onPress={handleRoll}
                    >
                        <Text style={styles.continueButtonText}>Roll Random</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.continueButton}
                        onPress={() => handleAddNew()}
                    >
                        <Text style={styles.continueButtonText}>Add New</Text>
                    </TouchableOpacity>
                </View>
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
        borderColor: 'transparent', // Default border color
        borderWidth: 2,
    },
    selectedCardContainer: {
        borderColor: '#7CB6B5', // Border color for selected card
    },
    affirmationContainer: {
        padding: 8,
        marginTop: 8,
        borderRadius: 20,
        backgroundColor: 'white', // Default color
        marginRight: 4,
    },
    selectedAffirmationContainer: {
        backgroundColor: '#7CB6B5',
    },
    affirmationCategory: {
        fontSize: 14,
        color: '#7CB6B5', // Default text color
        fontFamily: 'Inter-Medium',
    },
    selectedAffirmationText: {
        color: 'white',
    },
    cardMessage: {
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        color: COLORS.maintextcolor,
        textAlign: 'center',
        marginTop: 10,
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
        padding: 16,
    },
    continueButtonText: {
        color: COLORS.maintextcolor,
        fontFamily: "Inter-Medium"
    },
    topicFilterContainer: {
        display: 'flex',
        backgroundColor: '#DAEFEF',
        padding: 4,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 4,
    },
    topicFilterText: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        color: COLORS.mindstormLightBlue,
        marginRight: 10,
    },
    topicRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    spotifyPlayerContainer: {
        marginTop: 20,
        marginBottom: 20,
        width: '80%',
        height: 80, // Adjust the height based on your needs

    },
    spotifyPlayer: {
        flex: 1,
    },
});
