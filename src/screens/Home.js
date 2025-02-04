import React from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { songs } from "../MusicData";
import MusicListItem from "../common/MusicListItem";
export default function Home() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Music App</Text>
      </View>
      <FlatList
        data={songs}
        renderItem={({ item, index }) => {
          return <MusicListItem item={item} index={index} data={songs} />;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    backgroundColor: "#fff",
    width: "100%",
    elevation: 5,
    justifyContent: "center",
  },
  logo: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FF0D0D",
    marginLeft: 20,
  },
});
