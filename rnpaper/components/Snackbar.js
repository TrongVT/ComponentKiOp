/* @flow */

import React from 'react';
import { StyleSheet, Animated, View, SafeAreaView } from 'react-native';

import Button from './Button';
import Text from './Typography/Text';
import { withTheme } from '../core/theming';
import { white } from '../styles/colors';

const DURATION_SHORT = 4000;
const DURATION_MEDIUM = 7000;
const DURATION_LONG = 10000;

class Snackbar extends React.Component {
  /**
   * Show the Snackbar for a short duration.
   */
  static DURATION_SHORT = DURATION_SHORT;

  /**
   * Show the Snackbar for a medium duration.
   */
  static DURATION_MEDIUM = DURATION_MEDIUM;

  /**
   * Show the Snackbar for a long duration.
   */
  static DURATION_LONG = DURATION_LONG;

  static defaultProps = {
    duration: DURATION_MEDIUM,
  };

  state = {
    opacity: new Animated.Value(0.0),
    hidden: !this.props.visible,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      this._toggle();
    }
  }

  componentWillUnmount() {
    clearTimeout(this._hideTimeout);
  }

  _toggle = () => {
    if (this.props.visible) {
      this._show();
    } else {
      this._hide();
    }
  };

  _show = () => {
    clearTimeout(this._hideTimeout);
    this.setState({
      hidden: false,
    });
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      const { duration } = this.props;
      this._hideTimeout = setTimeout(this.props.onDismiss, duration);
    });
  };

  _hide = () => {
    clearTimeout(this._hideTimeout);

    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => this.setState({ hidden: true }));
  };

  render() {
    const { children, visible, action, onDismiss, theme, style } = this.props;
    const { colors, roundness } = theme;
    return (
      <SafeAreaView pointerEvents="box-none" style={styles.wrapper}>
        <Animated.View
          pointerEvents="box-none"
          accessibilityLiveRegion="polite"
          style={{
            opacity: this.state.opacity,
            transform: [
              {
                scale: visible
                  ? this.state.opacity.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                    })
                  : 1,
              },
            ],
          }}>
          {!this.state.hidden ? (
            <View
              pointerEvents="box-none"
              style={[styles.container, { borderRadius: roundness }, style]}>
              <Text style={[styles.content, { marginRight: action ? 0 : 16 }]}>{children}</Text>
              {action ? (
                <Button
                  onPress={() => {
                    action.onPress();
                    onDismiss();
                  }}
                  style={styles.button}
                  color={colors.accent}
                  compact
                  mode="text">
                  {action.label.toUpperCase()}
                </Button>
              ) : null}
            </View>
          ) : null}
        </Animated.View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  container: {
    elevation: 6,
    backgroundColor: '#323232',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 8,
    borderRadius: 4,
  },
  content: {
    color: white,
    marginLeft: 16,
    marginVertical: 14,
    flexWrap: 'wrap',
    flex: 1,
  },
  button: {
    marginHorizontal: 8,
    marginVertical: 6,
  },
});

export default withTheme(Snackbar);
