import React from 'react';
import { View, Image, I18nManager, StyleSheet, Platform } from 'react-native';

import AppbarAction from './AppbarAction';

class AppbarBackAction extends React.Component {
  static displayName = 'Appbar.BackAction';

  static defaultProps = {
    accessibilityLabel: 'Back',
  };

  render() {
    return (
      <AppbarAction
        {...this.props}
        icon={
          Platform.OS === 'ios'
            ? ({ size, color }) => (
                <View
                  style={[
                    styles.wrapper,
                    {
                      width: size,
                      height: size,
                      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                    },
                  ]}>
                  <Image
                    source={require('../../assets/back-chevron.png')}
                    style={[styles.icon, { tintColor: color }]}
                  />
                </View>
              )
            : { source: 'arrow-back', direction: 'auto' }
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    height: 21,
    width: 21,
    resizeMode: 'contain',
  },
});

export default AppbarBackAction;
