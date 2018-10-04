/* @flow */

import React from 'react';
import { StyleSheet, View } from 'react-native';

class CardActions extends React.Component {
  static displayName = 'Card.Actions';

  render() {
    return (
      <View {...this.props} style={[styles.container, this.props.style]}>
        {React.Children.map(
          this.props.children,
          child =>
            React.isValidElement(child)
              ? React.cloneElement(child, {
                  compact: child.props.compact !== false,
                })
              : child
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 4,
  },
});

export default CardActions;
