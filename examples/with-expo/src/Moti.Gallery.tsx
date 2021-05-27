import { MotiImage, AnimatePresence, Text } from 'moti'
import React, { useState } from 'react'
import { StyleSheet, View, Image, Dimensions } from 'react-native'

// const photos: { url: string }[] = new Array(50).fill('').map((_, i) => ({
//   url: `https://source.unsplash.com/random?sig=${i}`,
// }))

const photos = [
  `https://images.unsplash.com/photo-1551871812-10ecc21ffa2f?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=929&q=80`,
  `https://images.unsplash.com/photo-1530447920184-b88c8872?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTN8fHJvY2tldHxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60`,
  `https://images.unsplash.com/photo-1581069700310-8cf2e1b6baf0?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MjF8fHJvY2tldHxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60`,
  `https://images.unsplash.com/photo-1562802378-063ec186a863?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTJ8fHN1c2hpfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60`,
].map((url) => ({ url }))

const size = Dimensions.get('window')

const width = size.width

export default function Gallery() {
  const [[index, direction], setIndex] = useState([0, 0])

  // React.useEffect(() => {
  //   photos.forEach(({ url }) => {
  //     Image.prefetch(url).catch(() => console.log('🥸'))
  //   })
  // }, [])

  const paginate = (direction: 1 | -1) => () => {
    setIndex(([current]) => {
      const nextIndex = current + direction
      // if (nextIndex > photos.length - 1) return [0, direction * -1]

      // if (nextIndex < 0) return [photos.length - 1, direction * -1]

      // return [nextIndex, direction]

      const normalizedIndex = Math.max(
        0,
        Math.min(nextIndex, photos.length - 1)
      )
      return [normalizedIndex, direction]
    })
  }

  const { url } = photos[index]

  return (
    <View style={styles.container}>
      <AnimatePresence>
        <MotiImage
          from={{
            opacity: 0,
            translateX: direction < 0 ? width : -width,
          }}
          animate={{
            opacity: 1,
            translateX: 0,
          }}
          exit={{
            opacity: 0,
            translateX: direction < 0 ? -width : width,
          }}
          style={styles.image}
          key={url}
          source={{ uri: url }}
        />
      </AnimatePresence>
      <View style={styles.actions}>
        <View style={styles.action}>
          <Text style={styles.button} onPress={paginate(-1)}>
            👈
          </Text>
        </View>
        <View style={styles.action}>
          <Text style={styles.button} onPress={paginate(1)}>
            👉
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#0D1117',
  },
  padded: {
    padding: 16,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width,
    alignSelf: 'center',
  },
  actions: {
    flexDirection: 'row',
    margin: 16,
    justifyContent: 'space-between',
  },
  button: {
    fontSize: 42,
  },
  action: {
    backgroundColor: 'white',
    paddingHorizontal: 8,
    borderRadius: 16,
  },
})
