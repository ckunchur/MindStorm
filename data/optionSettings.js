export const buddies = [
    {
        "id": "lyra",
        "name": "Lyra",
        "speciality": "Stress/Anxiety",
        "image": require("../assets/lyra.png"),
        "chooseBackground": require("../assets/choose-lyra-background.png"),
        "chatBackground": require("../assets/chat-lyra-background.png"),

        "lightColor": "#4A9BB4",
        "darkColor": "#1F7D9B",
        "text": "Word vomit, rant - Lyra has you covered. I can work through your chaos and give you a gentle actionable plan to help you feel better ASAP!",
    },
    {
        "id": "nimbus",
        "name": "Nimbus",
        "speciality": "Productivity",
        "image": require("../assets/nimbus.png"),
        "chooseBackground": require("../assets/choose-nimbus-background.png"),
        "chatBackground": require("../assets/chat-nimbus-background.png"),
        "lightColor": "#7887DA",
        "darkColor": "#4D64E4",
        "text": "Stuck in a rut? Need help breaking your tasks into bit-size chunks? Nimbus is here to help!"
    }
];

export const goalOptions = [
    { key: "reduceAnxiety", title: "Reduce anxiety"},
    { key: "mindfulness", title: "Practice mindfulness"},
    { key: "productivity", title: "Boost productivity"},
    { key: "gratitude", title: "Practice gratitude"},
  ];

export const weather_moods = {
    "Stormy": require("../assets/stormy-mood.png"),
    "Rainy": require("../assets/rainy-mood.png"),
    "Cloudy": require("../assets/cloudy-mood.png"),
    "Partly Cloudy": require("../assets/partial-cloudy-mood.png"),
    "Cloudy": require("../assets/cloudy-mood.png"),
    "Sunny": require("../assets/sunny-mood.png"),
}

export const genders = ['Female', 'Male', 'Non-binary'];
export const ageGroups = [
  '18-23',
  '24-34',
  '35-44',
  '45-64',
  '65+'
];


export const toneOptions = [
    { label: "Therapist", value: "strict" },
    { label: "Best Friend", value: "comforting" },
    { label: "Mentor", value: "logical" }
];
export const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
];
export const ageOptions = [
    { label: "Teenager", value: "teen" },
    { label: "Young Adult", value: "young" },
    { label: "Adult", value: "adult" },
];
export const memoryOptions = [
    { label: "Forget", value: "forget" },
    { label: "Remember", value: "remember" },
];
