import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { COLORS, IMAGES } from '../../styles/globalStyles';

export default function PieChart({ size, sections }) {
  const radius = size / 2;

  // Function to calculate the path for a section
  const getPath = (percentage, startAngle) => {
    const endAngle = startAngle + (percentage / 100) * 360;
    const largeArcFlag = percentage > 50 ? 1 : 0;
    const startX = size / 2 + radius * Math.cos((startAngle * Math.PI) / 180);
    const startY = size / 2 + radius * Math.sin((startAngle * Math.PI) / 180);
    const endX = size / 2 + radius * Math.cos((endAngle * Math.PI) / 180);
    const endY = size / 2 + radius * Math.sin((endAngle * Math.PI) / 180);
    return `M${size / 2},${size / 2} L${startX},${startY} A${radius},${radius} 0 ${largeArcFlag},1 ${endX},${endY} Z`;
  };

  // Function to calculate the start angle for each section
  const getStartAngle = (index) => {
    const prevPercentages = sections.slice(0, index).reduce((acc, section) => acc + section.percentage, 0);
    return (prevPercentages / 100) * 360;
  };

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {sections.map((section, index) => (
          <Path
            key={index}
            fill={section.color}
            d={getPath(section.percentage, getStartAngle(index))}
          />
        ))}
      </Svg>
      <View style={styles.legendContainer}>
        {sections.map((section, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: section.color }]} />
            <Text style={styles.legendLabel}>
              {section.label} ({section.percentage}%)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  legendContainer: {
    marginTop: 20,
    alignItems: 'flex-start',
    padding: 5,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendColor: {
    width: 20,
    height: 20,
    marginRight: 10,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 16,
    color: COLORS.mindstormGrey,
    textAlign: 'left',
  },
});