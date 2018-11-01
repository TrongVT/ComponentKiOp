/* @flow */

import React from "react";
import { StyleSheet, TextInput } from "react-native";

import color from "color";
import IconButton from "./IconButton";
import Surface from "./Surface";
import { withTheme } from "../core/theming";

class Searchbar extends React.Component {
  _handleClearPress = () => {
    this.clear();
    this.props.onChangeText && this.props.onChangeText("");
  };

  setNativeProps(...args) {
    return this._root.setNativeProps(...args);
  }

  isFocused() {
    return this._root.isFocused();
  }

  clear() {
    return this._root.clear();
  }

  focus() {
    return this._root.focus();
  }

  blur() {
    return this._root.blur();
  }

  render() {
    const {
      placeholder,
      onIconPress,
      icon,
      value,
      theme,
      style,
      ...rest
    } = this.props;
    const { colors, roundness, dark } = theme;
    const textColor = colors.text;
    const iconColor = dark
      ? textColor
      : color(textColor)
          .alpha(0.54)
          .rgb()
          .string();
    const rippleColor = color(textColor)
      .alpha(0.32)
      .rgb()
      .string();

    return (
      <Surface
        style={[
          { borderRadius: roundness, elevation: 4 },
          styles.container,
          style
        ]}
      >
        <IconButton
          borderless
          rippleColor={rippleColor}
          onPress={onIconPress}
          color={iconColor}
          icon={icon || "search"}
        />
        <TextInput
          style={[styles.input, { color: textColor }]}
          placeholder={placeholder || ""}
          placeholderTextColor={colors.placeholder}
          selectionColor={colors.primary}
          onSubmitEditing={this.props.onSubmitEditing}
          underlineColorAndroid="transparent"
          returnKeyType="search"
          accessibilityTraits="search"
          accessibilityRole="search"
          ref={c => {
            this._root = c;
          }}
          value={value}
          {...rest}
        />
        {value ? (
          <IconButton
            borderless
            color={iconColor}
            rippleColor={rippleColor}
            onPress={this._handleClearPress}
            icon="close"
            accessibilityTraits="button"
            accessibilityComponentType="button"
            accessibilityRole="button"
          />
        ) : null}
      </Surface>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center"
  },
  input: {
    flex: 1,
    fontSize: 18,
    paddingLeft: 8,
    alignSelf: "stretch"
  }
});

export default withTheme(Searchbar);
