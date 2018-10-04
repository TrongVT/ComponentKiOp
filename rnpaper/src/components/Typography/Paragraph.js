import React from 'react';
import { StyleSheet } from 'react-native';
import StyledText from './StyledText';

const Paragraph = props => (
  <StyledText {...props} alpha={0.87} family="regular" style={[styles.text, props.style]} />
);

export default Paragraph;

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    lineHeight: 20,
    marginVertical: 2,
  },
});
