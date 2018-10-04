import React from 'react';
import { View, Platform, StatusBar, SafeAreaView, StyleSheet } from 'react-native';

import Appbar, { DEFAULT_APPBAR_HEIGHT } from './Appbar';
import { withTheme } from '../../core/theming';

const DEFAULT_STATUSBAR_HEIGHT_EXPO =
  global.__expo && global.__expo.Constants ? global.__expo.Constants.statusBarHeight : undefined;
const DEFAULT_STATUSBAR_HEIGHT = Platform.select({
  android: DEFAULT_STATUSBAR_HEIGHT_EXPO,
  ios:
    Platform.Version < 11
      ? DEFAULT_STATUSBAR_HEIGHT_EXPO === undefined
        ? StatusBar.currentHeight
        : DEFAULT_STATUSBAR_HEIGHT_EXPO
      : undefined,
});

class AppbarHeader extends React.Component {
  static displayName = 'Appbar.Header';

  static defaultProps = {
    statusBarHeight: DEFAULT_STATUSBAR_HEIGHT,
  };

  render() {
    const { statusBarHeight = 0, style, ...rest } = this.props;

    const { colors } = rest.theme;
    const {
      height = DEFAULT_APPBAR_HEIGHT,
      elevation = 4,
      backgroundColor = colors.primary,
      ...restStyle
    } = StyleSheet.flatten(style) || {};

    const Wrapper = typeof this.props.statusBarHeight === 'number' ? View : SafeAreaView;

    return (
      <Wrapper style={[{ backgroundColor, elevation }]}>
        <Appbar
          style={[
            { height, backgroundColor, marginTop: statusBarHeight },
            styles.appbar,
            restStyle,
          ]}
          {...rest}
        />
      </Wrapper>
    );
  }
}

const styles = StyleSheet.create({
  appbar: {
    elevation: 0,
  },
});

export default withTheme(AppbarHeader);
