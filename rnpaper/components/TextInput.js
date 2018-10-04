/* @flow */

import React from 'react';
import {
  View,
  Animated,
  TextInput as NativeTextInput,
  StyleSheet,
  I18nManager,
} from 'react-native';
import { polyfill } from 'react-lifecycles-compat';
import color from 'color';
import Text from './Typography/Text';
import { withTheme } from '../core/theming';

const AnimatedText = Animated.createAnimatedComponent(Text);

const MINIMIZED_LABEL_Y_OFFSET = -12;
const OUTLINE_MINIMIZED_LABEL_Y_OFFSET = -29;
const MAXIMIZED_LABEL_FONT_SIZE = 16;
const MINIMIZED_LABEL_FONT_SIZE = 12;
const LABEL_WIGGLE_X_OFFSET = 4;
const FOCUS_ANIMATION_DURATION = 150;
const BLUR_ANIMATION_DURATION = 180;

class TextInput extends React.Component {
  static defaultProps = {
    mode: 'flat',
    disabled: false,
    error: false,
    multiline: false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      value: typeof nextProps.value !== 'undefined' ? nextProps.value : prevState.value,
    };
  }

  state = {
    labeled: new Animated.Value(this.props.value ? 0 : 1),
    error: new Animated.Value(this.props.error ? 1 : 0),
    focused: false,
    placeholder: '',
    value: this.props.value,
    labelLayout: {
      measured: false,
      width: 0,
    },
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.focused !== this.state.focused || prevState.value !== this.state.value) {
      if (this.state.value || this.state.focused) {
        this._minmizeLabel();
      } else {
        this._restoreLabel();
      }
    }

    if (prevState.focused !== this.state.focused || prevProps.label !== this.props.label) {
      if (this.state.focused || !this.props.label) {
        this._showPlaceholder();
      } else {
        this._hidePlaceholder();
      }
    }

    if (prevProps.error !== this.props.error) {
      if (this.props.error) {
        this._showError();
      } else {
        this._hideError();
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this._timer);
  }

  _showPlaceholder = () => {
    clearTimeout(this._timer);

    this._timer = setTimeout(
      () =>
        this.setState({
          placeholder: this.props.placeholder,
        }),
      50
    );
  };

  _hidePlaceholder = () =>
    this.setState({
      placeholder: '',
    });

  _showError = () => {
    Animated.timing(this.state.error, {
      toValue: 1,
      duration: FOCUS_ANIMATION_DURATION,
      useNativeDriver: true,
    }).start(this._showPlaceholder);
  };

  _hideError = () => {
    Animated.timing(this.state.error, {
      toValue: 0,
      duration: BLUR_ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();
  };

  _restoreLabel = () =>
    Animated.timing(this.state.labeled, {
      toValue: 1,
      duration: FOCUS_ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();

  _minmizeLabel = () =>
    Animated.timing(this.state.labeled, {
      toValue: 0,
      duration: BLUR_ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();

  _handleFocus = (...args) => {
    if (this.props.disabled) {
      return;
    }

    this.setState({ focused: true });

    if (this.props.onFocus) {
      this.props.onFocus(...args);
    }
  };

  _handleBlur = (...args) => {
    if (this.props.disabled) {
      return;
    }

    this.setState({ focused: false });

    if (this.props.onBlur) {
      this.props.onBlur(...args);
    }
  };

  _handleChangeText = value => {
    this.setState({ value });
    this.props.onChangeText && this.props.onChangeText(value);
  };

  /**
   * @internal
   */
  setNativeProps(...args) {
    return this._root.setNativeProps(...args);
  }

  /**
   * Returns `true` if the input is currently focused, `false` otherwise.
   */
  isFocused() {
    return this._root.isFocused();
  }

  /**
   * Removes all text from the TextInput.
   */
  clear() {
    return this._root.clear();
  }

  /**
   * Focuses the input.
   */
  focus() {
    return this._root.focus();
  }

  /**
   * Removes focus from the input.
   */
  blur() {
    return this._root.blur();
  }

  render() {
    const { mode, disabled, label, error, underlineColor, style, theme, ...rest } = this.props;

    const { colors, fonts } = theme;
    const fontFamily = fonts.regular;
    const { backgroundColor = colors.background } = StyleSheet.flatten(style) || {};

    let inputTextColor,
      activeColor,
      underlineColorCustom,
      outlineColor,
      placeholderColor,
      containerStyle;

    if (disabled) {
      inputTextColor = activeColor = color(colors.text)
        .alpha(0.54)
        .rgb()
        .string();
      placeholderColor = outlineColor = colors.disabled;
      underlineColorCustom = 'transparent';
    } else {
      inputTextColor = colors.text;
      activeColor = error ? colors.error : colors.primary;
      placeholderColor = outlineColor = colors.placeholder;
      underlineColorCustom = underlineColor || colors.disabled;
    }

    if (mode === 'flat') {
      containerStyle = {
        backgroundColor: theme.dark
          ? color(colors.background)
              .lighten(0.24)
              .rgb()
              .string()
          : color(colors.background)
              .darken(0.06)
              .rgb()
              .string(),
        borderTopLeftRadius: theme.roundness,
        borderTopRightRadius: theme.roundness,
      };
    }

    const labelStyle = {
      fontFamily,
      fontSize: MAXIMIZED_LABEL_FONT_SIZE,
      transform: [
        {
          // Wiggle the label when there's an error
          translateX: this.state.error.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, this.state.value && error ? LABEL_WIGGLE_X_OFFSET : 0, 0],
          }),
        },
        {
          // Move label to top
          translateY: this.state.labeled.interpolate({
            inputRange: [0, 1],
            outputRange: [
              mode === 'outlined' ? OUTLINE_MINIMIZED_LABEL_Y_OFFSET : MINIMIZED_LABEL_Y_OFFSET,
              0,
            ],
          }),
        },
        {
          // Make label smaller
          scale: this.state.labeled.interpolate({
            inputRange: [0, 1],
            outputRange: [MINIMIZED_LABEL_FONT_SIZE / MAXIMIZED_LABEL_FONT_SIZE, 1],
          }),
        },
        {
          // Offset label scale since RN doesn't support transform origin
          translateX: this.state.labeled.interpolate({
            inputRange: [0, 1],
            outputRange: [
              -(1 - MINIMIZED_LABEL_FONT_SIZE / MAXIMIZED_LABEL_FONT_SIZE) *
                (this.state.labelLayout.width / 2),
              0,
            ],
          }),
        },
      ],
    };

    return (
      <View style={[containerStyle, style]}>
        {mode === 'outlined' ? (
          // Render the outline separately from the container
          // This is so that the label can overlap the outline
          // Otherwise the border will cut off the label on Android
          <View
            style={[
              styles.outline,
              {
                borderRadius: theme.roundness,
                borderWidth: this.state.focused ? 2 : 1,
                borderColor: this.state.focused ? activeColor : outlineColor,
              },
            ]}
          />
        ) : null}

        {mode === 'outlined' && label ? (
          // When mode == 'outlined', the input label stays on top of the outline
          // The background of the label covers the outline so it looks cut off
          // To achieve the effect, we position the actual label with a background on top of it
          // We set the color of the text to transparent so only the background is visible
          <AnimatedText
            pointerEvents="none"
            style={[
              styles.outlinedLabelBackground,
              {
                backgroundColor,
                fontFamily,
                fontSize: MINIMIZED_LABEL_FONT_SIZE,
                // Hide the background when scale will be 0
                // There's a bug in RN which makes scale: 0 act weird
                opacity: this.state.labeled.interpolate({
                  inputRange: [0, 0.9, 1],
                  outputRange: [1, 1, 0],
                }),
                transform: [
                  {
                    // Animate the scale when label is moved up
                    scaleX: this.state.labeled.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0],
                    }),
                  },
                ],
              },
            ]}
            numberOfLines={1}>
            {label}
          </AnimatedText>
        ) : null}

        {mode === 'flat' ? (
          // When mode === 'flat', render an underline
          <Animated.View
            style={[
              styles.underline,
              {
                backgroundColor: error
                  ? colors.error
                  : this.state.focused
                    ? activeColor
                    : underlineColorCustom,
                // Underlines is thinner when input is not focused
                transform: [{ scaleY: this.state.focused ? 1 : 0.5 }],
              },
            ]}
          />
        ) : null}

        {label ? (
          // Position colored placeholder and gray placeholder on top of each other and crossfade them
          // This gives the effect of animating the color, but allows us to use native driver
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              {
                opacity:
                  // Hide the label in minimized state until we measure it's width
                  this.state.value || this.state.focused
                    ? this.state.labelLayout.measured
                      ? 1
                      : 0
                    : 1,
              },
            ]}>
            <AnimatedText
              onLayout={e =>
                this.setState({
                  labelLayout: {
                    width: e.nativeEvent.layout.width,
                    measured: true,
                  },
                })
              }
              style={[
                styles.placeholder,
                mode === 'outlined' ? styles.placeholderOutlined : styles.placeholderFlat,
                labelStyle,
                {
                  color: activeColor,
                  opacity: this.state.labeled.interpolate({
                    inputRange: [0, 1],
                    outputRange: [this.state.focused ? 1 : 0, 0],
                  }),
                },
              ]}
              numberOfLines={1}>
              {label}
            </AnimatedText>
            <AnimatedText
              style={[
                styles.placeholder,
                mode === 'outlined' ? styles.placeholderOutlined : styles.placeholderFlat,
                labelStyle,
                {
                  color: placeholderColor,
                  opacity: this.state.focused ? this.state.labeled : 1,
                },
              ]}
              numberOfLines={1}>
              {label}
            </AnimatedText>
          </View>
        ) : null}

        <NativeTextInput
          {...rest}
          ref={c => {
            this._root = c;
          }}
          onChangeText={this._handleChangeText}
          placeholder={label ? this.state.placeholder : this.props.placeholder}
          placeholderTextColor={placeholderColor}
          editable={!disabled}
          selectionColor={activeColor}
          onFocus={this._handleFocus}
          onBlur={this._handleBlur}
          underlineColorAndroid="transparent"
          style={[
            styles.input,
            mode === 'outlined'
              ? styles.inputOutlined
              : this.props.label
                ? styles.inputFlatWithLabel
                : styles.inputFlatWithoutLabel,
            {
              color: inputTextColor,
              fontFamily,
            },
          ]}
        />
      </View>
    );
  }
}

polyfill(TextInput);

export default withTheme(TextInput);

const styles = StyleSheet.create({
  placeholder: {
    position: 'absolute',
    left: 0,
    fontSize: 16,
    paddingHorizontal: 12,
  },
  placeholderFlat: {
    top: 19,
  },
  placeholderOutlined: {
    top: 25,
  },
  underline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
  },
  outline: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 6,
    bottom: 0,
  },
  outlinedLabelBackground: {
    position: 'absolute',
    top: 0,
    left: 8,
    paddingHorizontal: 4,
    color: 'transparent',
  },
  input: {
    paddingHorizontal: 12,
    fontSize: 16,
    margin: 0,
    minHeight: 58,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  inputOutlined: {
    paddingTop: 20,
    paddingBottom: 16,
    minHeight: 64,
  },
  inputFlatWithLabel: {
    paddingTop: 24,
    paddingBottom: 6,
  },
  inputFlatWithoutLabel: {
    paddingVertical: 15,
  },
});
