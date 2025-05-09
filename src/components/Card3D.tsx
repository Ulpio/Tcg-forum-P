import React from 'react';
import { StyleSheet, Image } from 'react-native';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

const Card3D = () => {
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      rotateX.value = event.translationY / 10;
      rotateY.value = -event.translationX / 10;
    },
    onEnd: () => {
      rotateX.value = 0;
      rotateY.value = 0;
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 1000 },
        { rotateX: `${rotateX.value}deg` },
        { rotateY: `${rotateY.value}deg` },
      ],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.cardContainer, animatedStyle]}>
        <Image
          source={{ uri: 'https://images.pokemontcg.io/base1/4_hires.png' }}
          style={styles.card}
        />
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 220,
    height: 310,
    borderRadius: 12,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
});

export default Card3D;
