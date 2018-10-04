/* @flow */

import React from 'react';
import { StyleSheet } from 'react-native';
import StyledText from './StyledText';

const Headline = props => (
  <StyledText {...props} alpha={0.87} family="regular" style={[styles.text, props.style]} />
);

export default Headline;

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
    lineHeight: 32,
    marginVertical: 2,
  },
});
