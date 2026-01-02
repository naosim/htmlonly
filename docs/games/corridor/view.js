import { Corridor, Point, Wall } from './domain.js';

class QuoridorView {
  constructor() {
    this.game = new Corridor();
    this.history = []; // ゲーム履歴を保持

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
    this.boardElement.innerHTML = '';
    const size = 17; // 9 cells + 8 gaps

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const element = document.createElement('div');
        element.dataset.r = r.toString();
        element.dataset.c = c.toString();

        if (r % 2 === 0 && c % 2 === 0) {
          // Cell
          const x = c / 2;
          const y = r / 2;
          element.classList.add('cell');

          const pos = new Point(x, y);
          this.game.players.forEach(p => {
            if (p.pos.equals(pos)) {
              const pawn = document.createElement('div');
              pawn.classList.add('pawn', `player${p.id + 1}`);
              element.appendChild(pawn);
            }
          });

          if (this.game.winner === null && this.game.getValidPawnMoves().some(p => p.equals(pos))) {
            element.classList.add('valid-move');
            element.addEventListener('click', () => this.handleMove(pos));
          }
        } else if (r % 2 !== 0 && c % 2 === 0) {
          // Horizontal wall gap
          element.classList.add('wall-slot', 'h-wall-slot-segment');
          const x = c / 2;
          const y = (r - 1) / 2;

          if (this.isWallPart(x, y, 'H', 'segment')) {
            element.classList.add('wall');
          } else if (this.game.winner === null && x < 8) {
            element.addEventListener('click', () => this.handlePlaceWall(x, y, 'H'));
          }
        } else if (r % 2 === 0 && c % 2 !== 0) {
          // Vertical wall gap
          element.classList.add('wall-slot', 'v-wall-slot-segment');
          const x = (c - 1) / 2;
          const y = r / 2;

          if (this.isWallPart(x, y, 'V', 'segment')) {
            element.classList.add('wall');
          } else if (this.game.winner === null && y < 8) {
            element.addEventListener('click', () => this.handlePlaceWall(x, y, 'V'));
          }
        } else {
          // Corner
          element.classList.add('corner-slot');
          const x = (c - 1) / 2;
          const y = (r - 1) / 2;
          if (this.isWallPart(x, y, 'H', 'corner') || this.isWallPart(x, y, 'V', 'corner')) {
            element.classList.add('wall');
          }
        }

        this.boardElement.appendChild(element);
      }
    }

    this.updateStatus();
  }

  isWallPart(x, y, orientation, type) {
    if (orientation === 'H') {
      if (type === 'segment') {
        // Horizontal segments at (x, y) and (x+1, y)
        return this.game.board.walls.some(w => w.orientation === 'H' && w.y === y && (w.x === x || w.x === x - 1));
      } else {
        // Corner at (x, y)
        return this.game.board.walls.some(w => w.orientation === 'H' && w.x === x && w.y === y);
      }
    } else {
      if (type === 'segment') {
        // Vertical segments at (x, y) and (x, y+1)
        return this.game.board.walls.some(w => w.orientation === 'V' && w.x === x && (w.y === y || w.y === y - 1));
      } else {
        // Corner at (x, y)
        return this.game.board.walls.some(w => w.orientation === 'V' && w.x === x && w.y === y);
      }
    }
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
    if (this.p1Walls) this.p1Walls.textContent = `Walls: ${this.game.players[0].wallsRemaining}`;
    if (this.p2Walls) this.p2Walls.textContent = `Walls: ${this.game.players[1].wallsRemaining}`;

    if (this.undoButton) {
      this.undoButton.disabled = this.history.length === 0 || this.game.winner !== null;
    }

    const turnText = document.getElementById('turn-indicator');
    if (turnText) turnText.textContent = `TURN ${this.game.turn + 1}`;

    if (this.game.winner !== null && this.winnerOverlay && this.winnerText) {
      this.winnerOverlay.style.display = 'flex';
      this.winnerText.innerHTML = `PLAYER ${this.game.winner + 1}<br>VICTORY!`;
      this.winnerText.style.color = this.game.winner === 0 ? 'var(--player1-color)' : 'var(--player2-color)';
    }
  }
}

new QuoridorView();
