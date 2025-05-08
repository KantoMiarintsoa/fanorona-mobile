import { SharedValue } from "react-native-reanimated";

export type Piece = {
    row: number;
    col:number;
    player: "white" | "black"
};

export type Variant = "multiplayer" | "singleplayer" | "ai";