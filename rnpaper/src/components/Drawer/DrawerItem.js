import React from 'react';
import color from 'color';

import { View, StyleSheet } from 'react-native';
import Text from '../Typography/Text';
import Icon from '../Icon';
import TouchableRipple from '../TouchableRipple';
import { withTheme } from '../../core/theming';

class DrawerItem extends React.Component {
  static displayName = 'Drawer.Item';

  render() {
    const { icon, label, active, theme, style, onPress, ...rest } = this.props;
    const { colors, roundness } = theme;
    const backgroundColor = active
      ? color(colors.primary)
          .alpha(0.12)
          .rgb()
          .string()
      : 'transparent';
    const contentColor = active
      ? colors.primary
      : color(colors.text)
          .alpha(0.68)
          .rgb()
          .string();
    const fontFamily = theme.fonts.medium;
    const labelMargin = icon ? 32 : 0;

    return (
      <View
        {...rest}
        style={[styles.container, { backgroundColor, borderRadius: roundness }, style]}>
        <TouchableRipple
          borderless
          delayPressIn={0}
          onPress={onPress}
          style={{ borderRadius: roundness }}
          accessibilityTraits={active ? ['button', 'selected'] : 'button'}
          accessibilityComponentType="button"
          accessibilityRole="button"
          accessibilityStates={active ? ['selected'] : undefined}>
          <View style={styles.wrapper}>
            {icon ? <Icon source={icon} size={24} color={contentColor} /> : null}
            <Text
              numberOfLines={1}
              style={[
                styles.label,
                {
                  color: contentColor,
                  fontFamily,
                  marginLeft: labelMargin,
                },
              ]}>
              {label}
            </Text>
          </View>
        </TouchableRipple>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginVertical: 4,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  label: {
    marginRight: 32,
  },
});

export default withTheme(DrawerItem);
