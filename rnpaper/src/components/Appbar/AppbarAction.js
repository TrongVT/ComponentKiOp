import React from 'react';
import color from 'color';
import { black } from '../../styles/colors';
import IconButton from '../IconButton';

export default class AppbarAction extends React.Component {
  static displayName = 'Appbar.Action';

  static defaultProps = {
    size: 24,
  };

  render() {
    const {
      color: iconColor = color(black)
        .alpha(0.54)
        .rgb()
        .string(),
      icon,
      disabled,
      onPress,
      accessibilityLabel,
      ...rest
    } = this.props;

    return (
      <IconButton
        onPress={onPress}
        color={iconColor}
        icon={icon}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel}
        {...rest}
      />
    );
  }
}
