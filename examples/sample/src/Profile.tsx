import { MotiText, MotiView, ScrollView } from 'moti'
import { useReducer, useRef, useState } from 'react'
import { Modal, Pressable, Text, TextInput, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated'

const randomEmojis = [
  '👋',
  '👍',
  '👎',
  '👊',
  '👏',
  '👐',
  '👋',
  '👍',
  '👎',
  '👊',
  '👏',
  '👐',
]

export function Profile() {
  const [lib, _setlib] = useState<'moti' | 'reanimated' | 'vanilla' | null>(
    null
  )
  const [count, setcount] = useState(100)
  const openedAt = useRef({
    at: 0,
    lib: null as typeof lib,
  })
  const setlib = (l: typeof lib) => {
    openedAt.current = {
      at: Date.now(),
      lib: l,
    }
    _setlib(l)
  }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 32,
      }}
    >
      <TextInput
        value={count.toString()}
        onChangeText={(text) => setcount(Number(text))}
        keyboardType="numeric"
      />
      <Pressable onPress={() => setlib('moti')}>
        <Text>Moti</Text>
      </Pressable>
      <Pressable onPress={() => setlib('reanimated')}>
        <Text>Reanimated</Text>
      </Pressable>
      <Pressable onPress={() => setlib('vanilla')}>
        <Text>Vanilla</Text>
      </Pressable>
      <Modal
        visible={lib != null}
        onRequestClose={() => setlib(null)}
        presentationStyle="formSheet"
        animationType="slide"
      >
        <Text
          style={{
            textTransform: 'capitalize',
            fontWeight: 'bold',
            padding: 16,
          }}
        >
          {lib}
        </Text>
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }}
          >
            {new Array(count).fill(0).map((_, i) => {
              if (!lib) return null
              const emoji = randomEmojis[i % randomEmojis.length]
              const itemEmoji = {
                reanimated: '🔄',
                moti: '🐼',
                vanilla: '🍦',
              }[lib]
              const item = {
                moti: () => <MotiItem>{emoji}</MotiItem>,
                reanimated: () => <ReanimatedItem>{emoji}</ReanimatedItem>,
                vanilla: () => <VanillaItem>{emoji}</VanillaItem>,
              } satisfies {
                [key in NonNullable<typeof lib>]: () => React.ReactNode
              }
              let onLayout: any
              if (i === count - 1) {
                onLayout = () => {
                  const now = Date.now()
                  const duration = now - openedAt.current.at
                  console.log(
                    `\n${itemEmoji} ${duration / count}ms per item
                        
${itemEmoji} ${duration}ms to render ${count} items (☂️ ${lib})\n`
                  )
                }
              }
              return (
                <View
                  key={i}
                  style={{
                    height: 100,
                    width: '25%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onLayout={onLayout}
                >
                  {item[lib]()}
                </View>
              )
            })}
          </ScrollView>
        </View>
      </Modal>
    </View>
  )
}

function MotiItem({ children }: { children: string }) {
  return (
    <MotiText
      from={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      delay={300}
    >
      {children}
    </MotiText>
  )
}

function ReanimatedItem({ children }: { children: string }) {
  const sv = useSharedValue(1)
  const dv = useDerivedValue(() => sv.value * 0 + 400 + '')
  return (
    <Animated.Text
      style={useAnimatedStyle(
        () => ({
          opacity: sv.value,
          fontWeight: dv.value as any,
        }),
        [sv, dv]
      )}
    >
      {children}
    </Animated.Text>
  )
}

function VanillaItem({ children }: { children: string }) {
  return <Text>{children}</Text>
}
