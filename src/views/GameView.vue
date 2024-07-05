<script setup>
import SvgIcon from '@jamescoyle/vue-icon'
import {
  mdiChessPawn,
  mdiChessBishop,
  mdiChessKnight,
  mdiChessRook,
  mdiChessQueen,
  mdiChessKing
} from '@mdi/js'
import { ref } from 'vue'

const preventableModal = ref(false)
const promotionColor = ref('')
const promotionPosition = ref([])

const winnerModal = ref(false)
const winner = ref('')

const handlePromotion = (piece) => {
  let nPiece = piece
  if (promotionColor.value === 'white') {
    nPiece += 7
  }
  chessBoard.value[promotionPosition.value[0]][promotionPosition.value[1]] = nPiece
  preventableModal.value = false
  calculateCheck(chessBoard.value)
}

const chessIcons = [
  '',
  mdiChessPawn,
  mdiChessBishop,
  mdiChessKnight,
  mdiChessRook,
  mdiChessQueen,
  mdiChessKing
]
const chessBoard = ref([
  [4, 3, 2, 5, 6, 2, 3, 4],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [8, 8, 8, 8, 8, 8, 8, 8],
  [11, 10, 9, 12, 13, 9, 10, 11]
]) // 1: 폰, 2: 비숍, 3: 나이트, 4: 룩, 5: 퀸, 6: 킹, *백은 +7

const isWhiteTurn = ref(true)

const selectedPiece = ref([])

const canMovePiece = ref([])

const capturedPiece = ref([])

const enPassant = ref([])

const isWhiteChecked = ref(false)
const isBlackChecked = ref(false)

const isCanMovePiece = (row, col) => {
  for (let i = 0; i < canMovePiece.value.length; i++) {
    if (canMovePiece.value[i][0] == row && canMovePiece.value[i][1] == col) {
      return true
    }
  }
  return false
}

const pieceDistances = {
  Bishop: [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1]
  ],
  Knight: [
    [2, 1],
    [2, -1],
    [1, 2],
    [1, -2],
    [-1, 2],
    [-1, -2],
    [-2, 1],
    [-2, -1]
  ],
  Rook: [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ],
  Queen: [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1]
  ],
  King: [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1]
  ]
}

const isMovedCastling = ref({
  WK: false,
  WLR: false,
  WRR: false,
  BK: false,
  BLR: false,
  BRR: false
}) // W: 백, B: 흑, K: 킹, R: left/right 룩

const resetChessBoard = () => {
  chessBoard.value = [
    [4, 3, 2, 5, 6, 2, 3, 4],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [8, 8, 8, 8, 8, 8, 8, 8],
    [11, 10, 9, 12, 13, 9, 10, 11]
  ]
  isWhiteTurn.value = true
  selectedPiece.value = []
  canMovePiece.value = []
  capturedPiece.value = []
  enPassant.value = []
  isWhiteChecked.value = false
  isBlackChecked.value = false
  promotionColor.value = ''
  promotionPosition.value = []
  winner.value = ''
  winnerModal.value = false
  isMovedCastling.value = {
    WK: false,
    WLR: false,
    WRR: false,
    BK: false,
    BLR: false,
    BRR: false
  }
}

const handleChessMouseOver = (row, col, e) => {
  const piece = chessBoard.value[row][col]
  if (
    (isWhiteTurn.value && piece >= 8 && piece <= 13) ||
    (!isWhiteTurn.value && piece >= 1 && piece <= 6) ||
    isCanMovePiece(row, col)
  ) {
    e.target.style.cursor = 'pointer'
  }
}

