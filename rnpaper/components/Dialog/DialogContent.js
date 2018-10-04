/* @flow */

import React from 'react';
import { View, StyleSheet } from 'react-native';

class DialogContent extends React.Component {
  static displayName = 'Dialog.Content';

  render() {
    return <View style={[styles.container, this.props.style]}>{this.props.children}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
});

export default DialogContent;
