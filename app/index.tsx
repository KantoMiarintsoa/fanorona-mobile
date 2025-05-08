import Board from "@/components/Board";
import Menu from "@/components/Menu";
import { useRouter } from "expo-router";
import { View, Text } from "react-native";

export default function Index() {

  const router= useRouter();

  const handleMultiplayer = () => {
    router.push("/game?mode=multiplayer")
  };
  const handlePlayWithComputer = () => {
    console.log("Play with Computer");
  };
  const handleVs = () => {
    console.log("Vs");
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:"#0e1021"
      }}
    >
      {/* <Board/> */}
      <Menu 
        onMultiplayer={handleMultiplayer}
        onPlayWithComputer={handlePlayWithComputer}
        onVs={handleVs}
      />
    </View>
  );
}
