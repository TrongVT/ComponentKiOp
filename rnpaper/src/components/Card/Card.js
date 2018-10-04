import React from 'react';
import { Animated, View, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import CardContent from './CardContent';
import CardActions from './CardActions';
import CardCover from './CardCover';
import Surface from '../Surface';
import { withTheme } from '../../core/theming';

const AnimatedSurface = Animated.createAnimatedComponent(Surface);

class Card extends React.Component {
  static Content = CardContent;
  static Actions = CardActions;
  static Cover = CardCover;

  static defaultProps = {
    elevation: 1,
  };

  state = {
    elevation: new Animated.Value(this.props.elevation),
  };

  _handlePressIn = () => {
    Animated.timing(this.state.elevation, {
      toValue: 8,
      duration: 150,
    }).start();
  };

  _handlePressOut = () => {
    Animated.timing(this.state.elevation, {
      toValue: this.props.elevation,
      duration: 150,
    }).start();
  };

  render() {
    const { children, onPress, style, theme } = this.props;
    const { elevation } = this.state;
    const { roundness } = theme;
    const total = React.Children.count(children);
    const siblings = React.Children.map(
      children,
      child => (React.isValidElement(child) && child.type ? child.type.displayName : null)
    );
    return (
      <AnimatedSurface style={[{ borderRadius: roundness, elevation }, style]}>
        <TouchableWithoutFeedback
          delayPressIn={0}
          disabled={!onPress}
          onPress={onPress}
          onPressIn={onPress ? this._handlePressIn : undefined}
          onPressOut={onPress ? this._handlePressOut : undefined}
          style={styles.container}>
          <View style={styles.innerContainer}>
            {React.Children.map(
              children,
              (child, index) =>
                React.isValidElement(child)
                  ? React.cloneElement(child, {
                      index,
                      total,
                      siblings,
                    })
                  : child
            )}
          </View>
        </TouchableWithoutFeedback>
      </AnimatedSurface>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flexGrow: 1,
  },
});

export default withTheme(Card);
