/* @flow */

import  React from 'react';
import { StyleSheet, View } from 'react-native';
import color from 'color';
import Icon from './Icon';
import TouchableRipple from './TouchableRipple';
import { withTheme } from '../core/theming';

class CheckboxIOS extends React.Component {
  static displayName = 'Checkbox.IOS';

  render() {
    const { status, disabled, onPress, theme, ...rest } = this.props;
    const checked = status === 'checked';
    const indeterminate = status === 'indeterminate';

    const checkedColor = disabled ? theme.colors.disabled : this.props.color || theme.colors.accent;

    let rippleColor;

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

    const icon = indeterminate ? 'remove' : 'done';

    return (
      <TouchableRipple
        {...rest}
        borderless
        rippleColor={rippleColor}
        onPress={onPress}
        disabled={disabled}
        accessibilityTraits={disabled ? ['button', 'disabled'] : 'button'}
        accessibilityComponentType="button"
        accessibilityRole="button"
        accessibilityStates={disabled ? ['disabled'] : undefined}
        accessibilityLiveRegion="polite"
        style={styles.container}>
        <View style={{ opacity: indeterminate || checked ? 1 : 0 }}>
          <Icon allowFontScaling={false} source={icon} size={24} color={checkedColor} />
        </View>
      </TouchableRipple>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    padding: 6,
  },
});

export default withTheme(CheckboxIOS);
