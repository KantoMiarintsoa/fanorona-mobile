import { cols, rows, padding, radius } from "@/constant";
import { getAvailableMoves, isGameOver, movePiece } from "@/lib/game-logic";
import { Piece, Variant } from "@/types";
import { Canvas, Circle, Line  } from "@shopify/react-native-skia";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Button from "./Button";
import { Alert, Image, Modal, TouchableOpacity, View } from "react-native";
import Typography from "./Typography";
import Menu from "./Menu";
import { SharedValue, useSharedValue } from "react-native-reanimated";

type LineProps = {
  p1:{x:number, y:number},
  p2:{x:number, y:number}
};

const Board = () => {

  const [dimension, setDimension] = useState({
    width:0,
    height:0
  });

  const [lines, setLines] = useState<LineProps[]>([])
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<Piece|null>(null);
  const [turn, setTurn]= useState<"white"|"black">("white");
  const [availableMoves, setAvailableMoves] = useState<{col:number, row:number}[]>([]);
  const [mode, setMode] = useState<Variant>("multiplayer");
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [initialPosition, setInitialPosition] = useState<{col:number, row:number}|undefined>(undefined)

  const {mode:queryMode} = useLocalSearchParams<{mode:Variant}>();

  
  const [spacingX, spacingY] = useMemo(()=>{
    const {width, height} = dimension;

    return [
      Math.floor((width - padding * 2) / (cols-1)),
      Math.floor((height - padding * 2) / (rows -1))
    ];
  }, [dimension]);

  const initialPositions = useMemo(()=>{
    const positions: {col:number, row:number, cx:number, cy:number}[] = [];

    for(let col=0; col<cols; col++){
      for(let row=0; row<rows; row++){
        const cx = padding + spacingX * col;
        const cy = padding + spacingY * row;

        positions.push({
          col, 
          row,
          cx,
          cy
        });
      }
    }

    return positions;
  }, [spacingX, spacingY]);

  const positionsValue = useSharedValue(initialPositions);

  const startGame = ()=>{
    setMode(queryMode);
    setupPiece();
    setTurn("white");
    setSelectedPiece(null);
    setAvailableMoves([]);
  }

  function setupPiece() {
    const initialPieces: Piece[] = [];
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        if (row === 2 && col === 4) {
          continue;
        }

        let color: "white" | "black" = "black";
        if (row > 2) {
          color = "white";
        } else if (row == 2) {
          if (col < 4) {
            color = col % 2 === 0 ? "black" : "white";
          } else {
            color = col % 2 === 0 ? "white" : "black";
          }
        }

        // const {cx, cy} = initialPositions.find(
        //   (pos) => pos.col === col && pos.row === row
        // )!;

        initialPieces.push({
          row,
          col,
          player: color,
        });
      }
    }

    setPieces(initialPieces);
  }


  useEffect(()=>{

    const {width, height} = dimension;


    if(width===0 || height===0)
      return;

    const lines:LineProps[] = [];

    for(let col=0; col< cols; col++){
      const p2y = (rows - 1) * spacingY + padding;
      const p1y = padding;

      const px = padding + spacingX * col;

      lines.push({
        p1:{x:px, y:p1y},
        p2:{x:px, y:p2y}
      });
    }

    // horizontal line
    for(let row=0; row < rows; row++){
      const py = padding + spacingY * row;

      const p1x = padding;
      const p2x = width - padding;

      lines.push({
        p1:{x:p1x, y:py},
        p2:{x:p2x, y:py}
      });
    }

    for(let col=0; col<cols; col+=2){
      for(let row=0; row<rows; row+=2){
        const x = padding + spacingX * col;
        const y = padding + spacingY * row;

        // to right
        if(col<cols-1 && row< rows-1){
          lines.push({
            p1:{x, y},
            p2:{x:x+spacingX*2, y:y+spacingY*2}
          });
        }

        // to left
        if(col>0 && row < rows -1){
          lines.push({
            p1:{x, y},
            p2:{x:x-spacingX*2, y:y+spacingY*2}
          });
        }

      }
    }

    setLines(lines);
  }, [dimension]);

  useEffect(()=>{
    startGame();
  }, [queryMode])

  const handleTouch = ({locationX, locationY}:{locationX:number, locationY:number})=>{
    for(let col=0; col<cols; col++){
      for(let row=0; row<rows; row++){
        const x = padding + spacingX * col;
        const y = padding + spacingY * row;

        if((locationX > x-radius && locationX < x+radius) && (locationY > y-radius && locationY < y+radius)){
          // check if piece is there
          const piece = pieces.find((piece)=>piece.col===col && piece.row===row);

          if(!piece){

            // logic to move the piece
            if(!selectedPiece)return;

            const newPieces = movePiece(pieces, selectedPiece, {col, row});
            setPieces(newPieces);
            if(!initialPosition){
              setInitialPosition({col, row});
              console.log("initial position", {col, row});
            }
            const availableMoves = getAvailableMoves(
              newPieces, 
              {col, row, player:turn},
              {col: selectedPiece.col, row: selectedPiece.row},
              initialPosition
            );

            if(availableMoves.length === 0){
              // TODO: check if the game is over
              const gameStatus = isGameOver(pieces, turn);
              console.log(gameStatus);
              if(gameStatus!=="continue"){
                Alert.alert("Game Over", gameStatus==="draw"?"Draw":`${gameStatus.toUpperCase()} wins!`);
                return;
              }

              // turn to the other player
              setTurn(prev=>prev==="white"?"black":"white");
              setInitialPosition(undefined);
              setSelectedPiece(null);
            }
            setSelectedPiece({col, row, player:turn});
            setAvailableMoves([]);
            return;
          }

          if(piece.player !==turn)
            return;

          // select piece and get available moves
          const moves = getAvailableMoves(pieces, piece);
          setAvailableMoves(moves);
          setSelectedPiece(piece);
        }
      }
    }
  }

  return (
    <View style={{
        flex:1,
        width:"100%",
        display:"flex",
        position:"relative",
    }}>
      <View style={{
        position:"absolute",
        top:5,
        right:5,
        zIndex:1000
      }}>
        <Button onPress={()=>setIsMenuVisible(true)}>
          <Image
            source={require("@/assets/images/menu.png")}
            style={{ width: 25, height: 25, resizeMode: "contain" }}
          />
        </Button>
      </View>
      <Canvas style={{
        flex:1,
      }}
        onLayout={(event)=>{
          const {width, height} = event.nativeEvent.layout;
          setDimension({width, height});
        }}
        onTouchStart={(event)=>{
          handleTouch(event.nativeEvent);
        }}
      >
        {lines.map((line, index)=>(
          <Line
            p1={line.p1}
            p2={line.p2}
            key={index}
            strokeWidth={2}
            color={"white"}
          />
        ))}

        {pieces.map((piece, index)=>{

          const cx = padding + spacingX * piece.col;
          const cy = padding + spacingY * piece.row;

          return (
            <Circle
              cx={cx}
              cy={cy}
              r={radius}
              color={piece.player==="black"?"#3a3f4b":"#fff"}
              key={index}
            />
          )
        })}

        {selectedPiece && availableMoves.map((move, index)=>{
          const x = padding + spacingX * move.col;
          const y = padding + spacingY * move.row;

          return (
            <Circle
              cx={x}
              cy={y}
              r={radius+1}
              color={"#f5f542"}
              key={index}
            />
          )
        })}

        {/* selected piece border color */}
        {selectedPiece && (
          <Circle
            cx={padding + spacingX * selectedPiece.col}
            cy={padding + spacingY * selectedPiece.row}
            r={radius+1}
            color={"#f5f542"}
            style={"stroke"}
            strokeWidth={4}
          />
        )}
      </Canvas>
      <Modal
        visible={isMenuVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={()=>setIsMenuVisible(false)}
      >
        <View
          style={{
            flex:1,
            justifyContent:"center",
            alignItems:"center",
            backgroundColor:"rgba(0,0,0,0.5)",
            display:"flex",
            flexDirection:"column",
            position:'relative'
          }}
        >
          <Menu
            onMultiplayer={()=>{}}
            onPlayWithComputer={()=>{}}
            onVs={()=>{}}
          >
            <Button>
              <Typography>QUIT</Typography>
            </Button>
          </Menu>

          <TouchableOpacity
            style={{
              position:"absolute",
              top:10,
              right:10
            }}
            onPress={()=>setIsMenuVisible(false)}
          >
            <Image
              source={require("@/assets/images/close.png")}
              style={{
                width: 25,
                height: 25,
                resizeMode: "contain"
              }}
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
}

export default Board