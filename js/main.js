/* require $ */

//定数群
let statics = {};

//アクション
class GameScene {
	constructor() {
		this.titleScene();
	}

	/**
	 * タイトルシーン
	 * ゲームのタイトル、「ゲームスタート」ボタンを押すとpokerSceneに移る。
	 */
	titleScene() {
		let self = this;
		console.log("title");

		let $button = $("<button type='button'>Game Start</button>").on("click", function() {
			self.sceneChange("pokerScene");
		});

		$("#poker-container").append($button);
	}

	/**
	 * 実際のポーカーシーン。
	 * ゲーム内で「終了」を押すとタイトルに戻る
	 */
	pokerScene() {
		let self = this;
		console.log("poker");
		let $button = $("<button type='button'>終了</button>").on("click", function() {
			self.sceneChange("titleScene");
		});

		$("#poker-container").append($button);
	}

	sceneChange(sceneName) {
		GameScene.resetContainer();

		return this[sceneName]();
	}

	static resetContainer() {
		$("#poker-container").empty();
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