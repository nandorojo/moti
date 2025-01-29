import * as React from 'react'
import {
  createNavigatorFactory,
  StackRouter,
  useNavigationBuilder,
  DefaultNavigatorOptions,
  ParamListBase,
  StackNavigationState,
} from '@react-navigation/native'
import type { AnimatePresence } from 'moti'
import { MotiStackView } from './moti-stack-view'

export type MotiStackEventMap = {
  onExitComplete: {
    data?: undefined
    canPreventDefault: false
  }
}

const createMotiStack = createNavigatorFactory(function MotiNavigator({
  initialRouteName,
  children,
  screenOptions,
  initial,
  exitBeforeEnter = true,
}: DefaultNavigatorOptions<
  ParamListBase,
  StackNavigationState<ParamListBase>,
  {},
  MotiStackEventMap
> &
  Pick<
    React.ComponentProps<typeof AnimatePresence>,
    'initial' | 'exitBeforeEnter'
  >) {
  const { state, descriptors, NavigationContent, navigation } =
    useNavigationBuilder<
      StackNavigationState<ParamListBase>,
      {},
      {},
      {},
      MotiStackEventMap
    >(StackRouter, {
      initialRouteName,
      children,
      screenOptions,
    })

  const onExitComplete = () => {
    navigation.emit({
      type: 'onExitComplete',
    })
  }

  const route = state.routes[state.index]

  return (
    <NavigationContent>
      <MotiStackView
        onExitComplete={onExitComplete}
        initial={initial}
        routeKey={route.key}
        exitBeforeEnter={exitBeforeEnter}
      >
        {descriptors[route.key].render()}
      </MotiStackView>
    </NavigationContent>
  )
})

export { createMotiStack }
