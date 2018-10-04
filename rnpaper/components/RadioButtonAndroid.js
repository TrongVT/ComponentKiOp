/* @flow */

import React from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import color from 'color';
import { RadioButtonContext } from './RadioButtonGroup';
import TouchableRipple from './TouchableRipple';
import { withTheme } from '../core/theming';

const BORDER_WIDTH = 2;

class RadioButtonAndroid extends React.Component {
  static displayName = 'RadioButton.Android';

  state = {
    borderAnim: new Animated.Value(BORDER_WIDTH),
    radioAnim: new Animated.Value(1),
  };

  componentDidUpdate(prevProps) {
    if (prevProps.status === this.props.status) {
      return;
    }

    if (this.props.status === 'checked') {
      this.state.radioAnim.setValue(1.2);

      Animated.timing(this.state.radioAnim, {
        toValue: 1,
        duration: 150,
      }).start();
    } else {
      this.state.borderAnim.setValue(10);

      Animated.timing(this.state.borderAnim, {
        toValue: BORDER_WIDTH,
        duration: 150,
      }).start();
    }
  }

  render() {
    return (
      <RadioButtonContext.Consumer>
        {context => {
          const { disabled, onPress, theme, ...rest } = this.props;
          const checkedColor = this.props.color || theme.colors.accent;
          const uncheckedColor =
            this.props.uncheckedColor ||
            color(theme.colors.text)
              .alpha(theme.dark ? 0.7 : 0.54)
              .rgb()
              .string();

          let rippleColor, radioColor;

          const checked = context
            ? context.value === this.props.value
            : this.props.status === 'checked';

          if (disabled) {
            rippleColor = color(theme.colors.text)
              .alpha(0.16)
              .rgb()
              .string();
            radioColor = theme.colors.disabled;
          } else {
            rippleColor = color(checkedColor)
              .fade(0.32)
              .rgb()
              .string();
            radioColor = checked ? checkedColor : uncheckedColor;
          }

          return (
            <TouchableRipple
              {...rest}
              borderless
              rippleColor={rippleColor}
              onPress={
                disabled
                  ? undefined
                  : () => {
                      context && context.onValueChange(this.props.value);
                      onPress && onPress();
                    }
              }
              accessibilityTraits={disabled ? ['button', 'disabled'] : 'button'}
              accessibilityComponentType={checked ? 'radiobutton_checked' : 'radiobutton_unchecked'}
              accessibilityRole="button"
              accessibilityStates={disabled ? ['disabled'] : undefined}
              accessibilityLiveRegion="polite"
              style={styles.container}>
              <Animated.View
                style={[
                  styles.radio,
                  {
                    borderColor: radioColor,
                    borderWidth: this.state.borderAnim,
                  },
                ]}>
                {checked ? (
                  <View style={[StyleSheet.absoluteFill, styles.radioContainer]}>
                    <Animated.View
                      style={[
                        styles.dot,
                        {
                          backgroundColor: radioColor,
                          transform: [{ scale: this.state.radioAnim }],
                        },
                      ]}
                    />
                  </View>
                ) : null}
              </Animated.View>
            </TouchableRipple>
          );
        }}
      </RadioButtonContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
  },
  radioContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    margin: 8,
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
  },
});

export default withTheme(RadioButtonAndroid);
