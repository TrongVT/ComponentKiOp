import  React from 'react';
import {
  View,
  Animated,
  TouchableWithoutFeedback,
  SafeAreaView,
  StyleSheet,
  Platform,
} from 'react-native';
import { polyfill } from 'react-lifecycles-compat';
import color from 'color';
import Icon from './Icon';
import Surface from './Surface';
import TouchableRipple from './TouchableRipple';
import Text from './Typography/Text';
import { black, white } from '../styles/colors';
import { withTheme } from '../core/theming';

const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedSurface = Animated.createAnimatedComponent(Surface);

const MIN_RIPPLE_SCALE = 0.001;
const MIN_TAB_WIDTH = 96;
const MAX_TAB_WIDTH = 168;
const BAR_HEIGHT = 56;
const FAR_FAR_AWAY = 9999;

const Touchable =
  Platform.OS === 'android'
    ? TouchableRipple
    : ({ style, children, ...rest }) => (
        <TouchableWithoutFeedback {...rest}>
          <View style={style}>{children}</View>
        </TouchableWithoutFeedback>
      );

class SceneComponent extends React.PureComponent {
  render() {
    const { component, ...rest } = this.props;
    return React.createElement(component, rest);
  }
}

class BottomNavigation extends React.Component {
  /**
   * Function which takes a map of route keys to components.
   * Pure components are used to minmize re-rendering of the pages.
   * This drastically improves the animation performance.
   */
  static SceneMap(scenes) {
    return ({ route, jumpTo }) => (
      <SceneComponent key={route.key} component={scenes[route.key]} route={route} jumpTo={jumpTo} />
    );
  }

  static defaultProps = {
    labeled: true,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { index, routes } = nextProps.navigationState;

    // Re-create animated values if routes have been added/removed
    // Preserve previous animated values if they exist, so we don't break animations
    const tabs = routes.map(
      // focused === 1, unfocused === 0
      (_, i) => prevState.tabs[i] || new Animated.Value(i === index ? 1 : 0)
    );
    const offsets = routes.map(
      // offscreen === 1, normal === 0
      (_, i) => prevState.offsets[i] || new Animated.Value(i === index ? 0 : 1)
    );

    const nextState = {
      tabs,
      offsets,
    };

    if (index !== prevState.current) {
      /* $FlowFixMe */
      Object.assign(nextState, {
        // Store the current index in state so that we can later check if the index has changed
        current: index,
        previous: prevState.current,
        // Set the current tab to be loaded if it was not loaded before
        loaded: prevState.loaded.includes(index) ? prevState.loaded : [...prevState.loaded, index],
      });
    }

    return nextState;
  }

  constructor(props) {
    super(props);

    const { index } = this.props.navigationState;

    this.state = {
      tabs: [],
      offsets: [],
      index: new Animated.Value(index),
      ripple: new Animated.Value(MIN_RIPPLE_SCALE),
      touch: new Animated.Value(MIN_RIPPLE_SCALE),
      layout: { height: 0, width: 0, measured: false },
      current: index,
      previous: 0,
      loaded: [index],
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.navigationState.index === this.props.navigationState.index) {
      return;
    }

    const shifting = this._isShifting();
    const { routes, index } = this.props.navigationState;

    // Reset offsets of previous and current tabs before animation
    this.state.offsets.forEach((offset, i) => {
      if (i === index || i === prevProps.navigationState.index) {
        offset.setValue(0);
      }
    });

    // Reset the ripple to avoid glitch if it's currently animating
    this.state.ripple.setValue(MIN_RIPPLE_SCALE);

    Animated.parallel([
      Animated.timing(this.state.ripple, {
        toValue: 1,
        duration: shifting ? 400 : 0,
        useNativeDriver: true,
      }),
      ...routes.map((_, i) =>
        Animated.timing(this.state.tabs[i], {
          toValue: i === index ? 1 : 0,
          duration: shifting ? 150 : 75,
          useNativeDriver: true,
        })
      ),
    ]).start(({ finished }) => {
      // Workaround a bug in native animations where this is reset after first animation
      this.state.tabs.map((tab, i) => tab.setValue(i === index ? 1 : 0));

      // Update the index to change bar's bacground color and then hide the ripple
      this.state.index.setValue(index);
      this.state.ripple.setValue(MIN_RIPPLE_SCALE);

      if (finished) {
        // Position all inactive screens offscreen to save memory usage
        // Only do it when animation has finished to avoid glitches mid-transition if switching fast
        this.state.offsets.forEach((offset, i) => {
          if (i === index) {
            offset.setValue(0);
          } else {
            offset.setValue(1);
          }
        });
      }
    });
  }

