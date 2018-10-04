import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import color from 'color';

import Text from '../Typography/Text';

import { withTheme } from '../../core/theming';
import { black } from '../../styles/colors';

class AppbarContent extends React.Component {
  static displayName = 'Appbar.Content';

  render() {
    const {
      color: titleColor = black,
      subtitle,
      subtitleStyle,
      style,
      titleStyle,
      theme,
      title,
    } = this.props;
    const { fonts } = theme;

    const subtitleColor = color(titleColor)
      .alpha(0.7)
      .rgb()
      .string();

    return (
      <View style={[styles.container, style]}>
        <Text
          style={[
            {
              color: titleColor,
              fontFamily: Platform.OS === 'ios' ? fonts.regular : fonts.medium,
            },
            styles.title,
            titleStyle,
          ]}
          numberOfLines={1}
          accessibilityTraits="header"
          accessibilityRole="header">
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={[styles.subtitle, { color: subtitleColor }, subtitleStyle]}
            numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: Platform.OS === 'ios' ? 17 : 20,
  },
  subtitle: {
    fontSize: Platform.OS === 'ios' ? 11 : 14,
  },
});

export default withTheme(AppbarContent);
