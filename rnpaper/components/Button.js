/* @flow */

import  React from 'react';
import { ActivityIndicator, Animated, View, StyleSheet } from 'react-native';
import color from 'color';
import Icon from './Icon';
import Surface from './Surface';
import Text from './Typography/Text';
import TouchableRipple from './TouchableRipple';
import { black, white } from '../styles/colors';
import { withTheme } from '../core/theming';
const AnimatedSurface = Animated.createAnimatedComponent(Surface);

class Button extends React.Component {
  static defaultProps = {
    mode: 'text',
  };

  state = {
    elevation: new Animated.Value(this.props.mode === 'contained' ? 2 : 0),
  };

  _handlePressIn = () => {
    if (this.props.mode === 'contained') {
      Animated.timing(this.state.elevation, {
        toValue: 8,
        duration: 200,
      }).start();
    }
  };

  _handlePressOut = () => {
    if (this.props.mode === 'contained') {
      Animated.timing(this.state.elevation, {
        toValue: 2,
        duration: 150,
      }).start();
    }
  };

  render() {
    const {
      disabled,
      compact,
      mode,
      dark,
      loading,
      icon,
      color: buttonColor,
      children,
      accessibilityLabel,
      onPress,
      style,
      theme,
      ...rest
    } = this.props;
    const { colors, roundness } = theme;
    const fontFamily = theme.fonts.medium;

    let backgroundColor, borderColor, textColor, borderWidth;

    if (mode === 'contained') {
      if (disabled) {
        backgroundColor = color(theme.dark ? white : black)
          .alpha(0.12)
          .rgb()
          .string();
      } else if (buttonColor) {
        backgroundColor = buttonColor;
      } else {
        backgroundColor = colors.primary;
      }
    } else {
      backgroundColor = 'transparent';
    }

    if (mode === 'outlined') {
      borderColor = color(theme.dark ? white : black)
        .alpha(0.29)
        .rgb()
        .string();
      borderWidth = StyleSheet.hairlineWidth;
    } else {
      borderColor = 'transparent';
      borderWidth = 0;
    }

    if (disabled) {
      textColor = color(theme.dark ? white : black)
        .alpha(0.32)
        .rgb()
        .string();
    } else if (mode === 'contained') {
      let isDark;

      if (typeof dark === 'boolean') {
        isDark = dark;
      } else {
        isDark = backgroundColor === 'transparent' ? false : !color(backgroundColor).light();
      }

      textColor = isDark ? white : black;
    } else if (buttonColor) {
      textColor = buttonColor;
    } else {
      textColor = colors.primary;
    }

    const rippleColor = color(textColor)
      .alpha(0.32)
      .rgb()
      .string();
    const buttonStyle = {
      backgroundColor,
      borderColor,
      borderWidth,
      borderRadius: roundness,
    };
    const touchableStyle = { borderRadius: roundness };
    const textStyle = { color: textColor, fontFamily };
    const elevation = disabled ? 0 : this.state.elevation;

    return (
      <AnimatedSurface
        {...rest}
        style={[styles.button, compact && styles.compact, { elevation }, buttonStyle, style]}>
        <TouchableRipple
          borderless
          delayPressIn={0}
          onPress={onPress}
          onPressIn={this._handlePressIn}
          onPressOut={this._handlePressOut}
          accessibilityLabel={accessibilityLabel}
          accessibilityTraits={disabled ? ['button', 'disabled'] : 'button'}
          accessibilityComponentType="button"
          accessibilityRole="button"
          accessibilityStates={disabled ? ['disabled'] : undefined}
          disabled={disabled}
          rippleColor={rippleColor}
          style={touchableStyle}>
          <View style={styles.content}>
            {icon && loading !== true ? (
              <View style={styles.icon}>
                <Icon source={icon} size={16} color={textColor} />
              </View>
            ) : null}
            {loading ? (
              <ActivityIndicator size="small" color={textColor} style={styles.icon} />
            ) : null}
            <Text
              numberOfLines={1}
              style={[styles.label, compact && styles.compactLabel, textStyle, { fontFamily }]}>
              {React.Children.map(
                children,
                child => (typeof child === 'string' ? child.toUpperCase() : child)
              )}
            </Text>
          </View>
        </TouchableRipple>
      </AnimatedSurface>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    minWidth: 88,
    borderStyle: 'solid',
  },
  compact: {
    minWidth: 64,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 16,
    marginLeft: 12,
    marginRight: -4,
  },
  label: {
    textAlign: 'center',
    letterSpacing: 1,
    marginVertical: 9,
    marginHorizontal: 16,
  },
  compactLabel: {
    marginHorizontal: 8,
  },
});

export default withTheme(Button);
