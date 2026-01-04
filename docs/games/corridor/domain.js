/**
 * 2次元座標を表すクラス
 */
export class Point {
    /**
     * @param {number} x X座標
     * @param {number} y Y座標
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        Object.freeze(this);
    }

    /**
     * 他の座標と等しいか判定する
     * @param {Point} other 比較対象の座標
     * @returns {boolean} 等しい場合はtrue
     */
    equals(other) {
        return other && this.x === other.x && this.y === other.y;
    }
}

/**
 * 壁を表すクラス
 */
export class Wall {
    /**
     * @param {number} x 左または上のマスのインデックス (0-7)
     * @param {number} y 左または上のマスのインデックス (0-7)
     * @param {string} orientation 向き ('H': 水平, 'V': 垂直)
     */
    constructor(x, y, orientation) {
        this.x = x;
        this.y = y;
        this.orientation = orientation;
        Object.freeze(this);
    }

    /**
     * 他の壁と等しいか判定する
     * @param {Wall} other 比較対象の壁
     * @returns {boolean} 等しい場合はtrue
     */
    equals(other) {
        return other && this.x === other.x && this.y === other.y && this.orientation === other.orientation;
    }
}

/**
 * プレイヤーの状態を表すクラス
 */
export class Player {
    /**
     * @param {number} id プレイヤーID (0 または 1)
     * @param {Point} pos 現在の座標
     * @param {number} wallsRemaining 残りの壁の数
     * @param {number} targetRow 勝利条件となる端の行インデックス
     */
    constructor(id, pos, wallsRemaining, targetRow) {
        this.id = id;
        this.pos = pos;
        this.wallsRemaining = wallsRemaining;
        this.targetRow = targetRow;
        Object.freeze(this);
    }

    /**
     * 新しい座標を持つプレイヤーインスタンスを生成する
     * @param {Point} newPos 新しい座標
     * @returns {Player} 新しいプレイヤーインスタンス
     */
    withPos(newPos) {
        return new Player(this.id, newPos, this.wallsRemaining, this.targetRow);
    }

    /**
     * 新しい壁数を持つプレイヤーインスタンスを生成する
     * @param {number} newWallsRemaining 新しい壁の残り数
     * @returns {Player} 新しいプレイヤーインスタンス
     */
    withWalls(newWallsRemaining) {
        return new Player(this.id, this.pos, newWallsRemaining, this.targetRow);
    }
}

/**
 * ボードの幾何学的な状態（壁の配置や移動可能性）を管理するクラス
 */
export class Board {
    /**
     * @param {number} size ボードのサイズ（通常9）
     * @param {Wall[]} walls 設置されている壁のリスト
     */
    constructor(size = 9, walls = []) {
        this.size = size;
        this.walls = Object.freeze([...walls]);
        Object.freeze(this);
    }

    /**
     * 新しい壁を追加した新しいボードを返す
     * @param {Wall} wall 
     * @returns {Board}
     */
    withWall(wall) {
        return new Board(this.size, [...this.walls, wall]);
    }

    /**
     * 座標がボードの範囲外か判定する
     * @param {Point} p 座標
     * @returns {boolean}
     */
    isOutOfBounds(p) {
        return p.x < 0 || p.x >= this.size || p.y < 0 || p.y >= this.size;
    }

    /**
     * 2つのマスの間に壁があるか判定する
     * @param {Point} p1 マス1
     * @param {Point} p2 マス2
     * @returns {boolean}
     */
    isWallBetween(p1, p2) {
        if (p1.y === p2.y) { // 水平移動
            const x = Math.min(p1.x, p2.x);
            const y = p1.y;
            return this.walls.some(w => w.orientation === 'V' && w.x === x && (w.y === y || w.y === y - 1));
        } else { // 垂直移動
            const y = Math.min(p1.y, p2.y);
            const x = p1.x;
            return this.walls.some(w => w.orientation === 'H' && w.y === y && (w.x === x || w.x === x - 1));
        }
    }

    /**
     * 壁の設置位置が物理的に有効か判定する（重なりや交差）
     * @param {Wall} wall 
     * @returns {boolean}
     */
    isValidWallPlacement(wall) {
        if (wall.x < 0 || wall.x >= this.size - 1 || wall.y < 0 || wall.y >= this.size - 1) return false;

        for (const existing of this.walls) {
            if (existing.orientation === wall.orientation) {
                if (existing.x === wall.x && existing.y === wall.y) return false;
                if (wall.orientation === 'H' && Math.abs(existing.x - wall.x) < 2 && existing.y === wall.y) return false;
                if (wall.orientation === 'V' && existing.x === wall.x && Math.abs(existing.y - wall.y) < 2) return false;
            } else {
                if (existing.x === wall.x && existing.y === wall.y) return false;
            }
        }
        return true;
    }

