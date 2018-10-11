
//定数群
let statics = {};

//台本
let books = {};
//ロジック(ゲーム内部の動き。変数群を直接変更できる。)
class Poker {
    constructor() {
        this.states = {};   //ゲームの状態を表す変数群。原則外から参照できないようにする。ゲッターで触る。セッターは無し。
    }
}
let poker;
let presenter = {};

function initGame() {
    console.log("Game Start!!");
    poker = new Poker();
}
//ゲーム起動
$(document).ready(function() {
    initGame();
});