import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import color from 'color';

import AppbarContent from './AppbarContent';
import AppbarAction from './AppbarAction';
import AppbarBackAction from './AppbarBackAction';
import AppbarHeader from './AppbarHeader';
import { withTheme } from '../../core/theming';
import { black, white } from '../../styles/colors';

export const DEFAULT_APPBAR_HEIGHT = 56;

class Appbar extends React.Component {
  static Content = AppbarContent;
  static Action = AppbarAction;
  static BackAction = AppbarBackAction;
  static Header = AppbarHeader;

  render() {
    const { children, dark, style, theme, ...rest } = this.props;

    const { colors } = theme;
    const { backgroundColor = colors.primary, ...restStyle } = StyleSheet.flatten(style) || {};

    let isDark;

    if (typeof dark === 'boolean') {
      isDark = dark;
    } else {
      isDark = backgroundColor === 'transparent' ? false : !color(backgroundColor).light();
    }

    let shouldCenterContent = false;
    let shouldAddLeftSpacing = false;
    let shouldAddRightSpacing = false;

    if (Platform.OS === 'ios') {
      let hasAppbarContent = false;
      let leftItemsCount = 0;
      let rightItemsCount = 0;

      React.Children.forEach(children, child => {
        if (React.isValidElement(child)) {
          if (child.type === AppbarContent) {
            hasAppbarContent = true;
          } else if (hasAppbarContent) {
            rightItemsCount++;
          } else {
            leftItemsCount++;
          }
        }
      });

      shouldCenterContent = hasAppbarContent && (leftItemsCount < 2 && rightItemsCount < 2);
      shouldAddLeftSpacing = shouldCenterContent && leftItemsCount === 0;
      shouldAddRightSpacing = shouldCenterContent && rightItemsCount === 0;
    }

    return (
      <View style={[{ backgroundColor }, styles.appbar, restStyle]} {...rest}>
        {shouldAddLeftSpacing ? <View style={styles.spacing} /> : null}
        {React.Children.toArray(children)
          .filter(child => child != null && typeof child !== 'boolean')
          .map((child, i) => {
            if (!React.isValidElement(child)) {
              return child;
            }

            const props = {
              color:
                typeof child.props.color !== 'undefined'
                  ? child.props.color
                  : isDark
                    ? white
                    : black,
            };

            if (child.type === AppbarContent) {
              props.style = [
                i !== 0 && { marginLeft: 8 },
                shouldCenterContent && { alignItems: 'center' },
                child.props.style,
              ];
            }

            return React.cloneElement(child, props);
          })}
        {shouldAddRightSpacing ? <View style={styles.spacing} /> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  appbar: {
    height: DEFAULT_APPBAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    elevation: 4,
  },
  spacing: {
    width: 48,
  },
});

export default withTheme(Appbar);