    /**
     * 特定のプレイヤーがゴールに到達可能か判定する
     * @param {Player} player 
     * @returns {boolean}
     */
    canReachGoal(player) {
        const queue = [player.pos];
        const visited = new Set();
        visited.add(`${player.pos.x},${player.pos.y}`);

        while (queue.length > 0) {
            const p = queue.shift();
            if (!p) continue;
            if (p.y === player.targetRow) return true;

            const directions = [
                { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
                { dx: 1, dy: 0 }, { dx: -1, dy: 0 }
            ];

            for (const { dx, dy } of directions) {
                const next = new Point(p.x + dx, p.y + dy);
                if (this.isOutOfBounds(next)) continue;
                if (this.isWallBetween(p, next)) continue;

                const key = `${next.x},${next.y}`;
                if (!visited.has(key)) {
                    visited.add(key);
                    queue.push(next);
                }
            }
        }
        return false;
    }
}

/**
 * コリドールのゲーム全体の状態を管理するクラス（イミュータブル）
 */
export class Corridor {
    /**
     * @param {Object} state 初期状態
     */
    constructor(state = {}) {
        this.board = state.board || new Board();
        this.players = Object.freeze(state.players || [
            new Player(0, new Point(4, 0), 10, 8),
            new Player(1, new Point(4, 8), 10, 0)
        ]);
        this.turn = state.turn || 0;
        this.winner = state.winner !== undefined ? state.winner : null;
        Object.freeze(this);
    }

    /**
     * ゲームが終了したか判定する
     */
    get isGameOver() {
        return this.winner !== null;
    }

    /**
     * ゲームが進行中か判定する
     */
    get isGameActive() {
        return this.winner === null;
    }

    /**
     * 現在のターンのプレイヤーを取得する
     */
    get currentPlayer() {
        return this.players[this.turn % 2];
    }

    /**
     * 相手プレイヤーを取得する
     */
    get opponent() {
        return this.players[(this.turn + 1) % 2];
    }

    /**
     * 駒を移動させ、新しい状態を返す
     * @param {Point} newPos 
     * @returns {Corridor}
     */
    movePawn(newPos) {
        if (this.isGameOver) return this;
        if (!this.getValidPawnMoves().some(p => p.equals(newPos))) return this;

        const newPlayers = [...this.players];
        newPlayers[this.turn % 2] = this.currentPlayer.withPos(newPos);

        let newWinner = this.winner;
        if (newPos.y === this.currentPlayer.targetRow) {
            newWinner = this.currentPlayer.id;
        }

        return new Corridor({
            ...this,
            players: newPlayers,
            turn: this.turn + 1,
            winner: newWinner
        });
    }

    /**
     * 壁を設置し、新しい状態を返す
     * @param {Wall} wall 
     * @returns {Corridor}
     */
    placeWall(wall) {
        if (this.isGameOver) return this;
        if (this.currentPlayer.wallsRemaining <= 0) return this;
        if (!this.board.isValidWallPlacement(wall)) return this;

        const nextBoard = this.board.withWall(wall);

        // 全プレイヤーのゴールへの道が確保されているかチェック
        if (!this.players.every(p => nextBoard.canReachGoal(p))) return this;

        const newPlayers = [...this.players];
        newPlayers[this.turn % 2] = this.currentPlayer.withWalls(this.currentPlayer.wallsRemaining - 1);

        return new Corridor({
            ...this,
            board: nextBoard,
            players: newPlayers,
            turn: this.turn + 1
        });
    }

    /**
     * 現在のプレイヤーが移動可能なマスのリストを取得する
     * @returns {Point[]}
     */
    getValidPawnMoves() {
        const moves = [];
        const current = this.currentPlayer;
        const opponent = this.opponent;
        if (!current || !opponent) return [];

        const p = current.pos;
        const o = opponent.pos;

        const directions = [
            { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
            { dx: 1, dy: 0 }, { dx: -1, dy: 0 }
        ];

        for (const { dx, dy } of directions) {
            const next = new Point(p.x + dx, p.y + dy);
            if (this.board.isOutOfBounds(next)) continue;
            if (this.board.isWallBetween(p, next)) continue;

            if (next.equals(o)) {
                // 向こう側のマスへジャンプを試みる
                const jump = new Point(o.x + dx, o.y + dy);
                if (!this.board.isOutOfBounds(jump) && !this.board.isWallBetween(o, jump)) {
                    moves.push(jump);
                } else {
                    // ジャンプ不可なら斜め
                    const diagonals = (dx === 0)
                        ? [{ dx: 1, dy: 0 }, { dx: -1, dy: 0 }]
                        : [{ dx: 0, dy: 1 }, { dx: 0, dy: -1 }];

                    for (const d of diagonals) {
                        const diag = new Point(o.x + d.dx, o.y + d.dy);
                        if (!this.board.isOutOfBounds(diag) && !this.board.isWallBetween(o, diag)) {
                            moves.push(diag);
                        }
                    }
                }
            } else {
                moves.push(next);
            }
        }
        return moves;
    }
}
