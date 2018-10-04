import React from 'react';
import color from 'color';
import { View } from 'react-native';
import Text from '../Typography/Text';
import Divider from '../Divider';
import { withTheme } from '../../core/theming';

class DrawerSection extends React.Component {
  static displayName = 'Drawer.Section';

  render() {
    const { children, title, theme, ...rest } = this.props;
    const { colors, fonts } = theme;
    const titleColor = color(colors.text)
      .alpha(0.54)
      .rgb()
      .string();
    const fontFamily = fonts.medium;

    return (
      <View {...rest}>
        {title && (
          <View style={{ height: 40, justifyContent: 'center' }}>
            <Text numberOfLines={1} style={{ color: titleColor, fontFamily, marginLeft: 16 }}>
              {title}
            </Text>
          </View>
        )}
        {children}
        <Divider style={{ marginVertical: 4 }} />
      </View>
    );
  }
}

export default withTheme(DrawerSection);
