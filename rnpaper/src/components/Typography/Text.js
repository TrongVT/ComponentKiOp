import React from 'react';
import { Text as NativeText, I18nManager } from 'react-native';
import { withTheme } from '../../core/theming';

class Text extends React.Component {
  setNativeProps(...args) {
    return this._root.setNativeProps(...args);
  }

  render() {
    const { style, theme } = this.props;
    const writingDirection = I18nManager.isRTL ? 'rtl' : 'ltr';

    return (
      <NativeText
        {...this.props}
        ref={c => {
          this._root = c;
        }}
        style={[
          {
            fontFamily: theme.fonts.regular,
            color: theme.colors.text,
            textAlign: 'left',
            writingDirection,
          },
          style,
        ]}
      />
    );
  }
}

export default withTheme(Text);
