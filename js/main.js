/* require $ */

//定数群
let statics = {
	cards: [
		"s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11", "s12", "s13",
		"h1", "h2", "h3", "h4", "h5", "h6", "h7", "h8", "h9", "h10", "h11", "h12", "h13",
		"c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "c10", "c11", "c12", "c13",
		"d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "d12", "d13",
	],
	score: {
		"ロイヤルストレートフラッシュ": 250,
		"ファイブカード": 60,
		"ストレートフラッシュ": 25,
		"フォーカード": 20,
		"フルハウス": 10,
		"フラッシュ": 5,
		"ストレート": 4,
		"スリーカード": 2,
		"ツーペア": 2,
	}
};

//アクション
class GameScene {
	constructor() {
	    this.nowScene = new TitleScene();
	}

	changeScene(sceneName) {
		GameScene.resetContainer();
		this.nowScene = eval("new " + sceneName + "()");
	}

	static resetContainer() {
		$("#poker-container").empty();
	}

}

class TitleScene {
    constructor() {
        console.log("title");

        let $button = $("<button type='button'>Game Start</button>").on("click", function() {
            game.changeScene("PokerScene");
        });

        $("#poker-container").append($button);

        //イベントハンドラは特に無い。
    }
}

class PokerScene {
    constructor() {
        console.log("poker");
        let $button = $("<button type='button'>終了</button>").on("click", function() {
            game.changeScene("TitleScene");
        });

        $("#poker-container").append($button);
        //画面描画
        //initPokerScene

        //イベントハンドラ
    }
    initPokerScene() {

    }
}

let game = null;

function initGame() {
	console.log("Game Start!!");
	game = new GameScene();
}

//ゲーム起動
$(function () {
	initGame();
});