const clickChessBoard = (row, col) => {
  const piece = chessBoard.value[row][col]
  // 기물 선택
  if (
    (isWhiteTurn.value && piece >= 8 && piece <= 13) ||
    (!isWhiteTurn.value && piece >= 1 && piece <= 6)
  ) {
    canMovePiece.value = []
    selectedPiece.value = [row, col]
    // 흑색 폰인 경우
    if (piece === 1) {
      // 움직일 수 있다면
      if (chessBoard.value[row + 1][col] == 0) {
        canMovePiece.value = [[row + 1, col]]
        // 2칸 전진 가능한 경우
        if (row == 1) {
          canMovePiece.value.push([row + 2, col])
        }
      }
      const distances = [
        [1, 1],
        [1, -1]
      ]
      // 잡을 말이 있는지 확인
      for (let i = 0; i < distances.length; i++) {
        const nr = row + distances[i][0]
        const nc = col + distances[i][1]
        if (nc >= 0 && nc < 8) {
          if (chessBoard.value[nr][nc] >= 8 && chessBoard.value[nr][nc] < 13) {
            canMovePiece.value.push([nr, nc])
          } else if (
            enPassant.value.length > 0 &&
            enPassant.value[0] == nr &&
            enPassant.value[1] == nc
          ) {
            // 앙파상
            canMovePiece.value.push([nr, nc])
          }
        }
      }
    }
    // 백색 폰인 경우
    else if (piece === 8) {
      // 움직일 수 있다면
      if (chessBoard.value[row - 1][col] === 0) {
        canMovePiece.value = [[row - 1, col]]
        // 2칸 전진 가능한 경우
        if (row == 6) {
          canMovePiece.value.push([row - 2, col])
        }
      }
      const distances = [
        [-1, 1],
        [-1, -1]
      ]
      // 잡을 말이 있는지 확인
      for (let i = 0; i < distances.length; i++) {
        const nr = row + distances[i][0]
        const nc = col + distances[i][1]
        if (nc >= 0 && nc < 8) {
          if (chessBoard.value[nr][nc] >= 1 && chessBoard.value[nr][nc] < 6) {
            canMovePiece.value.push([nr, nc])
          } else if (
            enPassant.value.length > 0 &&
            enPassant.value[0] == nr &&
            enPassant.value[1] == nc
          ) {
            // 앙파상
            canMovePiece.value.push([nr, nc])
          }
        }
      }
    }
    // 나이트인 경우
    else if (piece === 3 || piece === 10) {
      const distances = pieceDistances.Knight
      for (let i = 0; i < distances.length; i++) {
        const nr = row + distances[i][0]
        const nc = col + distances[i][1]
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
          const nPiece = chessBoard.value[nr][nc]
          if (
            nPiece === 0 ||
            (isWhiteTurn.value && nPiece >= 1 && nPiece <= 6) ||
            (!isWhiteTurn.value && nPiece >= 8 && nPiece <= 13)
          ) {
            canMovePiece.value.push([nr, nc])
          }
        }
      }
    }
    // 비숍인 경우
    else if (piece === 2 || piece === 9) {
      const distances = pieceDistances.Bishop
      for (let i = 0; i < distances.length; i++) {
        let nr = row + distances[i][0]
        let nc = col + distances[i][1]
        while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
          const nPiece = chessBoard.value[nr][nc]
          if (nPiece != 0) {
            if (
              (isWhiteTurn.value && nPiece >= 1 && nPiece <= 6) ||
              (!isWhiteTurn.value && nPiece >= 8 && nPiece <= 13)
            ) {
              canMovePiece.value.push([nr, nc])
            }
            break
          } else {
            canMovePiece.value.push([nr, nc])
          }

          nr += distances[i][0]
          nc += distances[i][1]
        }
      }
    }
    // 룩인 경우
    else if (piece === 4 || piece === 11) {
      const distances = pieceDistances.Rook
      for (let i = 0; i < distances.length; i++) {
        let nr = row + distances[i][0]
        let nc = col + distances[i][1]
        while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
          const nPiece = chessBoard.value[nr][nc]
          if (nPiece != 0) {
            if (
              (isWhiteTurn.value && nPiece >= 1 && nPiece <= 6) ||
              (!isWhiteTurn.value && nPiece >= 8 && nPiece <= 13)
            ) {
              canMovePiece.value.push([nr, nc])
            }
            break
          } else {
            canMovePiece.value.push([nr, nc])
          }

          nr += distances[i][0]
          nc += distances[i][1]
        }
      }
    }
    // 퀸인 경우
    else if (piece === 5 || piece === 12) {
      const distances = pieceDistances.Queen
      for (let i = 0; i < distances.length; i++) {
        let nr = row + distances[i][0]
        let nc = col + distances[i][1]
        while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
          const nPiece = chessBoard.value[nr][nc]
          if (nPiece != 0) {
            if (
              (isWhiteTurn.value && nPiece >= 1 && nPiece <= 6) ||
              (!isWhiteTurn.value && nPiece >= 8 && nPiece <= 13)
            ) {
              canMovePiece.value.push([nr, nc])
            }
            break
          } else {
            canMovePiece.value.push([nr, nc])
          }

          nr += distances[i][0]
          nc += distances[i][1]
        }
      }
    }
    // 킹인 경우
    else if (piece === 6 || piece === 13) {
      const distances = pieceDistances.King
      for (let i = 0; i < distances.length; i++) {
        let nr = row + distances[i][0]
        let nc = col + distances[i][1]
        if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) {
          continue
        }
        const nPiece = chessBoard.value[nr][nc]
        if (nPiece != 0) {
          if (
            (isWhiteTurn.value && nPiece >= 1 && nPiece <= 6) ||
            (!isWhiteTurn.value && nPiece >= 8 && nPiece <= 13)
          ) {
            canMovePiece.value.push([nr, nc])
          }
        } else {
          canMovePiece.value.push([nr, nc])
        }
      }

      // 캐슬링
      // 흑
      if (piece === 6 && !isMovedCastling.value.BK && !isWhiteChecked.value) {
        // 퀸사이드 캐슬링
        if (
          !isMovedCastling.value.BLR &&
          chessBoard.value[0][1] === 0 &&
          chessBoard.value[0][2] === 0 &&
          chessBoard.value[0][3] === 0
        ) {
          let arr = chessBoard.value.map((v) => [...v])
          arr[0][3] = 6
          arr[0][4] = 0
          calculateCheck(arr)
          if (!isWhiteChecked.value) {
            canMovePiece.value.push([0, 2])
          }
          isBlackChecked.value = false
          isWhiteChecked.value = false
        }
        // 킹사이드 캐슬링
        if (
          !isMovedCastling.value.BRR &&
          chessBoard.value[0][5] === 0 &&
          chessBoard.value[0][6] === 0
        ) {
          let arr = chessBoard.value.map((v) => [...v])
          arr[0][5] = 6
          arr[0][4] = 0
          calculateCheck(arr)
          if (!isWhiteChecked.value) {
            canMovePiece.value.push([0, 6])
          }
          isBlackChecked.value = false
          isWhiteChecked.value = false
        }
      }
      // 백
      else if (piece === 13 && !isMovedCastling.value.WK && !isBlackChecked.value) {
        // 퀸사이드 캐슬링
        if (
          !isMovedCastling.value.WLR &&
          chessBoard.value[7][1] === 0 &&
          chessBoard.value[7][2] === 0 &&
          chessBoard.value[7][3] === 0
        ) {
          let arr = chessBoard.value.map((v) => [...v])
          arr[7][3] = 6
          arr[7][4] = 0
          calculateCheck(arr)
          if (!isBlackChecked.value) {
            canMovePiece.value.push([7, 2])
          }
          isBlackChecked.value = false
          isWhiteChecked.value = false
        }
        // 킹사이드 캐슬링
        if (
          !isMovedCastling.value.WRR &&
          chessBoard.value[7][5] === 0 &&
          chessBoard.value[7][6] === 0
        ) {
          let arr = chessBoard.value.map((v) => [...v])
          arr[7][5] = 6
          arr[7][4] = 0
          calculateCheck(arr)
          if (!isBlackChecked.value) {
            canMovePiece.value.push([7, 6])
          }
          isBlackChecked.value = false
          isWhiteChecked.value = false
        }
      }
    }

    // 이동했을 때 체크가 아닌 위치인지 확인
    let isWhiteCheckedClone = isWhiteChecked.value
    let isBlackCheckedClone = isBlackChecked.value
    for (let i = 0; i < canMovePiece.value.length; i++) {
      const [nr, nc] = canMovePiece.value[i]
      let arr = chessBoard.value.map((v) => [...v])
      arr[nr][nc] = chessBoard.value[row][col]
      arr[row][col] = 0
      isWhiteChecked.value = false
      isBlackChecked.value = false
      calculateCheck(arr)
      if (
        (isWhiteTurn.value && isBlackChecked.value) ||
        (!isWhiteTurn.value && isWhiteChecked.value)
      ) {
        canMovePiece.value.splice(i--, 1)
      }
    }
    isWhiteChecked.value = isWhiteCheckedClone
    isBlackChecked.value = isBlackCheckedClone
  }
  // 기물 이동
  else if (isCanMovePiece(row, col)) {
    const to = chessBoard.value[row][col]
    // 잡았을 때
    if (to != 0) {
      capturedPiece.value.push(to)
    }
    const piece = chessBoard.value[selectedPiece.value[0]][selectedPiece.value[1]]
    // 앙파상일 때
    if (enPassant.value.length > 0 && enPassant.value[0] == row && enPassant.value[1] == col) {
      if (isWhiteTurn.value) {
        chessBoard.value[row + 1][col] = 0
        capturedPiece.value.push(1)
      } else {
        chessBoard.value[row - 1][col] = 0
        capturedPiece.value.push(8)
      }
    }
    // 캐슬링일 때
    if ((piece === 6 || piece === 13) && Math.abs(selectedPiece.value[1] - col) == 2) {
      let add = 0
      if (piece === 13) {
        isMovedCastling.value.WK = true
        add = 7
      } else {
        isMovedCastling.value.BK = true
      }
      // 퀸사이드 캐슬링
      if (selectedPiece.value[1] > col) {
        chessBoard.value[selectedPiece.value[0]][3] = 4 + add
        chessBoard.value[selectedPiece.value[0]][0] = 0
      }
      // 킹사이드 캐슬링
      else {
        chessBoard.value[selectedPiece.value[0]][5] = 4 + add
        chessBoard.value[selectedPiece.value[0]][7] = 0
      }
    }

    // 이동 확인
    if (piece === 6) {
      isMovedCastling.value.BK = true
    } else if (piece === 13) {
      isMovedCastling.value.WK = true
    } else if (piece === 4) {
      if (selectedPiece.value[1] === 0) {
        isMovedCastling.value.BLR = true
      } else if (selectedPiece.value[1] === 7) {
        isMovedCastling.value.BRR = true
      }
    } else if (piece === 11) {
      if (selectedPiece.value[1] === 0) {
        isMovedCastling.value.WLR = true
      } else if (selectedPiece.value[1] === 7) {
        isMovedCastling.value.WRR = true
      }
    }

    // 초기화
    enPassant.value = []
    isWhiteChecked.value = false
    isBlackChecked.value = false

    // 폰이 두칸 움직일 경우 앙파상 확인용 데이터 저장
    if (piece === 1 && row - selectedPiece.value[0] === 2) {
      enPassant.value = [row - 1, col]
    } else if (piece === 8 && selectedPiece.value[0] - row === 2) {
      enPassant.value = [row + 1, col]
    }

    // 프로모션
    if (piece === 1 && row === 7) {
      promotionColor.value = 'black'
      promotionPosition.value = [row, col]
      preventableModal.value = true
    } else if (piece === 8 && row === 0) {
      promotionColor.value = 'white'
      promotionPosition.value = [row, col]
      preventableModal.value = true
    }

    chessBoard.value[row][col] = piece // 기물 이동
    chessBoard.value[selectedPiece.value[0]][selectedPiece.value[1]] = 0 // 기존 칸 빈칸
    isWhiteTurn.value = !isWhiteTurn.value // 턴 넘김
    selectedPiece.value = []
    canMovePiece.value = []
    if (calculateCheck(chessBoard.value)) {
      const isWhiteCheckedTemp = isWhiteChecked.value
      const isBlackCheckedTemp = isBlackChecked.value
      if (calculateCheckmate(chessBoard.value)) {
        isWhiteChecked.value = isWhiteCheckedTemp
        isBlackChecked.value = isBlackCheckedTemp
        if (isWhiteChecked.value) {
          winner.value = 'white'
        } else {
          winner.value = 'black'
        }
        winnerModal.value = true
      }
      isWhiteChecked.value = isWhiteCheckedTemp
      isBlackChecked.value = isBlackCheckedTemp
    }
  }
}

