import {
  MagicalDropGame,
  PullStones,
  Grid,
  StoneOrEmpty,
  BasicModeController,
  InicialGrid
} from "./magical-drop.mjs";

function sum(a, b) {
  return a + b;
}


test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

test('2adds 1 + 2 to equal 3', () => {
  const 列数 = 12;
  const 行数 = 12;
  const magicalDropGame = new MagicalDropGame({
    初期格子: InicialGrid.ランダム({行数, 列数}),
    モード: new BasicModeController(),
    行数, 列数
  });
  expect(magicalDropGame.格子.values[0]).toStrictEqual([]);
});

