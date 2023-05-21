import React from 'react';
import { Animated, Dimensions, FlatList, StyleSheet } from 'react-native';
import { Extrapolate, interpolate, interpolateColor, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const pages = [
  { key: '1', color: '#ffadad' },
  { key: '2', color: '#ffd6a5' },
  { key: '3', color: '#fdffb6' },
  { key: '4', color: '#caffbf' },
];

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const App = () => {
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  return (
    <AnimatedFlatList
      data={pages}
      keyExtractor={(item: any) => item.key}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      renderItem={({ item, index }) => {
        const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
        const translateY = scrollX.value;
        const translateInputRange = [(index - 1) * width, index * width, (index + 1) * width];
        const translateOutputRange = [height / 2, 0, -height / 2];

        const animatedStyle = useAnimatedStyle(() => {
          const backgroundColor = interpolateColor(scrollX.value, inputRange, [pages[index - 1]?.color || item.color, item.color, pages[index + 1]?.color || item.color]);
          const translateY = interpolate(translateY, translateInputRange, translateOutputRange, Extrapolate.CLAMP);
          return {
            backgroundColor,
            transform: [{ translateY }],
          };
        });

        return (
          <Animated.View style={[styles.page, { backgroundColor: item.color }, animatedStyle]}>
            <Animated.Text style={[styles.text, { transform: [{ translateY }] }]}>Page {item.key}</Animated.Text>
          </Animated.View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  page: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 32,
    color: '#fff',
  },
});

export default App;
