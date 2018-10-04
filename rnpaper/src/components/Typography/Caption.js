/* @flow */

import  React from 'react';
import { StyleSheet } from 'react-native';
import StyledText from './StyledText';

const Caption = props => (
  <StyledText {...props} alpha={0.54} family="regular" style={[styles.text, props.style]} />
);

export default Caption;

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    lineHeight: 20,
    marginVertical: 2,
  },
});
