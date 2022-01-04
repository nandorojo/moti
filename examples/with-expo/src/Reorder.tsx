import React, { useState } from 'react'
import { StyleSheet, Pressable } from 'react-native'
import { Text, View } from 'moti'
import { Reorder } from 'moti/reorder'

function Item({ item }: { item: string }) {
  return (
    <View delay={300}>
      <Text
        style={{
          fontWeight: 'bold',
          padding: 16,
          backgroundColor: 'white',
          borderRadius: 8,
          marginBottom: 8,
          minWidth: 300,
          fontSize: 18,
        }}
      >
        {item}
      </Text>
    </View>
  )
}

export default function HelloWorld() {
  const [items, setItems] = useState(['🚗 Car', '🚴‍♂️ Bike', '🚢 Boat'])

  return (
    <Pressable style={styles.container}>
      <Reorder.Group values={items} onReorder={setItems}>
        {items.map((item) => (
          <Reorder.Item value={item} key={item}>
            <Item item={item} />
          </Reorder.Item>
        ))}
      </Reorder.Group>
      {/* {visible && <Shape />} */}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  shape: {
    justifyContent: 'center',
    height: 250,
    width: 250,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#9c1aff',
  },
})
