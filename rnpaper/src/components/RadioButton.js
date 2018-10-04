/* @flow */

import React from 'react';
import { Platform } from 'react-native';
import RadioButtonGroup from './RadioButtonGroup';
import RadioButtonAndroid from './RadioButtonAndroid';
import RadioButtonIOS from './RadioButtonIOS';
import { withTheme } from '../core/theming';

class RadioButton extends React.Component {
  static Group = RadioButtonGroup;

  static Android = RadioButtonAndroid;

  static IOS = RadioButtonIOS;

  render() {
    return Platform.OS === 'ios' ? (
      <RadioButtonIOS {...this.props} />
    ) : (
      <RadioButtonAndroid {...this.props} />
    );
  }
}

export default withTheme(RadioButton);
