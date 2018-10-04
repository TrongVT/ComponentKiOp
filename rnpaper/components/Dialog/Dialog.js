/* @flow */

import React from 'react';
import { StyleSheet, Platform, Animated } from 'react-native';
import Modal from '../Modal';
import Surface from '../Surface';
import DialogContent from './DialogContent';
import DialogActions from './DialogActions';
import DialogTitle from './DialogTitle';
import DialogScrollArea from './DialogScrollArea';
import { withTheme } from '../../core/theming';

const AnimatedSurface = Animated.createAnimatedComponent(Surface);

class Dialog extends React.Component {
  static Content = DialogContent;
  static Actions = DialogActions;
  static Title = DialogTitle;
  static ScrollArea = DialogScrollArea;

  static defaultProps = {
    dismissable: true,
    visible: false,
  };

  render() {
    const { children, dismissable, onDismiss, visible, style, theme } = this.props;

    return (
      <Modal dismissable={dismissable} onDismiss={onDismiss} visible={visible}>
        <AnimatedSurface style={[styles.container, { borderRadius: theme.roundness }, style]}>
          {React.Children.toArray(children)
            .filter(child => child != null && typeof child !== 'boolean')
            .map((child, i) => {
              if (i === 0 && React.isValidElement(child) && child.type === DialogContent) {
                // Dialog content is the first item, so we add a top padding
                return React.cloneElement(child, {
                  style: [{ paddingTop: 24 }, child.props.style],
                });
              }

              return child;
            })}
        </AnimatedSurface>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    /**
     * This prevents the shadow from being clipped on Android since Android
     * doesn't support `overflow: visible`.
     * One downside for this fix is that it will disable clicks on the area
     * of the shadow around the dialog, consequently, if you click around the
     * dialog (44 pixel from the top and bottom) it won't be dismissed.
     */
    marginVertical: Platform.OS === 'android' ? 44 : 0,
    marginHorizontal: 26,
    elevation: 24,
  },
});

export default withTheme(Dialog);