const calculateCheck = (board) => {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c]
      if (piece === 0) {
        continue
      }
      // 흑색 폰인 경우
      if (piece === 1) {
        const distances = [
          [1, 1],
          [1, -1]
        ]
        for (let i = 0; i < distances.length; i++) {
          const nr = r + distances[i][0]
          const nc = c + distances[i][1]
          if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) {
            continue
          }
          if (board[nr][nc] === 13) {
            isBlackChecked.value = true
            return true
          }
        }
      }
      // 백색 폰인 경우
      else if (piece === 8) {
        const distances = [
          [-1, 1],
          [-1, -1]
        ]
        for (let i = 0; i < distances.length; i++) {
          const nr = r + distances[i][0]
          const nc = c + distances[i][1]
          if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) {
            continue
          }
          if (board[nr][nc] === 6) {
            isWhiteChecked.value = true
            return true
          }
        }
      }
      // 나이트인 경우
      else if (piece === 3 || piece === 10) {
        const distances = pieceDistances.Knight
        for (let i = 0; i < distances.length; i++) {
          const nr = r + distances[i][0]
          const nc = c + distances[i][1]
          if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) {
            continue
          }
          if (piece === 10 && board[nr][nc] === 6) {
            isWhiteChecked.value = true
            return true
          } else if (piece === 3 && board[nr][nc] === 13) {
            isBlackChecked.value = true
            return true
          }
        }
      }
      // 비숍인 경우
      else if (piece === 2 || piece === 9) {
        const distances = pieceDistances.Bishop
        for (let i = 0; i < distances.length; i++) {
          let nr = r + distances[i][0]
          let nc = c + distances[i][1]
          while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
            const npiece = board[nr][nc]
            if (npiece != 0) {
              if (piece === 9 && npiece === 6) {
                isWhiteChecked.value = true
                return true
              } else if (piece === 2 && npiece === 13) {
                isBlackChecked.value = true
                return true
              }
              break
            }
            nr += distances[i][0]
            nc += distances[i][1]
          }
        }
      }
      // 룩인 경우
      else if (piece === 4 || piece === 11) {
        const distances = pieceDistances.Rook
        for (let i = 0; i < distances.length; i++) {
          let nr = r + distances[i][0]
          let nc = c + distances[i][1]
          while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
            const npiece = board[nr][nc]
            if (npiece != 0) {
              if (piece === 11 && npiece === 6) {
                isWhiteChecked.value = true
                return true
              } else if (piece === 4 && npiece === 13) {
                isBlackChecked.value = true
                return true
              }
              break
            }
            nr += distances[i][0]
            nc += distances[i][1]
          }
        }
      }
      // 퀸인 경우
      else if (piece === 5 || piece === 12) {
        const distances = pieceDistances.Queen
        for (let i = 0; i < distances.length; i++) {
          let nr = r + distances[i][0]
          let nc = c + distances[i][1]
          while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
            const npiece = board[nr][nc]
            if (npiece != 0) {
              if (piece === 12 && npiece === 6) {
                isWhiteChecked.value = true
                return true
              } else if (piece === 5 && npiece === 13) {
                isBlackChecked.value = true
                return true
              }
              break
            }
            nr += distances[i][0]
            nc += distances[i][1]
          }
        }
      }
    }
  }
  return false
}

