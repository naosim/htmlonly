import { Corridor, Point, Wall } from './domain.js';

/**
 * ビュー上のグリッド目（17x17など）の1マスを表現するヘルパークラス
 */
class GridSlot {
  /**
    * @param {number} r 行インデックス (0 to gridSize-1)
    * @param {number} c 列インデックス (0 to gridSize-1)
    */
  constructor(r, c) {
    this.r = r;
    this.c = c;
    // ドメイン層の座標 (x, y) に変換
    this.x = Math.floor(c / 2);
    this.y = Math.floor(r / 2);
  }

  /** マス目（駒が置ける場所）か判定 */
  get isCell() { return this.r % 2 === 0 && this.c % 2 === 0; }
  /** 水平方向の壁スロットか判定 */
  get isHWall() { return this.r % 2 !== 0 && this.c % 2 === 0; }
  /** 垂直方向の壁スロットか判定 */
  get isVWall() { return this.r % 2 === 0 && this.c % 2 !== 0; }
  /** 角（壁の交差点）か判定 */
  get isCorner() { return this.r % 2 !== 0 && this.c % 2 !== 0; }

  /**
   * 指定した壁リストの中に、このスロットを占有する壁があるか判定
   * @param {Wall[]} walls 
   */
  isOccupiedBy(walls) {
    if (this.isCell) return false;

    if (this.isHWall) {
      // 水平壁は (x, y) と (x+1, y) の2スロット分を占有する
      return walls.some(w => w.orientation === 'H' && w.y === this.y && (w.x === this.x || w.x === this.x - 1));
    }
    if (this.isVWall) {
      // 垂直壁は (x, y) と (x, y+1) の2スロット分を占有する
      return walls.some(w => w.orientation === 'V' && w.x === this.x && (w.y === this.y || w.y === this.y - 1));
    }
    if (this.isCorner) {
      // 角は、その座標を起点とする水平壁または垂直壁がある場合に占有される
      return walls.some(w => w.x === this.x && w.y === this.y);
    }
    return false;
  }
}

class QuoridorView {
  constructor() {
    this.game = new Corridor();
    this.history = [];

    this.boardElement = document.getElementById('board');
    this.p1Info = document.getElementById('player1-info');
    this.p2Info = document.getElementById('player2-info');
    this.p1Walls = document.getElementById('p1-walls');
    this.p2Walls = document.getElementById('p2-walls');
    this.winnerOverlay = document.getElementById('winner-overlay');
    this.winnerText = document.getElementById('winner-text');
    this.undoButton = document.getElementById('btn-undo');

    this.init();
  }

  init() {
    if (this.undoButton) {
      this.undoButton.addEventListener('click', () => this.handleUndo());
    }
    this.render();
  }

  render() {
    if (!this.boardElement) return;

    const boardSize = this.game.board.size;
    const gridSize = boardSize * 2 - 1;

    this.boardElement.style.setProperty('--board-size-minus-1', (boardSize - 1).toString());
    this.boardElement.innerHTML = '';

    const walls = this.game.board.walls;

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const slot = new GridSlot(r, c);
        const element = document.createElement('div');
        element.dataset.r = r.toString();
        element.dataset.c = c.toString();

        if (slot.isCell) {
          element.classList.add('cell');
          const pos = new Point(slot.x, slot.y);

          // 駒の描画
          this.game.players.forEach(p => {
            if (p.pos.equals(pos)) {
              const pawn = document.createElement('div');
              pawn.classList.add('pawn', `player${p.id + 1}`);
              element.appendChild(pawn);
            }
          });

          // 移動可能ハイライト
          if (this.game.isGameActive && this.game.getValidPawnMoves().some(p => p.equals(pos))) {
            element.classList.add('valid-move');
            element.addEventListener('click', () => this.handleMove(pos));
          }
        } else if (slot.isHWall) {
          element.classList.add('wall-slot', 'h-wall-slot-segment');
          if (slot.isOccupiedBy(walls)) {
            element.classList.add('wall');
          } else if (this.game.isGameActive && slot.x < boardSize - 1) {
            element.addEventListener('click', () => this.handlePlaceWall(slot.x, slot.y, 'H'));
          }
        } else if (slot.isVWall) {
          element.classList.add('wall-slot', 'v-wall-slot-segment');
          if (slot.isOccupiedBy(walls)) {
            element.classList.add('wall');
          } else if (this.game.isGameActive && slot.y < boardSize - 1) {
            element.addEventListener('click', () => this.handlePlaceWall(slot.x, slot.y, 'V'));
          }
        } else if (slot.isCorner) {
          element.classList.add('corner-slot');
          if (slot.isOccupiedBy(walls)) {
            element.classList.add('wall');
          }
        }

        this.boardElement.appendChild(element);
      }
    }

    this.updateStatus();
  }

  handleMove(pos) {
    this.history.push(this.game);
    this.game = this.game.movePawn(pos);
    this.render();
  }

  handlePlaceWall(x, y, orientation) {
    const wallsToTry = [];
    if (orientation === 'H') {
      wallsToTry.push(new Wall(x, y, orientation));
      wallsToTry.push(new Wall(x - 1, y, orientation));
    } else {
      wallsToTry.push(new Wall(x, y, orientation));
      wallsToTry.push(new Wall(x, y - 1, orientation));
    }

    for (const wall of wallsToTry) {
      if (wall.x < 0 || wall.y < 0) continue;
      const nextGame = this.game.placeWall(wall);
      if (nextGame !== this.game) {
        this.history.push(this.game);
        this.game = nextGame;
        this.render();
        return;
      }
    }
  }

  handleUndo() {
    if (this.history.length > 0) {
      this.game = this.history.pop();
      this.render();
    }
  }

  updateStatus() {
    if (this.p1Info) this.p1Info.classList.toggle('active', this.game.turn % 2 === 0);
    if (this.p2Info) this.p2Info.classList.toggle('active', this.game.turn % 2 === 1);
    const p1 = this.game.players[0];
    const p2 = this.game.players[1];
    if (this.p1Walls && p1) this.p1Walls.textContent = `Walls: ${p1.wallsRemaining}`;
    if (this.p2Walls && p2) this.p2Walls.textContent = `Walls: ${p2.wallsRemaining}`;

    if (this.undoButton instanceof HTMLButtonElement) {
      this.undoButton.disabled = this.history.length === 0 || this.game.isGameOver;
    }

    const turnText = document.getElementById('turn-indicator');
    if (turnText) turnText.textContent = `TURN ${this.game.turn + 1}`;

    if (this.game.isGameOver && this.winnerOverlay && this.winnerText) {
      this.winnerOverlay.style.display = 'flex';
      this.winnerText.innerHTML = `PLAYER ${this.game.winner + 1}<br>VICTORY!`;
      this.winnerText.style.color = this.game.winner === 0 ? 'var(--player1-color)' : 'var(--player2-color)';
    }
  }
}

new QuoridorView();
