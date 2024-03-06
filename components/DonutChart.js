import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Svg, Path } from 'react-native-svg';

export default function DonutChart({ size, strokeWidth, sections }){
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Function to calculate the stroke dash array for a section
  const getStrokeDasharray = (percentage) => {
    const sectionLength = (percentage / 100) * circumference;
    return `${sectionLength} ${circumference - sectionLength}`;
  };

  // Function to calculate the rotation for a section
  const getRotation = (index, sections) => {
    const totalPercentage = sections.slice(0, index).reduce((acc, { percentage }) => acc + percentage, 0);
    return (totalPercentage / 100) * 360;
  };

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}  fill="none">
        {sections.map((section, index) => (
          <Path
            key={index}
            stroke={section.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={getStrokeDasharray(section.percentage)}
            d={`M${size / 2},${strokeWidth / 2}
               A${radius},${radius} 0 ${section.percentage > 50 ? 1 : 0},1 ${size / 2},${size - strokeWidth / 2}`}
            transform={`rotate(${getRotation(index, sections)}, ${size / 2}, ${size / 2})`}
          />
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
