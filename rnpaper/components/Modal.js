import React from 'react';
import {
  Animated,
  View,
  Easing,
  StyleSheet,
  TouchableWithoutFeedback,
  BackHandler,
} from 'react-native';
import { polyfill } from 'react-lifecycles-compat';
import { withTheme } from '../core/theming';

class Modal extends React.Component {
  static defaultProps = {
    dismissable: true,
    visible: false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.visible && !prevState.rendered) {
      return {
        rendered: true,
      };
    }

    return null;
  }

  state = {
    opacity: new Animated.Value(this.props.visible ? 1 : 0),
    rendered: this.props.visible,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        this._showModal();
      } else {
        this._hideModal();
      }
    }
  }

  _handleBack = () => {
    if (this.props.dismissable) {
      this._hideModal();
    }
    return true;
  };

  _showModal = () => {
    BackHandler.addEventListener('hardwareBackPress', this._handleBack);
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 280,
      easing: Easing.ease,
    }).start();
  };

  _hideModal = () => {
    BackHandler.removeEventListener('hardwareBackPress', this._handleBack);
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: 280,
      easing: Easing.ease,
    }).start(() => {
      if (this.props.visible && this.props.onDismiss) {
        this.props.onDismiss();
      }
      if (this.props.visible) {
        this._showModal();
      } else {
        this.setState({
          rendered: false,
        });
      }
    });
  };

  render() {
    if (!this.state.rendered) return null;

    const { children, dismissable, theme } = this.props;
    const { colors } = theme;
    return (
      <Animated.View
        accessibilityViewIsModal
        accessibilityLiveRegion="polite"
        style={[{ opacity: this.state.opacity }, StyleSheet.absoluteFill]}>
        <TouchableWithoutFeedback onPress={dismissable ? this._hideModal : undefined}>
          <View style={[styles.backdrop, { backgroundColor: colors.backdrop }]} />
        </TouchableWithoutFeedback>
        <View pointerEvents="box-none" style={styles.content}>
          {children}
        </View>
      </Animated.View>
    );
  }
}

polyfill(Modal);

export default withTheme(Modal);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
  },
});
