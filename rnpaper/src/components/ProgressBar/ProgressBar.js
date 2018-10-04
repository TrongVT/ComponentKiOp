/* @flow */

import  React from 'react';
import { StyleSheet } from 'react-native';
import setColor from 'color';
import ProgressBarComponent from './ProgressBarComponent';
import { withTheme } from '../../core/theming';

class ProgressBar extends React.Component {
  render() {
    const { progress, color, style, theme } = this.props;
    const tintColor = color || theme.colors.primary;
    const trackTintColor = setColor(tintColor)
      .alpha(0.38)
      .rgb()
      .string();

    return (
      <ProgressBarComponent
        styleAttr="Horizontal"
        indeterminate={false}
        progress={progress}
        progressTintColor={tintColor}
        color={tintColor}
        style={[styles.progressBarHeight, style]}
        trackTintColor={trackTintColor}
      />
    );
  }
}

const styles = StyleSheet.create({
  progressBarHeight: {
    paddingVertical: 10,
  },
});

export default withTheme(ProgressBar);
