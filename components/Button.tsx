import { View, Text, TouchableOpacity, TouchableOpacityProps,  } from 'react-native'
import React from 'react'

type ButtonProps = TouchableOpacityProps;

const Button = ({children, ...props}:TouchableOpacityProps) => {
  return (
    <TouchableOpacity {...props}>
        <View style={{
            backgroundColor:"#f6a91a",
            justifyContent:"center",
            display:"flex",
            paddingVertical:5,
            paddingHorizontal:10,
            borderRadius:10,
            borderColor:"#f5f542",
            borderWidth:2,
            shadowColor: '#f54291',
            shadowOpacity: 0.9,
            shadowRadius: 10,
            flexDirection:"row",
            gap:20,
            alignItems:"center"
        }}>
            {children}
        </View>
    </TouchableOpacity>
  )
}

export default Button