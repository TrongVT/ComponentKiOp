/* @flow */

import React from 'react';
import createReactContext from 'create-react-context';

import { View, StyleSheet } from 'react-native';
import PortalManager from './PortalManager';

export const PortalContext = createReactContext(null);

export default class PortalHost extends React.Component {
  static displayName = 'Portal.Host';

  componentDidMount() {
    const manager = this._manager;
    const queue = this._queue;

    while (queue.length && manager) {
      const action = queue.pop();

      // eslint-disable-next-line default-case
      switch (action.type) {
        case 'mount':
          manager.mount(action.key, action.children);
          break;
        case 'update':
          manager.update(action.key, action.children);
          break;
        case 'unmount':
          manager.unmount(action.key);
          break;
      }
    }
  }

  _setManager = manager => {
    this._manager = manager;
  };

  _mount = children => {
    const key = this._nextKey++;

    if (this._manager) {
      this._manager.mount(key, children);
    } else {
      this._queue.push({ type: 'mount', key, children });
    }

    return key;
  };

  _update = (key, children) => {
    if (this._manager) {
      this._manager.update(key, children);
    } else {
      const op = { type: 'mount', key, children };
      const index = this._queue.findIndex(
        o => o.type === 'mount' || (o.type === 'update' && o.key === key)
      );

      if (index > -1) {
        /* $FlowFixMe */
        this._queue[index] = op;
      } else {
        this._queue.push(op);
      }
    }
  };

  _unmount = key => {
    if (this._manager) {
      this._manager.unmount(key);
    } else {
      this._queue.push({ type: 'unmount', key });
    }
  };

  _nextKey = 0;
  _queue = [];

  render() {
    return (
      <PortalContext.Provider
        value={{
          mount: this._mount,
          update: this._update,
          unmount: this._unmount,
        }}>
        {/* Need collapsable=false here to clip the elevations, otherwise they appear above Portal components */}
        <View style={styles.container} collapsable={false}>
          {this.props.children}
        </View>
        <PortalManager ref={this._setManager} />
      </PortalContext.Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
