
import React from 'react';
import { View, StyleSheet } from 'react-native';
import shadow from '../styles/shadow';
import { withTheme } from '../core/theming';
import Colors from '../styles/colors';

class Surface extends React.Component {
  render() {
    const { style, theme, ...rest } = this.props;
    const flattenedStyles = StyleSheet.flatten(style) || {};
    const { elevation } = flattenedStyles;

    return (
      <View
        {...rest}
        style={[
          styles.surface,
          { backgroundColor: theme.colors.surface },
          elevation && shadow(elevation),
          style,
        ]}
      />
    );
  }
}

export default withTheme(Surface);

const styles = StyleSheet.create({
  surface: {
    backgroundColor: Colors.white,
  },
});
