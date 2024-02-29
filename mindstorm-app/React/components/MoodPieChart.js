import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Svg, Path, Circle } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withSpring, Easing } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const size = width - 48; // Pie chart size
const strokeWidth = 2;
const radius = (size - strokeWidth * 2) / 2; // Pie chart radius
const circumference = radius * 2 * Math.PI;

// Define mood states with their corresponding segments
const moodStates = {
  happy: 0,
  sad: 0.25,
  calm: 0.5,
  energetic: 0.75,
  stressed: 1,
};

// Function to calculate the SVG path for a pie chart segment
const makePieSegment = (startPercent, endPercent) => {
  const start = polarToCartesian(startPercent);
  const end = polarToCartesian(endPercent);
  const largeArcFlag = endPercent - startPercent <= 0.5 ? '0' : '1';

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
};

// Function to convert polar coordinates to cartesian for SVG paths
const polarToCartesian = (anglePercent) => {
  const angle = Math.PI * (2 * anglePercent - 0.5); // Offset by -90 degrees
  return {
    x: Math.cos(angle) * radius + size / 2,
    y: Math.sin(angle) * radius + size / 2,
  };
};

// Custom Animated Path using react-native-reanimated
const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function MoodPieChart() {
  const mood = 'calm'; // Set the initial mood here
  const dialAngle = useSharedValue(moodStates[mood]);

  useEffect(() => {
    // Animate the dial to the mood's position when mood changes
    dialAngle.value = withSpring(moodStates[mood], {
      damping: 10,
      stiffness: 100,
      restSpeedThreshold: 0.001,
      restDisplacementThreshold: 0.001,
      easing: Easing.out(Easing.ease),
    });
  }, [mood, dialAngle]);

  const animatedProps = useAnimatedProps(() => {
    const dialEnd = polarToCartesian(dialAngle.value);
    return {
      d: `M ${size / 2} ${size / 2} L ${dialEnd.x} ${dialEnd.y}`,
    };
  });

  return (
    <View style={styles.container}>
      <Svg width={size} height={size / 2}>
        {/* Pie chart segments */}
        <Path d={makePieSegment(0, 0.2)} fill="#fdd835" />
        <Path d={makePieSegment(0.2, 0.4)} fill="#f44336" />
        <Path d={makePieSegment(0.4, 0.6)} fill="#4caf50" />
        <Path d={makePieSegment(0.6, 0.8)} fill="#2196f3" />
        <Path d={makePieSegment(0.8, 1)} fill="#9c27b0" />
        {/* Dial */}
        <AnimatedPath
          animatedProps={animatedProps}
          stroke="#fff"
          strokeWidth={strokeWidth}
        />
        {/* Center circle */}
        <Circle cx={size / 2} cy={size / 2} r={strokeWidth} fill="#fff" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
