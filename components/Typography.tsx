import { View, Text, TextProps } from 'react-native'
import React from 'react'

const Typography = (props:TextProps) => {
  return (
    <Text {...props}
        style={{
            fontSize:20,
            color:"#fff",
            fontFamily:"Orbitron-Black"
        }}
    />
  )
}

export default Typography