const calculateCheckmate = (board) => {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c]
      if (piece === 0) {
        continue
      }
      // 백이 체크 했을 때
      if (isWhiteChecked.value) {
        // 폰 경우의 수
        if (piece === 1) {
          // 움직일 수 있다면
          if (chessBoard.value[r + 1][c] == 0) {
            let arr = chessBoard.value.map((v) => [...v])
            arr[r + 1][c] = arr[r][c]
            arr[r][c] = 0
            if (!calculateCheck(arr)) {
              return false
            }
            // 2칸 전진 가능한 경우
            if (r == 1) {
              arr = chessBoard.value.map((v) => [...v])
              arr[r + 2][c] = arr[r][c]
              arr[r][c] = 0
              if (!calculateCheck(arr)) {
                return false
              }
            }
          }
          const distances = [
            [1, 1],
            [1, -1]
          ]
          // 잡을 말이 있는지 확인
          for (let i = 0; i < distances.length; i++) {
            const nr = r + distances[i][0]
            const nc = c + distances[i][1]
            if (nc >= 0 && nc < 8) {
              if (chessBoard.value[nr][nc] >= 8 && chessBoard.value[nr][nc] < 13) {
                let arr = chessBoard.value.map((v) => [...v])
                arr[nr][nc] = arr[r][c]
                arr[r][c] = 0
                if (!calculateCheck(arr)) {
                  return false
                }
              } else if (
                enPassant.value.length > 0 &&
                enPassant.value[0] == nr &&
                enPassant.value[1] == nc
              ) {
                // 앙파상
                let arr = chessBoard.value.map((v) => [...v])
                arr[nr][nc] = arr[r][c]
                arr[r][c] = 0
                if (!calculateCheck(arr)) {
                  return false
                }
              }
            }
          }
        }
        // 나이트 경우의 수
        if (piece === 3) {
          const distances = pieceDistances.Knight
          for (let i = 0; i < distances.length; i++) {
            const nr = r + distances[i][0]
            const nc = c + distances[i][1]
            if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
              const nPiece = chessBoard.value[nr][nc]
              if (nPiece === 0 || (nPiece >= 8 && nPiece <= 13)) {
                let arr = chessBoard.value.map((v) => [...v])
                arr[nr][nc] = arr[r][c]
                arr[r][c] = 0
                if (!calculateCheck(arr)) {
                  return false
                }
              }
            }
          }
        }
        // 비숍 경우의 수
        if (piece === 2) {
          const distances = pieceDistances.Bishop
          for (let i = 0; i < distances.length; i++) {
            let nr = r + distances[i][0]
            let nc = c + distances[i][1]
            while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
              const nPiece = chessBoard.value[nr][nc]
              if (nPiece != 0) {
                if (nPiece >= 8 && nPiece <= 13) {
                  let arr = chessBoard.value.map((v) => [...v])
                  arr[nr][nc] = arr[r][c]
                  arr[r][c] = 0
                  if (!calculateCheck(arr)) {
                    return false
                  }
                }
                break
              } else {
                let arr = chessBoard.value.map((v) => [...v])
                arr[nr][nc] = arr[r][c]
                arr[r][c] = 0
                if (!calculateCheck(arr)) {
                  return false
                }
              }

              nr += distances[i][0]
              nc += distances[i][1]
            }
          }
        }
        // 룩 경우의 수
        if (piece === 4) {
          const distances = pieceDistances.Rook
          for (let i = 0; i < distances.length; i++) {
            let nr = r + distances[i][0]
            let nc = c + distances[i][1]
            while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
              const nPiece = chessBoard.value[nr][nc]
              if (nPiece != 0) {
                if (nPiece >= 8 && nPiece <= 13) {
                  let arr = chessBoard.value.map((v) => [...v])
                  arr[nr][nc] = arr[r][c]
                  arr[r][c] = 0
                  if (!calculateCheck(arr)) {
                    return false
                  }
                }
                break
              } else {
                let arr = chessBoard.value.map((v) => [...v])
                arr[nr][nc] = arr[r][c]
                arr[r][c] = 0
                if (!calculateCheck(arr)) {
                  return false
                }
              }

              nr += distances[i][0]
              nc += distances[i][1]
            }
          }
        }
        // 퀸 경우의 수
        if (piece === 5) {
          const distances = pieceDistances.Queen
          for (let i = 0; i < distances.length; i++) {
            let nr = r + distances[i][0]
            let nc = c + distances[i][1]
            while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
              const nPiece = chessBoard.value[nr][nc]
              if (nPiece != 0) {
                if (nPiece >= 8 && nPiece <= 13) {
                  let arr = chessBoard.value.map((v) => [...v])
                  arr[nr][nc] = arr[r][c]
                  arr[r][c] = 0
                  if (!calculateCheck(arr)) {
                    return false
                  }
                }
                break
              } else {
                let arr = chessBoard.value.map((v) => [...v])
                arr[nr][nc] = arr[r][c]
                arr[r][c] = 0
                if (!calculateCheck(arr)) {
                  return false
                }
              }

              nr += distances[i][0]
              nc += distances[i][1]
            }
          }
        }
        // 킹 경우의 수
        if (piece === 6) {
          const distances = pieceDistances.King
          for (let i = 0; i < distances.length; i++) {
            let nr = r + distances[i][0]
            let nc = c + distances[i][1]
            if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) {
              continue
            }
            const nPiece = chessBoard.value[nr][nc]
            if (nPiece != 0) {
              if (nPiece >= 8 && nPiece <= 13) {
                let arr = chessBoard.value.map((v) => [...v])
                arr[nr][nc] = arr[r][c]
                arr[r][c] = 0
                if (!calculateCheck(arr)) {
                  return false
                }
              }
            } else {
              let arr = chessBoard.value.map((v) => [...v])
              arr[nr][nc] = arr[r][c]
              arr[r][c] = 0
              if (!calculateCheck(arr)) {
                return false
              }
            }
          }
        }
      }
      // 흑이 체크 했을 때
      else {
        // 폰 경우의 수
        if (piece === 8) {
          // 움직일 수 있다면
          if (chessBoard.value[r - 1][c] == 0) {
            let arr = chessBoard.value.map((v) => [...v])
            arr[r - 1][c] = arr[r][c]
            arr[r][c] = 0
            if (!calculateCheck(arr)) {
              return false
            }
            // 2칸 전진 가능한 경우
            if (r == 6) {
              arr = chessBoard.value.map((v) => [...v])
              arr[r - 2][c] = arr[r][c]
              arr[r][c] = 0
              if (!calculateCheck(arr)) {
                return false
              }
            }
          }
          const distances = [
            [-1, 1],
            [-1, -1]
          ]
          // 잡을 말이 있는지 확인
          for (let i = 0; i < distances.length; i++) {
            const nr = r + distances[i][0]
            const nc = c + distances[i][1]
            if (nc >= 0 && nc < 8) {
              if (chessBoard.value[nr][nc] >= 1 && chessBoard.value[nr][nc] < 6) {
                let arr = chessBoard.value.map((v) => [...v])
                arr[nr][nc] = arr[r][c]
                arr[r][c] = 0
                if (!calculateCheck(arr)) {
                  return false
                }
              } else if (
                enPassant.value.length > 0 &&
                enPassant.value[0] == nr &&
                enPassant.value[1] == nc
              ) {
                // 앙파상
                let arr = chessBoard.value.map((v) => [...v])
                arr[nr][nc] = arr[r][c]
                arr[r][c] = 0
                if (!calculateCheck(arr)) {
                  return false
                }
              }
            }
          }
        }
        // 나이트 경우의 수
        if (piece === 10) {
          const distances = pieceDistances.Knight
          for (let i = 0; i < distances.length; i++) {
            const nr = r + distances[i][0]
            const nc = c + distances[i][1]
            if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
              const nPiece = chessBoard.value[nr][nc]
              if (nPiece === 0 || (nPiece >= 1 && nPiece <= 6)) {
                let arr = chessBoard.value.map((v) => [...v])
                arr[nr][nc] = arr[r][c]
                arr[r][c] = 0
                if (!calculateCheck(arr)) {
                  return false
                }
              }
            }
          }
        }
        // 비숍 경우의 수
        if (piece === 9) {
          const distances = pieceDistances.Bishop
          for (let i = 0; i < distances.length; i++) {
            let nr = r + distances[i][0]
            let nc = c + distances[i][1]
            while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
              const nPiece = chessBoard.value[nr][nc]
              if (nPiece != 0) {
                if (nPiece >= 1 && nPiece <= 6) {
                  let arr = chessBoard.value.map((v) => [...v])
                  arr[nr][nc] = arr[r][c]
                  arr[r][c] = 0
                  if (!calculateCheck(arr)) {
                    return false
                  }
                }
                break
              } else {
                let arr = chessBoard.value.map((v) => [...v])
                arr[nr][nc] = arr[r][c]
                arr[r][c] = 0
                if (!calculateCheck(arr)) {
                  return false
                }
              }

              nr += distances[i][0]
              nc += distances[i][1]
            }
          }
        }
        // 룩 경우의 수
        if (piece === 11) {
          const distances = pieceDistances.Rook
          for (let i = 0; i < distances.length; i++) {
            let nr = r + distances[i][0]
            let nc = c + distances[i][1]
            while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
              const nPiece = chessBoard.value[nr][nc]
              if (nPiece != 0) {
                if (nPiece >= 1 && nPiece <= 6) {
                  let arr = chessBoard.value.map((v) => [...v])
                  arr[nr][nc] = arr[r][c]
                  arr[r][c] = 0
                  if (!calculateCheck(arr)) {
                    return false
                  }
                }
                break
              } else {
                let arr = chessBoard.value.map((v) => [...v])
                arr[nr][nc] = arr[r][c]
                arr[r][c] = 0
                if (!calculateCheck(arr)) {
                  return false
                }
              }

              nr += distances[i][0]
              nc += distances[i][1]
            }
          }
        }
        // 퀸 경우의 수
        if (piece === 12) {
          const distances = pieceDistances.Queen
          for (let i = 0; i < distances.length; i++) {
            let nr = r + distances[i][0]
            let nc = c + distances[i][1]
            while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
              const nPiece = chessBoard.value[nr][nc]
              if (nPiece != 0) {
                if (nPiece >= 1 && nPiece <= 6) {
                  let arr = chessBoard.value.map((v) => [...v])
                  arr[nr][nc] = arr[r][c]
                  arr[r][c] = 0
                  if (!calculateCheck(arr)) {
                    return false
                  }
                }
                break
              } else {
                let arr = chessBoard.value.map((v) => [...v])
                arr[nr][nc] = arr[r][c]
                arr[r][c] = 0
                if (!calculateCheck(arr)) {
                  return false
                }
              }

              nr += distances[i][0]
              nc += distances[i][1]
            }
          }
        }
        // 킹 경우의 수
        if (piece === 13) {
          const distances = pieceDistances.King
          for (let i = 0; i < distances.length; i++) {
            let nr = r + distances[i][0]
            let nc = c + distances[i][1]
            if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) {
              continue
            }
            const nPiece = chessBoard.value[nr][nc]
            if (nPiece != 0) {
              if (nPiece >= 1 && nPiece <= 6) {
                let arr = chessBoard.value.map((v) => [...v])
                arr[nr][nc] = arr[r][c]
                arr[r][c] = 0
                if (!calculateCheck(arr)) {
                  return false
                }
              }
            } else {
              let arr = chessBoard.value.map((v) => [...v])
              arr[nr][nc] = arr[r][c]
              arr[r][c] = 0
              if (!calculateCheck(arr)) {
                return false
              }
            }
          }
        }
      }
    }
  }
  return true
}
</script>

