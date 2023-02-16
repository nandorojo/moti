import { Component } from 'react'
import { StyleProp, ViewStyle } from 'react-native'

type Point = Record<'x' | 'y', number>
type LinearGradientProps = {
  colors: string[]
  style: StyleProp<ViewStyle>
  start: Point
  end: Point
}

export class LinearGradient extends Component<LinearGradientProps> {}
