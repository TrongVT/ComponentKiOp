/* @flow */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from '../Icon';

export default class ListIcon extends React.Component {
  static displayName = 'List.Icon';

  render() {
    const { icon, color: iconColor, style } = this.props;

    return (
      <View style={[styles.item, style]} pointerEvents="box-none">
        <Icon source={icon} size={24} color={iconColor} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    margin: 8,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
