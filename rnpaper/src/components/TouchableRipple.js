/* @flow */

import React from 'react';
import { TouchableNativeFeedback, TouchableHighlight, Platform, View } from 'react-native';
import color from 'color';
import { withTheme } from '../core/theming';

const ANDROID_VERSION_LOLLIPOP = 21;

class TouchableRipple extends React.Component {
  static defaultProps = {
    borderless: false,
  };

  static supported = Platform.OS === 'android' && Platform.Version >= ANDROID_VERSION_LOLLIPOP;

  render() {
    const {
      style,
      background,
      borderless,
      disabled: disabledProp,
      rippleColor,
      underlayColor,
      children,
      theme,
      ...rest
    } = this.props;

    const { dark, colors } = theme;
    const disabled = disabledProp || !this.props.onPress;
    const calculatedRippleColor =
      rippleColor ||
      color(colors.text)
        .alpha(dark ? 0.32 : 0.2)
        .rgb()
        .string();

    if (TouchableRipple.supported) {
      return (
        <TouchableNativeFeedback
          {...rest}
          disabled={disabled}
          background={
            background != null
              ? background
              : TouchableNativeFeedback.Ripple(calculatedRippleColor, borderless)
          }>
          <View style={style}>{React.Children.only(children)}</View>
        </TouchableNativeFeedback>
      );
    }

    return (
      /* $FlowFixMe */
      <TouchableHighlight
        {...rest}
        disabled={disabled}
        style={style}
        underlayColor={
          underlayColor != null
            ? underlayColor
            : color(calculatedRippleColor)
                .fade(0.5)
                .rgb()
                .string()
        }>
        {React.Children.only(children)}
      </TouchableHighlight>
    );
  }
}

export default withTheme(TouchableRipple);
