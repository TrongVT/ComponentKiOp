/* @flow */

import React from 'react';
import { Image, Text, StyleSheet, I18nManager } from 'react-native';
let MaterialIcons;

try {
  MaterialIcons = require('react-native-vector-icons/MaterialIcons').default;
} catch (e) {
  MaterialIcons = ({ name, color, size, ...rest }) => {
    console.warn(
      `Tried to use the icon '${name}' in a component from 'react-native-paper/src', but 'react-native-vector-icons' is not installed. To remove this warning, install 'react-native-vector-icons' or use another method to specify icon: https://callstack.github.io/react-native-paper/icons.html.`
    );

    return (
      <Text {...rest} style={[styles.icon, { color, fontSize: size }]} pointerEvents="none">
        □
      </Text>
    );
  };
}

const isImageSource = source =>
  (typeof source === 'object' &&
    source !== null &&
    (Object.prototype.hasOwnProperty.call(source, 'uri') && typeof source.uri === 'string')) ||
  typeof source === 'number';

const getIconId = source => {
  if (
    typeof source === 'object' &&
    source !== null &&
    (Object.prototype.hasOwnProperty.call(source, 'uri') && typeof source.uri === 'string')
  ) {
    return source.uri;
  }

  return source;
};

export const isValidIcon = source => typeof source === 'string' || isImageSource(source);

export const isEqualIcon = (a, b) => a === b || getIconId(a) === getIconId(b);

const Icon = ({ source, color, size, ...rest }) => {
  const direction =
    typeof source === 'object' && source.direction && source.source
      ? source.direction === 'auto'
        ? I18nManager.isRTL
          ? 'rtl'
          : 'ltr'
        : source.direction
      : null;
  const s =
    typeof source === 'object' && source.direction && source.source ? source.source : source;

  if (typeof s === 'string') {
    return (
      <MaterialIcons
        {...rest}
        name={s}
        color={color}
        size={size}
        style={[
          {
            transform: [{ scaleX: direction === 'rtl' ? -1 : 1 }],
          },
          styles.icon,
        ]}
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
    );
  } else if (isImageSource(s)) {
    return (
      <Image
        {...rest}
        source={s}
        style={[
          {
            transform: [{ scaleX: direction === 'rtl' ? -1 : 1 }],
          },
          {
            width: size,
            height: size,
            tintColor: color,
            resizeMode: 'contain',
          },
        ]}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
    );
  } else if (typeof s === 'function') {
    return s({ color, size });
  }

  return null;
};

export default Icon;

const styles = StyleSheet.create({
  icon: {
    backgroundColor: 'transparent',
  },
});
