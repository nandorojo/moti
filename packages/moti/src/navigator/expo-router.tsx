import { Navigator } from 'expo-router'
import { MotiStackView } from './moti-stack-view'
import { StackRouter } from '@react-navigation/native'

export function MotiStack(
  props: React.ComponentProps<typeof Navigator> &
    React.ComponentProps<typeof Child>
) {
  return (
    <Navigator
      {...props}
      router={StackRouter}
      initialRouteName={props.initialRouteName}
    >
      <Child {...props} />
    </Navigator>
  )
}

function Child(
  props: Pick<
    React.ComponentProps<typeof MotiStackView>,
    'initial' | 'exitBeforeEnter' | 'onExitComplete'
  >
) {
  const { state } = Navigator.useContext()

  const route = state.routes[state.index]

  return (
    <MotiStackView routeKey={route.key} {...props}>
      <Navigator.Slot />
    </MotiStackView>
  )
}
