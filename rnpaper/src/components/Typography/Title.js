/* @flow */

import React from 'react';
import { StyleSheet } from 'react-native';
import StyledText from './StyledText';

const Title = props => (
  <StyledText {...props} alpha={0.87} family="medium" style={[styles.text, props.style]} />
);

export default Title;

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    lineHeight: 30,
    marginVertical: 2,
  },
});
