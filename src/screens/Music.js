import React, { useEffect, useRef, useState } from "react";

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import Slider from "@react-native-community/slider";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

//import { FlatList } from "react-native-gesture-handler";
import { songs } from "../MusicData";
import TrackPlayer, {
  Capability,
  usePlaybackState,
  useProgress,
  State,
} from "react-native-track-player";
const { height, width } = Dimensions.get("window");

export default function Music() {
  const route = useRoute();
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const [currentSong, setCurrentSong] = useState(route.params.index);
  const ref = useRef();
  useEffect(() => {
    setTimeout(() => {
      ref.current.scrollToIndex({
        animated: true,
        index: currentSong,
      });
    }, 10);
  }, []);

  useEffect(() => {
    setupPlayer();
  }, []);

  const setupPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        // Media controls capabilities
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
        ],

        // Capabilities that will show up when the notification is in the compact form on Android
        compactCapabilities: [Capability.Play, Capability.Pause],

        // Icons for the notification on Android (if you don't like the default ones)
      });
      await TrackPlayer.add(songs);
      await TrackPlayer.skip(currentSong);
      togglePlayback(playbackState);
    } catch (error) {}
  };

  const togglePlayback = async (playbackState) => {
    try {
      const newPlaybackState = await TrackPlayer.getState();
      console.log("New Playback State:", newPlaybackState);

      if (
        newPlaybackState === State.Paused ||
        newPlaybackState === State.Ready ||
        newPlaybackState === State.Buffering ||
        newPlaybackState === State.Loading
      ) {
        await TrackPlayer.play();
      } else {
        await TrackPlayer.pause();
      }
      console.log("Playback State After Toggle:", await TrackPlayer.getState());
    } catch (error) {
      console.error("Toggle Playback Error:", error);
    }
  };

  ///////////
  //   const togglePlayback = async () => {
  //     const newPlaybackState = await TrackPlayer.getState();
  //     console.log(newPlaybackState);

  //     if (newPlaybackState === State.Paused || newPlaybackState === State.Ready) {
  //       await TrackPlayer.play();
  //     } else {
  //       await TrackPlayer.pause();
  //     }
  //   };
  ///////////////////
  //   const togglePlayback = async () => {
  //     try {
  //       const newPlaybackState = await TrackPlayer.getState();
  //       console.log("New Playback State:", newPlaybackState);

  //       if (
  //         newPlaybackState === State.Paused ||
  //         newPlaybackState === State.Ready
  //       ) {
  //         console.log("Attempting to play");
  //         await TrackPlayer.play();
  //       } else {
  //         console.log("Attempting to pause");
  //         await TrackPlayer.pause();
  //       }
  //     } catch (error) {
  //       console.error("Error in togglePlayback:", error);
  //     }
  //   };

  return (
    <View style={styles.container}>
      {/* <Image source={route.params.data.image} style={styles.banner} /> */}
      <View>
        <FlatList
          horizontal
          ref={ref}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          data={songs}
          onScroll={async (e) => {
            const x = e.nativeEvent.contentOffset.x / width;
            setCurrentSong(parseInt(x.toFixed(0)));
            await TrackPlayer.skip(parseInt(x.toFixed(0)));
            togglePlayback(playbackState);
          }}
          renderItem={({ item, index }) => {
            return (
              <View style={styles.bannerView}>
                <Image source={item.image} style={styles.banner} />
                <Text style={styles.name}>{item.title}</Text>
                <Text style={styles.name}>{item.singer}</Text>
              </View>
            );
          }}
        />
      </View>

      <View style={styles.sliderView}>
        <Slider
          style={styles.sliderView}
          value={progress.position}
          maximumValue={progress.duration}
          minimumValue={0}
          custom
          minimumTrackTintColor="black"
          thumbTintColor={"black"}
          onValueChange={async (value) => {
            await TrackPlayer.seekTo(value);
          }}
        />
      </View>
      <View style={styles.btnArea}>
        <TouchableOpacity
          onPress={async () => {
            if (currentSong > 0) {
              setCurrentSong(currentSong - 1);
              ref.current.scrollToIndex({
                animated: true,
                index: parseInt(currentSong) - 1,
              });
              //   await TrackPlayer.skipToPrevious();
              await TrackPlayer.skip(parseInt(currentSong) - 1);
              togglePlayback(playbackState);
            }
          }}
        >
          <AntDesign name="banckward" size={35} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            togglePlayback();
          }}
        >
          {playbackState === State.Paused ? (
            <AntDesign name="play" size={35} color="black" />
          ) : (
            <AntDesign name="pausecircle" size={35} color="black" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => {
            if (songs.length - 1 > currentSong) {
              setCurrentSong(currentSong + 1);
              ref.current.scrollToIndex({
                animated: true,
                index: parseInt(currentSong) + 1,
              });
              //   await TrackPlayer.skipToNext();
              await TrackPlayer.skip(parseInt(currentSong) + 1);
              togglePlayback(playbackState);
            }
          }}
        >
          <AntDesign name="forward" size={35} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.btnArea}>
        <TouchableOpacity>
          <Feather name="repeat" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="shuffle" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bannerView: {
    width: width,
    height: height / 2 - 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 50,
  },
  banner: {
    width: "90%",
    height: "100%",

    borderRadius: 10,
  },
  name: {
    marginTop: 10,
    fontSize: 20,
    marginLeft: 20,
    fontWeight: "700",
    color: "#000",
  },
  sliderView: {
    marginTop: 10,
    alignItems: "center",
    width: "90%",
    marginLeft: 10,
  },
  btnArea: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
});
