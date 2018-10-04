/* @flow */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import color from 'color';

import TouchableRipple from './TouchableRipple';
import Icon from './Icon';
import { withTheme } from '../core/theming';

const IconButton = ({
  icon,
  color: customColor,
  size = 24,
  accessibilityLabel,
  disabled,
  onPress,
  theme,
  style,
  ...rest
}) => {
  const iconColor = typeof customColor !== 'undefined' ? customColor : theme.colors.text;
  const rippleColor = color(iconColor)
    .alpha(0.32)
    .rgb()
    .string();

  return (
    <TouchableRipple
      borderless
      onPress={onPress}
      rippleColor={rippleColor}
      style={[styles.container, disabled && styles.disabled, style]}
      accessibilityLabel={accessibilityLabel}
      accessibilityTraits={disabled ? ['button', 'disabled'] : 'button'}
      accessibilityComponentType="button"
      accessibilityRole="button"
      accessibilityStates={disabled ? ['disabled'] : undefined}
      disabled={disabled}
      hitSlop={
        TouchableRipple.supported
          ? { top: 10, left: 10, bottom: 10, right: 10 }
          : { top: 6, left: 6, bottom: 6, right: 6 }
      }
      {...rest}>
      <View>
        <Icon color={iconColor} source={icon} size={size} />
      </View>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  container: TouchableRipple.supported
    ? {
        height: 28,
        width: 28,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
      }
    : {
        borderRadius: 36 / 2,
        height: 36,
        width: 36,
        margin: 6,
        alignItems: 'center',
        justifyContent: 'center',
      },
  disabled: {
    opacity: 0.32,
  },
});

export default withTheme(IconButton);
