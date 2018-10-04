/* @flow */

import React from 'react';
import { View, StyleSheet, Animated, TouchableWithoutFeedback, StatusBar } from 'react-native';
import { polyfill } from 'react-lifecycles-compat';
import color from 'color';
import FAB from './FAB';
import Text from '../Typography/Text';
import Card from '../Card/Card';
import { withTheme } from '../../core/theming';

class FABGroup extends React.Component {
  static displayName = 'FAB.Group';

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      animations: nextProps.actions.map(
        (_, i) => prevState.animations[i] || new Animated.Value(nextProps.open ? 1 : 0)
      ),
    };
  }

  state = {
    backdrop: new Animated.Value(0),
    animations: [],
  };

  componentDidUpdate(prevProps) {
    if (this.props.open === prevProps.open) {
      return;
    }

    if (this.props.open) {
      Animated.parallel([
        Animated.timing(this.state.backdrop, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.stagger(
          50,
          this.state.animations
            .map(animation =>
              Animated.timing(animation, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
              })
            )
            .reverse()
        ),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(this.state.backdrop, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        ...this.state.animations.map(animation =>
          Animated.timing(animation, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          })
        ),
      ]).start();
    }
  }

  _close = () => this.props.onStateChange({ open: false });

  _toggle = () => this.props.onStateChange({ open: !this.props.open });

  render() {
    const { actions, icon, open, onPress, accessibilityLabel, theme, style } = this.props;
    const { colors } = theme;

    const labelColor = theme.dark
      ? colors.text
      : color(colors.text)
          .fade(0.54)
          .rgb()
          .string();
    const backdropOpacity = open
      ? this.state.backdrop.interpolate({
          inputRange: [0, 0.5, 1],
          // $FlowFixMe
          outputRange: [0, 1, 1],
        })
      : this.state.backdrop;

    const opacities = this.state.animations;
    const scales = opacities.map(
      opacity =>
        open
          ? opacity.interpolate({
              inputRange: [0, 1],
              // $FlowFixMe
              outputRange: [0.8, 1],
            })
          : 1
    );

    return (
      <View pointerEvents="box-none" style={[styles.container, style]}>
        {open ? <StatusBar barStyle="light-content" /> : null}
        <TouchableWithoutFeedback onPress={this._close}>
          <Animated.View
            pointerEvents={open ? 'auto' : 'none'}
            style={[
              styles.backdrop,
              {
                opacity: backdropOpacity,
                backgroundColor: colors.backdrop,
              },
            ]}
          />
        </TouchableWithoutFeedback>
        <View pointerEvents={open ? 'box-none' : 'none'}>
          {actions.map((it, i) => (
            <Animated.View
              key={i} //eslint-disable-line
              style={[
                {
                  opacity: opacities[i],
                },
              ]}
              pointerEvents="box-none">
              <View style={styles.item} pointerEvents="box-none">
                {it.label && (
                  <Card
                    style={[styles.label, { transform: [{ scale: scales[i] }] }]}
                    onPress={() => {
                      it.onPress();
                      this._close();
                    }}
                    accessibilityLabel={
                      it.accessibilityLabel !== 'undefined' ? it.accessibilityLabel : it.label
                    }
                    accessibilityTraits="button"
                    accessibilityComponentType="button"
                    accessibilityRole="button">
                    <Text style={{ color: labelColor }}>{it.label}</Text>
                  </Card>
                )}
                <FAB
                  small
                  icon={it.icon}
                  color={it.color}
                  style={[
                    {
                      transform: [{ scale: scales[i] }],
                      backgroundColor: theme.colors.surface,
                    },
                    it.style,
                  ]}
                  onPress={() => {
                    it.onPress();
                    this._close();
                  }}
                  accessibilityLabel={
                    typeof it.accessibilityLabel !== 'undefined' ? it.accessibilityLabel : it.label
                  }
                  accessibilityTraits="button"
                  accessibilityComponentType="button"
                  accessibilityRole="button"
                />
              </View>
            </Animated.View>
          ))}
        </View>
        <FAB
          onPress={() => {
            onPress && onPress();
            this._toggle();
          }}
          icon={icon}
          color={this.props.color}
          accessibilityLabel={accessibilityLabel}
          accessibilityTraits="button"
          accessibilityComponentType="button"
          accessibilityRole="button"
          style={styles.fab}
        />
      </View>
    );
  }
}

polyfill(FABGroup);

export default withTheme(FABGroup);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  fab: {
    marginHorizontal: 16,
    marginBottom: 16,
    marginTop: 0,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  label: {
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
  },
  item: {
    marginHorizontal: 24,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
