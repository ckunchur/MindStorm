import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Image, ImageBackground, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGlobalFonts } from '../styles/globalFonts';
import { COLORS, IMAGES } from '../styles/globalStyles';
import { useUser } from "../contexts/UserContext";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const islands = Array(4).fill(require("../assets/mountain.png")); // Replace 10 with the number of images you want to display
const weather_moods = {
    "sunny": require("../assets/sunny-button.png"),
    "partial": require("../assets/partially-cloudy-button.png"),
    "cloudy": require("../assets/cloudy-button.png"),
    "rainy": require("../assets/rainy-button.png"),
    "stormy": require("../assets/stormy-button.png"),
};
const island_topics = {
    "Relationships": { image: require("../assets/mountain.png"), mood: "sunny" },
    "Career": { image: require("../assets/mountain.png"), mood: "partial" },
    "School": { image: require("../assets/mountain.png"), mood: "cloudy" },
    "Self-Love": { image: require("../assets/mountain.png"), mood: "rainy" },
};

const islandData = Object.keys(island_topics).map(key => ({
    key,
    image: island_topics[key].image,
    mood: island_topics[key].mood
}));

const WelcomeTitle = ({ title, style }) => <Text style={[styles.titleText, style]}>{title}</Text>;
const WelcomeMessage = ({ message, style }) => <Text style={[styles.messageText, style]}>{message}</Text>;

export default function EmotionIsland({ navigation }) {
    const [selectedTopic, setSelectedTopic] = useState('Career');
    const fontsLoaded = useGlobalFonts();
    if (!fontsLoaded) {
        return null;
    }

    const { userId } = useUser(); // pulled from global state

    const handleViewRecap = () => {
        navigation.navigate('TopicRecap');
    };

    const handleBeginSession = () => {
        if (selectedTopic) {
            navigation.navigate('ChatScreen', { bot: 'Lyra'});
        }
    };

    const handleSelectTopic = (topic) => {
        setSelectedTopic(topic);
    };

    return (
        <View style={styles.fullScreenContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back-circle-outline" color={COLORS.secondarytextcolor} size={48} />
            </TouchableOpacity>
            <ImageBackground
                resizeMode="cover"
                source={IMAGES.islandbg}
                style={styles.fullScreen}
            >
                <WelcomeTitle title="Your Mind Map" style={styles.title} />
                <WelcomeMessage message="Tap a topic to start a targeted session." style={styles.subheaderText} />

                <View style={styles.moodFilterContainer}>
                    <Text style={styles.moodFilterText}>Mood Filter</Text>
                    <View style={styles.weatherRow}>
                        {Object.keys(weather_moods).map((mood) => (
                            <TouchableOpacity key={mood}>
                                <Image
                                    source={weather_moods[mood]}
                                    style={styles.weatherIcon}
                                    alt={`${mood} button`}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.flatListWrapper}>
                    <FlatList
                        data={islandData}
                        renderItem={({ item }) =>
                            <TouchableOpacity onPress={() => handleSelectTopic(item.key)}>
                                <View style={styles.islandItem}>
                                    <Image source={item.image} style={styles.islandImage} />
                                    <Image source={weather_moods[item.mood]} style={styles.overlayIcon} />
                                    <Text style={[
                                        styles.islandText,
                                        selectedTopic === item.key && styles.selectedIslandText
                                    ]}>{item.key}</Text>
                                </View>
                            </TouchableOpacity>
                        }
                        keyExtractor={(item) => item.key}
                        numColumns={2}
                        contentContainerStyle={styles.islandContainer}
                    />
                </View>
                <Image
                    source={require("../assets/add-island.png")}
                    style={styles.islandImage}

                />
                <View style={[{ display: "flex", flexDirection: "row" }]}>
                    <TouchableOpacity
                        style={[
                            styles.continueButton,
                            !selectedTopic && styles.disabledButton
                        ]}
                        onPress={handleBeginSession}
                        disabled={!selectedTopic}
                    >
                        <Text style={styles.continueButtonText}>Begin {selectedTopic} Session</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.continueButton,
                            !selectedTopic && styles.disabledButton
                        ]}
                        onPress={handleViewRecap}
                        disabled={!selectedTopic}
                    >
                        <Text style={styles.continueButtonText}>Recap Topic</Text>
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
        marginTop: 100,
    },
    messageText: {
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        color: COLORS.maintextcolor,
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    moodFilterContainer: {
        backgroundColor: '#DAEFEF',
        padding: 4,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 4,
    },
    moodFilterText: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        color: COLORS.mindstormLightBlue,
        marginRight: 10,
    },
    islandItem: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        marginLeft: 48,
        marginRight: 48,

    },
    islandText: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        color: COLORS.mindstormLightBlue,
        paddingHorizontal: 10,
    },
    selectedIslandText: {
        borderColor: COLORS.mindstormLightBlue,
        borderWidth: 2,
        borderRadius: 10,
    },
    weatherRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    weatherIcon: {
        marginHorizontal: 5,
        width: 30, // Adjust size as needed
        height: 30, // Adjust size as needed
    },
    flatListWrapper: {
        marginTop: 30,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    islandImage: {
        width: 100, // Adjust size as needed
        height: 100, // Adjust size as needed
        borderRadius: 50,
    },
    overlayIcon: {
        position: 'absolute',
        width: 50,
        height: 50,
        opacity: 0.7, // Adjust transparency
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
        margin: 20,
        padding: 16,
        fontSize: 16,
        fontWeight: "700",
        fontFamily: "Inter-Regular",
    },
    disabledButton: {
        backgroundColor: '#cccccc',
        borderColor: '#cccccc',
    },
    continueButtonText: {
        color: COLORS.maintextcolor,
        fontFamily: "Inter-Medium"
    },
});
