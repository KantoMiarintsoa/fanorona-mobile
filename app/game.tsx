import { View } from 'react-native'
import React from 'react'
import Board from '@/components/Board'
import { SafeAreaView } from 'react-native-safe-area-context'

const GameScreen = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:"#0e1021"
      }}
    >
      <Board/>
    </SafeAreaView>
  )
}

export default GameScreen