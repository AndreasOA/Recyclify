import React, { memo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput as Input } from 'react-native-paper';

type Props = React.ComponentProps<typeof Input> & { errorText?: string };

const TextInput = ({ errorText, ...props }: Props) => (
  <View style={styles.container}>
    <Input
      style={styles.input}
      selectionColor='#FF715B'
      underlineColor="transparent"
      activeUnderlineColor='#FF715B'
      textColor='#000000'
      mode="flat"
      
      {...props}
    />
    {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12,
  },
  input: {
    backgroundColor: '#ffffff',
    elevation: 5, 
    shadowOffset: { 
      width: 0, 
      height: 2.5 }, 
    borderRadius: 5, 
    marginBottom: 20, 
    shadowOpacity: 0.2, 
  },
  error: {
    fontSize: 14,
    color: '#f13a59',
    paddingHorizontal: 4,
    paddingTop: 4,
  },
});

export default memo(TextInput);
