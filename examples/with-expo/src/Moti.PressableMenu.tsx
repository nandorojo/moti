import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  ViewProps,
  Platform,
} from 'react-native'
import React from 'react'
import {
  MotiPressable,
  useMotiPressable,
  useMotiPressableAnimatedProps,
} from '@motify/interactions'
import { MotiView } from 'moti'
import { Ionicons } from '@expo/vector-icons'

function MenuItemBg() {
  const state = useMotiPressable(
    'item',
    ({ hovered, pressed }) => ({
      opacity: hovered || pressed ? 0.4 : 0,
    }),
    []
  )

  return <MotiView state={state} style={styles.itemBg} />
}

function MenuItemArrow() {
  const state = useMotiPressable(
    'item',
    ({ hovered, pressed }) => ({
      opacity: hovered || pressed ? 1 : 0,
      translateX: hovered || pressed ? 0 : -10,
    }),
    []
  )

  return (
    <MotiView style={styles.itemArrow} state={state}>
      <Ionicons name="ios-arrow-forward" size={18} color="white" />
    </MotiView>
  )
}

function MenuItem({
  title,
  description,
  color,
  icon,
}: {
  title: string
  description: string
  color: string
  icon: React.ComponentProps<typeof Ionicons>['name']
}) {
  return (
    <MotiPressable style={styles.item} id="item">
      <MenuItemBg />
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Ionicons size={32} color="black" name={icon} />
      </View>
      <View style={styles.itemContent}>
        <View style={styles.titleContainer}>
          <Text style={[styles.text, styles.title]}>{title}</Text>
          <MenuItemArrow />
        </View>
        <Text style={[styles.text, styles.subtitle]}>{description}</Text>
      </View>
    </MotiPressable>
  )
}

function Dropdown() {
  const dropdownState = useMotiPressable(
    'menu',
    ({ hovered }) => {
      'worklet'

      return {
        opacity: hovered ? 1 : 0,
        translateY: hovered ? 0 : -5,
      }
    },
    []
  )
  const animatedProps = useMotiPressableAnimatedProps<ViewProps>(
    'menu',
    ({ hovered }) => {
      'worklet'

      console.log('hovered', hovered)
      return {
        pointerEvents: hovered ? 'auto' : 'none',
      }
    },
    []
  )

  return (
    <MotiView
      style={styles.dropdown}
      animatedProps={animatedProps}
      transition={{ type: 'timing' }}
    >
      <MotiView
        style={[styles.dropdownContent, shadow]}
        transition={{ type: 'timing', delay: 20 }}
        state={dropdownState}
      >
        <Text style={[styles.text, styles.heading]}>BeatGig Products</Text>
        <MenuItem
          title="Colleges"
          description="For Greek organizations & university program boards"
          color="#FFF500"
          icon="school-outline"
        />
        <MenuItem
          title="Venues"
          description="For bars, nightclubs, restaurants, country clubs, & vineyards"
          color="#50E3C2"
          icon="business-outline"
        />
        <MenuItem
          title="Artists"
          description="For artists, managers & agents"
          color="#FF0080"
          icon="mic-outline"
        />
      </MotiView>
    </MotiView>
  )
}

function TriggerBg() {
  const state = useMotiPressable(
    'trigger',
    ({ hovered, pressed }) => ({
      opacity: hovered || pressed ? 0.2 : 0,
    }),
    []
  )
  return <MotiView state={state} style={styles.triggerBg} />
}

function Trigger() {
  return (
    <MotiPressable id="trigger">
      <TriggerBg />
      <View style={styles.triggerContainer}>
        <Text style={[styles.text, styles.trigger]}>Our Products</Text>
        <Ionicons
          name="chevron-down"
          style={styles.chevron}
          color="white"
          size={20}
        />
      </View>
    </MotiPressable>
  )
}

function Menu() {
  return (
    <MotiPressable id="menu">
      <Trigger />
      <Dropdown />
    </MotiPressable>
  )
}

export default function MotiPressableMenu() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <Menu />
      </View>
    </SafeAreaView>
  )
}

const shadow = Platform.select({
  web: {
    boxShadow: `rgb(255 255 255 / 10%) 0px 50px 100px -20px, rgb(255 255 255 / 50%) 0px 30px 60px -30px`,
  },
}) as any

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  wrapper: {
    padding: 32,
    alignItems: 'flex-start',
  },
  text: {
    color: 'white',
    fontFamily: 'circular std',
    fontSize: 14,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    width: 500,
    paddingTop: 4,
    // left: 0,
  },
  dropdownContent: {
    // backgroundColor: '#1F2023',
    backgroundColor: 'black',
    paddingHorizontal: 16,
    borderRadius: 8,
    paddingVertical: 32,
  },
  trigger: {
    fontSize: 16,
    fontWeight: 'bold',
    alignItems: 'center',
  },
  triggerBg: {
    backgroundColor: 'white',
    borderRadius: 4,
    ...StyleSheet.absoluteFillObject,
  },
  heading: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: '#888888',
    marginLeft: 16,
    fontSize: 16,
  },
  item: {
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    marginTop: 8,
    overflow: 'hidden',
  },
  itemBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#333',
  },
  iconContainer: {
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#888888',
    fontWeight: '500',
  },
  itemContent: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemArrow: {
    marginLeft: 4,
  },
  chevron: {
    marginTop: 1,
    marginLeft: 8,
  },
  triggerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginVertical: 8,
  },
})
