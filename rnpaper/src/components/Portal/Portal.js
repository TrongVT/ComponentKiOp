/* @flow */
/* eslint-disable react/no-unused-prop-types */

import React from 'react';
import PortalConsumer from './PortalConsumer';
import PortalHost, { PortalContext } from './PortalHost';
import { ThemeProvider, withTheme } from '../../core/theming';

class Portal extends React.Component {
  static Host = PortalHost;

  render() {
    const { children, theme } = this.props;

    return (
      <PortalContext.Consumer>
        {manager => (
          <PortalConsumer manager={manager}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
          </PortalConsumer>
        )}
      </PortalContext.Consumer>
    );
  }
}

export default withTheme(Portal);
