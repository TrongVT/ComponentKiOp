/* @flow */
import React from 'react';

import { Switch as NativeSwitch, Platform } from 'react-native';
import setColor from 'color';
import { withTheme } from '../core/theming';
import { grey400, grey800, grey50, white, black } from '../styles/colors';

class Switch extends React.Component {
  render() {
    const { value, disabled, onValueChange, color, theme, ...props } = this.props;

    const checkedColor = color || theme.colors.accent;

    const trackTintColor =
      Platform.OS === 'ios'
        ? checkedColor
        : disabled
          ? theme.dark
            ? setColor(white)
                .alpha(0.1)
                .rgb()
                .string()
            : setColor(black)
                .alpha(0.12)
                .rgb()
                .string()
          : setColor(checkedColor)
              .alpha(0.5)
              .rgb()
              .string();

    const thumbTintColor =
      Platform.OS === 'ios'
        ? undefined
        : disabled
          ? theme.dark
            ? grey800
            : grey400
          : value
            ? checkedColor
            : theme.dark
              ? grey400
              : grey50;

    return (
      <NativeSwitch
        {...props}
        value={value}
        disabled={disabled}
        onTintColor={trackTintColor}
        thumbTintColor={thumbTintColor}
        onValueChange={disabled ? undefined : onValueChange}
      />
    );
  }
}

export default withTheme(Switch);
