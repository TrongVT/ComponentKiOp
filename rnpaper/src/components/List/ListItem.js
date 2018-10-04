/* @flow */

import color from 'color';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import TouchableRipple from '../TouchableRipple';
import Text from '../Typography/Text';
import { withTheme } from '../../core/theming';

class ListItem extends React.Component {
  static displayName = 'List.Item';

  render() {
    const { left, right, title, description, onPress, theme, style, ...rest } = this.props;
    const titleColor = color(theme.colors.text)
      .alpha(0.87)
      .rgb()
      .string();
    const descriptionColor = color(theme.colors.text)
      .alpha(0.54)
      .rgb()
      .string();

    return (
      <TouchableRipple {...rest} style={[styles.container, style]} onPress={onPress}>
        <View style={styles.row}>
          {left ? left({ color: descriptionColor }) : null}
          <View style={[styles.item, styles.content]} pointerEvents="none">
            <Text numberOfLines={1} style={[styles.title, { color: titleColor }]}>
              {title}
            </Text>
            {description ? (
              <Text
                numberOfLines={2}
                style={[
                  styles.description,
                  {
                    color: descriptionColor,
                  },
                ]}>
                {description}
              </Text>
            ) : null}
          </View>
          {right ? right({ color: descriptionColor }) : null}
        </View>
      </TouchableRipple>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  row: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 16,
  },
  description: {
    fontSize: 14,
  },
  item: {
    margin: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default withTheme(ListItem);
