import { cols } from "@/constant";
import { Piece } from "@/types";

export function getAvailableMoves(pieces:Piece[], selectedPiece:Piece, previousPosition?:{col:number, row:number}, initialPosition?:{col:number, row:number}){
    // get first primitive move
    const {col, row} = selectedPiece;
    const moves:{col:number, row:number}[] = [];
    if(col>0){
        moves.push({col:col-1, row});
    }
    if(col<cols-1){
        moves.push({col:col+1, row});
    }
    if(row>0){
        moves.push({col, row:row-1});
    }
    if(row<cols-1){
        moves.push({col, row:row+1});
    }
    if(row%2===col%2){
        if(col<cols-1 && row<cols-1){
            moves.push({col:col+1, row:row+1});
        }
        if(col>0 && row<cols-1){
            moves.push({col:col-1, row:row+1});
        }
        if(col<cols-1 && row>0){
            moves.push({col:col+1, row:row-1});
        }
        if(col>0 && row>0){
            moves.push({col:col-1, row:row-1});
        }
    }

    let availableMoves:{col:number, row:number}[] = [];

    moves.forEach(move=>{
        // check if piece is already there
        const piece = pieces.find((piece)=>piece.col===move.col && piece.row===move.row);
        if(!piece){
            // check if there is an opponent piece in the same line
            const directionCol = Math.sign(move.col - selectedPiece.col);
            const directionRow = Math.sign(move.row - selectedPiece.row);

            const nextPiece = pieces.find(p=>(
                p.col === move.col + directionCol && p.row === move.row + directionRow && p.player !== selectedPiece.player ||
                p.col === selectedPiece.col - directionCol && p.row === selectedPiece.row - directionRow && p.player !== selectedPiece.player
            ))

            if(nextPiece)
                availableMoves.push(move);
        }
    });

    if(initialPosition){
        availableMoves = availableMoves.filter(move=>move.col !== initialPosition.col && move.row !== initialPosition.row);
    }

    // check if the move is in the same direction as the initial move
    if(previousPosition){
        // const directionCol = Math.sign(selectedPiece.col - previousPosition.col);
        // const directionRow = Math.sign(selectedPiece.row - previousPosition.row);

        // console.log(directionCol, directionRow);
        // console.log("next moves", availableMoves.filter(move=>move.col !== previousPosition.col && move.row !== previousPosition.row));
        // console.log("previous position", previousPosition);
        // availableMoves = availableMoves.filter(move=>move.col !== previousPosition.col && move.row !== previousPosition.row);
    }
    return availableMoves;
}

export function movePiece(pieces:Piece[], selectedPiece:Piece, move:{col:number, row:number}, reverse?:boolean){
    // remove piece from the same line
    let directionCol = Math.sign(move.col - selectedPiece.col);
    let directionRow = Math.sign(move.row - selectedPiece.row);

    let currentCol = move.col + directionCol;
    let currentRow = move.row + directionRow;

    // check if should go reverse
    if(reverse || (
        // no piece in the normal direction
        !pieces.find(p=>p.col === move.col + directionCol && p.row === move.row + directionRow && p.player !== selectedPiece.player)
    )){

        directionCol = -directionCol;
        directionRow = -directionRow;

        currentCol = selectedPiece.col + directionCol;
        currentRow = selectedPiece.row + directionRow;
    }

    const capturedPieces:Piece[] = [];

    while(true){
        const targetPiece = pieces.find((piece)=>piece.col===currentCol && piece.row===currentRow);
        if(!targetPiece || targetPiece.player === selectedPiece.player){
            break;
        }

        capturedPieces.push(targetPiece);
        currentCol += directionCol;
        currentRow += directionRow;
    }

    const remaingPieces = pieces.filter((piece)=>(
        !capturedPieces.includes(piece) &&
        !(piece.col === selectedPiece.col && piece.row === selectedPiece.row)
    ));

    return [...remaingPieces, {...selectedPiece, col:move.col, row:move.row}];
}

export function getAllPossibleMoves(pieces:Piece[], player:"white" | "black"){
    const playerPieces = pieces.filter((piece)=>piece.player === player);
    const moves:{piece:Piece, move:{col:number, row:number}}[] = [];
    playerPieces.forEach((piece)=>{
        const availableMoves = getAvailableMoves(pieces, piece);
        if(availableMoves.length > 0){
            availableMoves.forEach(move=>{
                moves.push({piece, move});
            });
        }
    });
    return moves;
}

export function isGameOver(pieces:Piece[], player:"white" | "black"){

    const opponentPieces = pieces.filter((piece)=>piece.player !== player);
    const playerPieces = pieces.filter((piece)=>piece.player === player);

    if(opponentPieces.length === 0){
        return player;
    }

    const moves = getAllPossibleMoves(pieces, player);
    const opponentMoves = getAllPossibleMoves(pieces, player === "white" ? "black" : "white");
    
    console.log("moves", opponentMoves);
    if(opponentMoves.length === 0){
        // get the player with weaker position
        if(playerPieces.length !== opponentPieces.length){
            return playerPieces.length > opponentPieces.length ? player : player === "white" ? "black" : "white";
        }

        return "draw";
    }    

    // continue the game
    return "continue";
}

export function getRandomMove(pieces:Piece[], player:"white" | "black"){
    const moves = getAllPossibleMoves(pieces, player);
    if(moves.length === 0){
        return null;
    }
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    return randomMove;
}

// export function getAvailableMovesFromPiece(pieces:Piece[], selectedPiece:Piece, previousPosition:{col:number, row:number}){
//     const moves = getAvailableMoves(pieces, selectedPiece);
    
//     // move shouldn't be in the same direction as the inital move
//     const directionCol = Math.sign(selectedPiece.col - previousPosition.col);
//     const directionRow = Math.sign(selectedPiece.row - previousPosition.row);

//     return moves.filter(move=>previousPosition.col + directionCol !== move.col && previousPosition.row + directionRow !== move.row);
// }