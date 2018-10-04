/* @flow */

import color from 'color';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '../Typography/Text';
import { withTheme } from '../../core/theming';

class ListSection extends React.Component {
  static displayName = 'List.Section';

  render() {
    const { children, title, theme, style, ...rest } = this.props;
    const { colors, fonts } = theme;

    const titleColor = color(colors.text)
      .alpha(0.54)
      .rgb()
      .string();
    const fontFamily = fonts.medium;

    return (
      <View {...rest} style={[styles.container, style]}>
        {title && (
          <Text numberOfLines={1} style={[styles.title, { color: titleColor, fontFamily }]}>
            {title}
          </Text>
        )}
        {children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  title: {
    marginVertical: 13,
    marginHorizontal: 16,
  },
});

export default withTheme(ListSection);
