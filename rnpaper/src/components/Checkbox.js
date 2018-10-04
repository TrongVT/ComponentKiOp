/* @flow */

import  React from 'react';
import { Platform } from 'react-native';
import CheckboxAndroid from './CheckboxAndroid';
import CheckboxIOS from './CheckboxIOS';
import { withTheme } from '../core/theming';

class Checkbox extends React.Component {
  static Android = CheckboxAndroid;

  static IOS = CheckboxIOS;

  render() {
    return Platform.OS === 'ios' ? (
      <CheckboxIOS {...this.props} />
    ) : (
      <CheckboxAndroid {...this.props} />
    );
  }
}

export default withTheme(Checkbox);
