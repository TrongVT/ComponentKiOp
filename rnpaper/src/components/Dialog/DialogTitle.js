/* @flow */

import React from 'react';
import { StyleSheet } from 'react-native';
import Title from '../Typography/Title';
import { withTheme } from '../../core/theming';

class DialogTitle extends React.Component {
  static displayName = 'Dialog.Title';

  render() {
    const { children, theme, style, ...rest } = this.props;

    return (
      <Title
        accessibilityTraits="header"
        accessibilityRole="header"
        style={[styles.text, { color: theme.colors.text }, style]}
        {...rest}>
        {children}
      </Title>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    marginTop: 22,
    marginBottom: 18,
    marginHorizontal: 24,
  },
});

export default withTheme(DialogTitle);
