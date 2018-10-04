/* @flow */

import  React from 'react';
import color from 'color';
import { StyleSheet, View } from 'react-native';
import { withTheme } from '../core/theming';
import { black, white } from '../styles/colors';

class Divider extends React.Component {
  render() {
    const { inset, style, theme, ...rest } = this.props;
    const { dark: isDarkTheme } = theme;
    return (
      <View
        {...rest}
        style={[isDarkTheme ? styles.dark : styles.light, inset && styles.inset, style]}
      />
    );
  }
}

const styles = StyleSheet.create({
  light: {
    backgroundColor: color(black)
      .alpha(0.12)
      .rgb()
      .string(),
    height: StyleSheet.hairlineWidth,
  },
  dark: {
    backgroundColor: color(white)
      .alpha(0.12)
      .rgb()
      .string(),
    height: StyleSheet.hairlineWidth,
  },
  inset: {
    marginLeft: 72,
  },
});

export default withTheme(Divider);
