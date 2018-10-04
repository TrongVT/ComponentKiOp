/* @flow */

import React from 'react';
import createReactContext from 'create-react-context';

export const RadioButtonContext = createReactContext(null);

class RadioButtonGroup extends React.Component {
  static displayName = 'RadioButton.Group';

  render() {
    const { value, onValueChange, children } = this.props;

    return (
      <RadioButtonContext.Provider value={{ value, onValueChange }}>
        {children}
      </RadioButtonContext.Provider>
    );
  }
}

export default RadioButtonGroup;
