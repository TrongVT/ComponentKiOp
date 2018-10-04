/* @flow */

import React from 'react';
import { View, StyleSheet } from 'react-native';

class DialogScrollArea extends React.Component {
  static displayName = 'Dialog.ScrollArea';

  render() {
    return <View style={[styles.container, this.props.style]}>{this.props.children}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    borderColor: 'rgba(0, 0, 0, .12)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 24,
  },
});

export default DialogScrollArea;
