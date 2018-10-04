import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { withTheme } from '../../core/theming';
import { grey200 } from '../../styles/colors';

class CardCover extends React.Component {
  static displayName = 'Card.Cover';

  render() {
    const { index, total, style, theme, ...rest } = this.props;
    const { roundness } = theme;

    let coverStyle;

    if (index === 0) {
      if (total === 1) {
        coverStyle = {
          borderRadius: roundness,
        };
      } else {
        coverStyle = {
          borderTopLeftRadius: roundness,
          borderTopRightRadius: roundness,
        };
      }
    } else if (typeof total === 'number' && index === total - 1) {
      coverStyle = {
        borderBottomLeftRadius: roundness,
      };
    }

    return (
      <View style={[styles.container, coverStyle, style]}>
        <Image {...rest} style={[styles.image, coverStyle]} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 195,
    backgroundColor: grey200,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    height: null,
    width: null,
    padding: 16,
    justifyContent: 'flex-end',
    resizeMode: 'cover',
  },
});

export default withTheme(CardCover);
