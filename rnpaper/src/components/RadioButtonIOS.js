/* @flow */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import color from 'color';
import { RadioButtonContext } from './RadioButtonGroup';
import Icon from './Icon';
import TouchableRipple from './TouchableRipple';
import { withTheme } from '../core/theming';

class RadioButtonIOS extends React.Component {
  static displayName = 'RadioButton.IOS';

  render() {
    return (
      <RadioButtonContext.Consumer>
        {context => {
          const { disabled, onPress, theme, ...rest } = this.props;

          const checkedColor = disabled
            ? theme.colors.disabled
            : this.props.color || theme.colors.accent;

          let rippleColor;

          const checked = context
            ? context.value === this.props.value
            : this.props.status === 'checked';

          if (disabled) {
            rippleColor = color(theme.colors.text)
              .alpha(0.16)
              .rgb()
              .string();
          } else {
            rippleColor = color(checkedColor)
              .fade(0.32)
              .rgb()
              .string();
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
              <View style={{ opacity: checked ? 1 : 0 }}>
                <Icon allowFontScaling={false} source="done" size={24} color={checkedColor} />
              </View>
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
    padding: 6,
  },
});

export default withTheme(RadioButtonIOS);
