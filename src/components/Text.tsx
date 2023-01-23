import * as React from 'react';
import {TextStyle} from 'react-native';
import {Text, TextProps} from '@ui-kitten/components';
import {EvaStatus} from '@ui-kitten/components/devsupport';

export interface MyTextProps extends TextProps {
  style?: TextStyle;
  category?:
    | 'h1'
    | 'h1-b'
    | 'h1-sb'
    | 'h2'
    | 'h2-b'
    | 'h2-sb'
    | 't1'
    | 't1-b'
    | 't1-sb'
    | 't2'
    | 't2-b'
    | 't2-sb'
    | 't3'
    | 't3-b'
    | 't3-sb'
    | 't4'
    | 't4-m'
    | 't4-b'
    | 't4-sb'
    | 't5'
    | 't5-b'
    | 't5-sb'
    | 't6'
    | 't6-b'
    | 't6-sb'
    | 't6-m'
    | 't7'
    | 't7-b'
    | 't7-sb'
    | 't7-m'
    | 's1'
    | 's1-sb'
    | 's1-b'
    | 's2'
    | 's2-b'
    | 's2-sb'
    | 'c1'
    | 'label';

  status?: EvaStatus;

  children?: any;
  marginLeft?: number;
  marginRight?: number;
  marginTop?: number;
  marginBottom?: number;
  marginVertical?: number;
  marginHorizontal?: number;
  opacity?: number;
  maxWidth?: number;
  fontSize?: number;
  lineHeight?: number;
  uppercase?: boolean;
  lowercase?: boolean;
  capitalize?: boolean;
  none?: boolean;
  left?: boolean;
  right?: boolean;
  center?: boolean;
  underline?: boolean;
  line_through?: boolean;
  bold?: boolean;
  italic?: boolean;
}

export default React.forwardRef(
  (
    {
      marginLeft,
      marginRight,
      marginTop,
      marginBottom,
      marginVertical,
      marginHorizontal,
      opacity,
      uppercase,
      lowercase,
      capitalize,
      none,
      left,
      right,
      center,
      underline,
      lineHeight,
      line_through,
      bold,
      italic,
      category = 't5',
      status,
      children,
      maxWidth,
      style,
      ...rest
    }: MyTextProps,
    ref,
  ) => {
    let textAlign: 'left' | 'center' | 'right' | 'auto' | 'justify' | 'left';

    left
      ? (textAlign = 'left')
      : right
      ? (textAlign = 'right')
      : center
      ? (textAlign = 'center')
      : (textAlign = 'left');

    let textTransform: 'uppercase' | 'lowercase' | 'capitalize' | 'none';

    uppercase
      ? (textTransform = 'uppercase')
      : lowercase
      ? (textTransform = 'lowercase')
      : capitalize
      ? (textTransform = 'capitalize')
      : none
      ? (textTransform = 'none')
      : (textTransform = 'none');

    let textDecorationLine:
      | 'none'
      | 'underline'
      | 'line-through'
      | 'underline line-through';
    underline
      ? (textDecorationLine = 'underline')
      : line_through
      ? (textDecorationLine = 'line-through')
      : (textDecorationLine = 'none');

    let fontStyle: 'normal' | 'italic';
    italic ? (fontStyle = 'italic') : (fontStyle = 'normal');

    const getLineHeight = () => {
      switch (category) {
        case 'h1':
          return 59;
        case 'h1-b':
          return 59;
        case 'h1-sb':
          return 59;
        case 'h2':
          return 48;
        case 'h2-b':
          return 48;
        case 'h2-sb':
          return 48;

        case 't1':
          return 40;
        case 't1-b':
          return 40;
        case 't1-sb':
          return 40;

        case 't2':
          return 36;
        case 't2-b':
          return 36;
        case 't2-sb':
          return 36;

        case 't3':
          return 32;
        case 't3-b':
          return 32;
        case 't3-sb':
          return 32;

        case 't4':
          return 24;
        case 't4-b':
          return 24;
        case 't4-m':
          return 24;
        case 't4-sb':
          return 24;

        case 't5':
          return 22;
        case 't5-b':
          return 22;
        case 't5-sb':
          return 22;

        case 't6':
          return 22;
        case 't6-b':
          return 22;
        case 't6-sb':
          return 22;

        case 't7':
          return 20;
        case 't7-b':
          return 20;
        case 't7-sb':
          return 20;
        case 't7-m':
          return 20;

        case 's1':
          return 18;
        case 's1-b':
          return 18;
        case 's1-sb':
          return 18;
        case 's2':
          return 16;
        case 's2-b':
          return 16;
        case 's2-sb':
          return 16;

        default:
          return 25;
      }
    };
    return (
      <Text
        ref={ref as any}
        category={category}
        status={status}
        style={[
          {
            marginLeft: marginLeft,
            marginRight: marginRight,
            marginTop: marginTop,
            marginBottom: marginBottom,
            marginVertical: marginVertical,
            marginHorizontal: marginHorizontal,
            opacity: opacity,
            textAlign: textAlign,
            maxWidth: maxWidth,
            lineHeight: lineHeight ? lineHeight : getLineHeight(),
            textTransform: textTransform,
            textDecorationLine: textDecorationLine,
            fontStyle: fontStyle,
          },
          style,
        ]}
        {...rest}>
        {children}
      </Text>
    );
  },
);