<template>
  <main>
    <BContainer fluid class="d-flex justify-content-center align-items-center flex-grow-1">
      <BRow class="w-100">
        <BCol class="col-7 left-side">
          <BRow>
            <BCol class="col-8 offset-2 square-container">
              <div v-for="(chessRow, row) in chessBoard" :key="row">
                <div v-for="(chess, col) in chessRow" :key="col" class="square" @click.stop="clickChessBoard(row, col)"
                  :style="`top: ${(row * 100) / 8}%; left: ${(col * 100) / 8}%;
                  background: ${selectedPiece[0] === row && selectedPiece[1] === col
                      ? 'green'
                      : (chessBoard[row][col] === 6 && isWhiteChecked) ||
                        (chessBoard[row][col] === 13 && isBlackChecked)
                        ? 'red'
                        : isCanMovePiece(row, col)
                          ? (row + col) % 2 == 0
                            ? 'yellow'
                            : 'yellowgreen'
                          : (row + col) % 2 == 0
                            ? 'lightgray'
                            : 'gray'
                    };`">
                  <div @mouseenter.stop="(e) => {
                    handleChessMouseOver(row, col, e)
                  }
                    " :style="` color: ${chess > 7 ? 'ivory' : chess != 0 ? 'black' : 'purple'}`">
                    <svg-icon class="svg-image" type="mdi" :path="`${chessIcons[chess % 7]}`"></svg-icon>
                  </div>
                </div>
              </div>
            </BCol>
            <BCol class="d-flex flex-column justify-content-between col-2"
              style="background-color: forestgreen; padding: 4px;">
              <BRow class="d-flex flex-row flex-wrap">
                <div v-for="n in 6" :key="n" class="d-flex">
                  <div v-for="count in capturedPiece.filter(p => p === n).length" :key="n + '-' + count"
                    style="width: 24px; color: black;">
                    <svg-icon class="svg-image" type="mdi" :path="`${chessIcons[n]}`"></svg-icon>
                  </div>
                </div>
              </BRow>
              <BRow>
                <div v-for="n in 6" :key="n + 7" class="d-flex">
                  <div v-for="count in capturedPiece.filter(p => p === n + 7).length" :key="(n + 7) + '-' + count"
                    style="width: 24px; color: ivory">
                    <svg-icon class="svg-image" type="mdi" :path="`${chessIcons[n]}`"></svg-icon>
                  </div>
                </div>
              </BRow>
            </BCol>
          </BRow>
          <BRow class="mt-4">
            <BButton class="offset-1 col-3" variant="outline-success" @click="resetChessBoard">초기화</BButton>
          </BRow>
        </BCol>
        <BCol class="col-5 right-side">
          <p>{{ capturedPiece }}</p>
        </BCol>
      </BRow>
    </BContainer>
    <BModal v-model="preventableModal" title="Hello, World!" @hide.prevent :hideFooter="true" :hideHeader="true">
      <BContainer fluid class="d-flex justify-content-center flex-grow-1" style="height: 20vh; background-color: green">
        <div class="col-3 d-flex justify-content-center align-items-center" style="color: white">
          프로모션 :
        </div>
        <div class="col-1 d-flex justify-content-center align-items-center" :style="`color: ${promotionColor}`"
          @mouseenter.stop="(e) => {
            e.target.style.cursor = 'pointer'
          }
            " @click.stop="() => {
              handlePromotion(2)
            }
              ">
          <svg-icon class="svg-image" type="mdi" :path="mdiChessBishop"></svg-icon>
        </div>
        <div class="col-1 d-flex justify-content-center align-items-center" :style="`color: ${promotionColor}`"
          @mouseenter.stop="(e) => {
            e.target.style.cursor = 'pointer'
          }
            " @click.stop="() => {
              handlePromotion(3)
            }
              ">
          <svg-icon class="svg-image" type="mdi" :path="mdiChessKnight"></svg-icon>
        </div>
        <div class="col-1 d-flex justify-content-center align-items-center" :style="`color: ${promotionColor}`"
          @mouseenter.stop="(e) => {
            e.target.style.cursor = 'pointer'
          }
            " @click.stop="() => {
              handlePromotion(4)
            }
              ">
          <svg-icon class="svg-image" type="mdi" :path="mdiChessRook"></svg-icon>
        </div>
        <div class="col-1 d-flex justify-content-center align-items-center" :style="`color: ${promotionColor}`"
          @mouseenter.stop="(e) => {
            e.target.style.cursor = 'pointer'
          }
            " @click.stop="() => {
              handlePromotion(5)
            }
              ">
          <svg-icon class="svg-image" type="mdi" :path="mdiChessQueen"></svg-icon>
        </div>
      </BContainer>
    </BModal>
    <BModal v-model="winnerModal" title="Game End!"> {{ winner }} win ! </BModal>
  </main>
</template>

<style scoped>
.left-side {
  padding: 12px;
}

.right-side {
  padding: 12px;
}

.square-container {
  border: 2px solid black;
  box-shadow: 0px 0px 15px gray;
  padding-top: 67%;
  position: relative;
}

.square {
  position: absolute;
  width: 12.5%;
  height: 12.5%;
}

.square .svg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
