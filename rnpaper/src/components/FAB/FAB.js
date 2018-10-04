/* @flow */

import color from 'color';
import React from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import FABGroup from './FABGroup';
import Surface from '../Surface';
import CrossFadeIcon from '../CrossFadeIcon';
import Text from '../Typography/Text';
import TouchableRipple from '../TouchableRipple';
import { black, white } from '../../styles/colors';
import { withTheme } from '../../core/theming';

const AnimatedSurface = Animated.createAnimatedComponent(Surface);

class FAB extends React.Component {
  // @component ./FABGroup.js
  static Group = FABGroup;

  render() {
    const {
      small,
      icon,
      label,
      accessibilityLabel = label,
      color: customColor,
      disabled,
      onPress,
      theme,
      style,
      ...rest
    } = this.props;

    const disabledColor = color(theme.dark ? white : black)
      .alpha(0.12)
      .rgb()
      .string();

    const { backgroundColor = disabled ? disabledColor : theme.colors.accent } =
      StyleSheet.flatten(style) || {};

    let foregroundColor;

    if (typeof customColor !== 'undefined') {
      foregroundColor = customColor;
    } else if (disabled) {
      foregroundColor = color(theme.dark ? white : black)
        .alpha(0.32)
        .rgb()
        .string();
    } else {
      foregroundColor = !color(backgroundColor).light() ? white : 'rgba(0, 0, 0, .54)';
    }

    const rippleColor = color(foregroundColor)
      .alpha(0.32)
      .rgb()
      .string();

    return (
      <AnimatedSurface
        {...rest}
        style={[{ backgroundColor }, styles.container, disabled && styles.disabled, style]}>
        <TouchableRipple
          borderless
          onPress={onPress}
          rippleColor={rippleColor}
          disabled={disabled}
          accessibilityLabel={accessibilityLabel}
          accessibilityTraits={disabled ? ['button', 'disabled'] : 'button'}
          accessibilityComponentType="button"
          accessibilityRole="button"
          accessibilityStates={disabled ? ['disabled'] : undefined}
          style={styles.touchable}>
          <View
            style={[
              styles.content,
              label ? styles.extended : small ? styles.small : styles.standard,
            ]}
            pointerEvents="none">
            <CrossFadeIcon source={icon} size={24} color={foregroundColor} />
            {label ? (
              <Text
                style={[styles.label, { color: foregroundColor, fontFamily: theme.fonts.medium }]}>
                {label.toUpperCase()}
              </Text>
            ) : null}
          </View>
        </TouchableRipple>
      </AnimatedSurface>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 28,
    elevation: 6,
  },
  touchable: {
    borderRadius: 28,
  },
  standard: {
    height: 56,
    width: 56,
  },
  small: {
    height: 40,
    width: 40,
  },
  extended: {
    height: 48,
    paddingHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginHorizontal: 8,
  },
  disabled: {
    elevation: 0,
  },
});

export default withTheme(FAB);
