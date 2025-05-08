import { View, Text, Image } from 'react-native'
import React from 'react'
import Button from './Button'
import Typography from './Typography'

type MenuProps = {
    onMultiplayer:()=>void,
    onPlayWithComputer:()=>void,
    onVs:()=>void,
    children?:React.ReactNode
}

const Menu = ({onMultiplayer, onPlayWithComputer, onVs, children}:MenuProps) => {
  return (
    <View
        style={{
            flex:1,
            maxWidth:400,
            display:"flex",
            flexDirection:"column",
            justifyContent:"center",
            gap:20
        }}
    >
      <Button onPress={onMultiplayer}>
        <Typography>MULTIPLAYER</Typography>
      </Button>
      <Button onPress={onPlayWithComputer}>
        <Typography>PLAY WITH COMPUTER</Typography>
      </Button>
      <Button onPress={onVs}>
        <Image 
            source={require("@/assets/images/computer.png")}
            style={{ width: 25, height: 25, resizeMode: "contain" }}
        />
        <Typography>VS</Typography>
        <Image 
            source={require("@/assets/images/computer.png")}
            style={{ width: 25, height: 25, resizeMode: "contain" }}
        />
      </Button>
      {children}
    </View>
  )
}

export default Menu