  _handleLayout = e =>
    this.setState({
      layout: {
        height: e.nativeEvent.layout.height,
        width: e.nativeEvent.layout.width,
        measured: true,
      },
    });

  _handleTabPress = index => {
    const { navigationState, onTabPress, onIndexChange } = this.props;

    if (onTabPress) {
      onTabPress({
        route: navigationState.routes[index],
      });
    }

    if (index !== navigationState.index) {
      onIndexChange(index);
    }
  };

  _jumpTo = key => {
    const index = this.props.navigationState.routes.findIndex(route => route.key === key);

    this.props.onIndexChange(index);
  };

  _isShifting = () =>
    typeof this.props.shifting === 'boolean'
      ? this.props.shifting
      : this.props.navigationState.routes.length > 3;

  render() {
    const {
      navigationState,
      renderScene,
      renderIcon,
      renderLabel,
      getLabelText = ({ route }) => route.title,
      getColor = ({ route }) => route.color,
      getAccessibilityLabel = ({ route }) => route.accessibilityLabel,
      getTestID = ({ route }) => route.testID,
      activeColor,
      inactiveColor,
      barStyle,
      labeled,
      style,
      theme,
    } = this.props;
    const { layout, loaded } = this.state;
    const { routes } = navigationState;
    const { colors } = theme;

    const shifting = this._isShifting();

    const { backgroundColor: approxBackgroundColor = colors.primary } =
      StyleSheet.flatten(barStyle) || {};

    const backgroundColor = shifting
      ? this.state.index.interpolate({
          inputRange: routes.map((_, i) => i),
          outputRange: routes.map(route => getColor({ route }) || approxBackgroundColor),
        })
      : approxBackgroundColor;

    const isDark = !color(approxBackgroundColor).light();

    const textColor = isDark ? white : black;
    const activeTintColor = typeof activeColor !== 'undefined' ? activeColor : textColor;
    const inactiveTintColor =
      typeof inactiveColor !== 'undefined'
        ? inactiveColor
        : color(textColor)
            .alpha(0.5)
            .rgb()
            .string();

    const touchColor = color(textColor)
      .alpha(0.12)
      .rgb()
      .string();

    const maxTabWidth = routes.length > 3 ? MIN_TAB_WIDTH : MAX_TAB_WIDTH;
    const tabWidth = Math.min(
      // Account for horizontal padding around the items
      (layout.width * 4) / routes.length,
      maxTabWidth
    );

    return (
      <View
        style={[styles.container, style]}
        onLayout={this._handleLayout}
        pointerEvents={layout.measured ? 'auto' : 'none'}>
        <View style={[styles.content, { backgroundColor: colors.background }]}>
          {routes.map((route, index) => {
            if (!loaded.includes(index)) {
              // Don't render a screen if we've never navigated to it
              return null;
            }

            const opacity = this.state.tabs[index];
            const top = this.state.offsets[index].interpolate({
              inputRange: [0, 1],
              outputRange: [0, FAR_FAR_AWAY],
            });

            const focused = navigationState.index === index;

            return (
              <Animated.View
                key={route.key}
                pointerEvents={focused ? 'auto' : 'none'}
                accessibilityElementsHidden={!focused}
                importantForAccessibility={focused ? 'auto' : 'no-hide-descendants'}
                style={[StyleSheet.absoluteFill, { opacity }]}
                collapsable={false}
                removeClippedSubviews={
                  // On iOS, set removeClippedSubviews to true only when not focused
                  // This is an workaround for a bug where the clipped view never re-appears
                  Platform.OS === 'ios' ? navigationState.index !== index : true
                }>
                <Animated.View style={[styles.content, { top }]}>
                  {renderScene({
                    route,
                    jumpTo: this._jumpTo,
                  })}
                </Animated.View>
              </Animated.View>
            );
          })}
        </View>
        <AnimatedSurface style={[styles.bar, barStyle, { backgroundColor }]}>
          <SafeAreaView style={[styles.items, { maxWidth: maxTabWidth * routes.length }]}>
            {shifting ? (
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.ripple,
                  {
                    // Since we have a single ripple, we have to reposition it so that it appears to expand from active tab.
                    // We need to move it from the top to center of the tab bar and from the left to the active tab.
                    top: BAR_HEIGHT / 2 - layout.width / 8,
                    left: navigationState.index * tabWidth + tabWidth / 2 - layout.width / 8,
                    height: layout.width / 4,
                    width: layout.width / 4,
                    borderRadius: layout.width / 2,
                    backgroundColor: getColor({
                      route: routes[navigationState.index],
                    }),
                    transform: [
                      {
                        // Scale to twice the size  to ensure it covers the whole tab bar
                        scale: this.state.ripple.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 8],
                        }),
                      },
                    ],
                    opacity: this.state.ripple.interpolate({
                      inputRange: [0, MIN_RIPPLE_SCALE, 0.3, 1],
                      outputRange: [0, 0, 1, 1],
                    }),
                  },
                ]}
              />
            ) : null}
            {routes.map((route, index) => {
              const focused = navigationState.index === index;
              const active = this.state.tabs[index];

              // Scale up in the label
              const scale =
                labeled && shifting
                  ? active.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    })
                  : 1;

              // Move down the icon to account for no-label in shifting and smaller label in non-shifting.
              const translateY = labeled
                ? shifting
                  ? active.interpolate({
                      inputRange: [0, 1],
                      outputRange: [7, 0],
                    })
                  : 0
                : 7;

              // We render the active icon and label on top of inactive ones and cross-fade them on change.
              // This trick gives the illusion that we are animating between active and inactive colors.
              // This is to ensure that we can use native driver, as colors cannot be animated with native driver.
              const activeOpacity = active;
              const inactiveOpacity = active.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              });

              return (
                <Touchable
                  key={route.key}
                  borderless
                  rippleColor={touchColor}
                  onPress={() => this._handleTabPress(index)}
                  testID={getTestID({ route })}
                  accessibilityLabel={getAccessibilityLabel({ route })}
                  accessibilityTraits={focused ? ['button', 'selected'] : 'button'}
                  accessibilityComponentType="button"
                  accessibilityRole="button"
                  accessibilityStates={['selected']}
                  style={styles.item}>
                  <View pointerEvents="none">
                    <Animated.View style={[styles.iconContainer, { transform: [{ translateY }] }]}>
                      <Animated.View style={[styles.iconWrapper, { opacity: activeOpacity }]}>
                        {renderIcon ? (
                          renderIcon({
                            route,
                            focused: true,
                            color: activeTintColor,
                          })
                        ) : (
                          <Icon source={route.icon} color={activeTintColor} size={24} />
                        )}
                      </Animated.View>
                      <Animated.View style={[styles.iconWrapper, { opacity: inactiveOpacity }]}>
                        {renderIcon ? (
                          renderIcon({
                            route,
                            focused: false,
                            color: inactiveTintColor,
                          })
                        ) : (
                          <Icon source={route.icon} color={inactiveTintColor} size={24} />
                        )}
                      </Animated.View>
                    </Animated.View>
                    {labeled ? (
                      <Animated.View
                        style={[
                          styles.labelContainer,
                          {
                            transform: [{ scale }],
                          },
                        ]}>
                        <Animated.View style={[styles.labelWrapper, { opacity: activeOpacity }]}>
                          {renderLabel ? (
                            renderLabel({
                              route,
                              focused: true,
                              color: activeTintColor,
                            })
                          ) : (
                            <AnimatedText
                              style={[
                                styles.label,
                                {
                                  color: activeTintColor,
                                },
                              ]}>
                              {getLabelText({ route })}
                            </AnimatedText>
                          )}
                        </Animated.View>
                        {shifting ? null : (
                          <Animated.View
                            style={[styles.labelWrapper, { opacity: inactiveOpacity }]}>
                            {renderLabel ? (
                              renderLabel({
                                route,
                                focused: false,
                                color: inactiveTintColor,
                              })
                            ) : (
                              <AnimatedText
                                style={[
                                  styles.label,
                                  {
                                    color: inactiveTintColor,
                                  },
                                ]}>
                                {getLabelText({ route })}
                              </AnimatedText>
                            )}
                          </Animated.View>
                        )}
                      </Animated.View>
                    ) : (
                      <View style={styles.labelContainer} />
                    )}
                  </View>
                </Touchable>
              );
            })}
          </SafeAreaView>
        </AnimatedSurface>
      </View>
    );
  }
}

polyfill(BottomNavigation);

export default withTheme(BottomNavigation);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  bar: {
    elevation: 8,
    overflow: 'hidden',
    alignItems: 'center',
  },
  items: {
    flexDirection: 'row',
  },
  item: {
    flex: 1,
    // Top padding is 6 and bottom padding is 10
    // The extra 4dp bottom padding is offset by label's height
    paddingVertical: 6,
  },
  ripple: {
    position: 'absolute',
  },
  iconContainer: {
    height: 24,
    width: 24,
    marginTop: 2,
    marginHorizontal: 12,
    alignSelf: 'center',
  },
  iconWrapper: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
  },
  labelContainer: {
    height: 16,
    paddingBottom: 2,
  },
  labelWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  label: {
    fontSize: 12,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
});
