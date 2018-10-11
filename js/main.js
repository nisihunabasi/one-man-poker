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
		"ストレートフラッシュ": 25,
		"フォーカード": 20,
		"フルハウス": 10,
		"フラッシュ": 5,
		"ストレート": 4,
		"スリーカード": 2,
		"ツーペア": 2,
	},
	initCoins: 1000 //コイン初期値。
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
        let $button = $("<button type='button'>Game Start</button>").on("click", function() {
            game.changeScene("PokerScene");
        });

        $("#poker-container").append("<h1>One-man Poker</h1>").append($button);

        //イベントハンドラは特に無い。
    }
}

class PokerScene {
    constructor() {
        this.deck = new Deck(statics.cards);
        this.hand = new Hand();
        this.wallet = new Wallet(statics.initCoins);
        this.judge = new Judge();
        this.states = new States();

        this.$pokerContainer = $("#poker-container");

        //ゲーム画面初期化
        this.initPokerScene();

        //ゲーム初期化
        this.initPokerGame();

        //ニューゲーム描画
        this.drawNewGame();

        //イベントハンドラ
        $("#hand-container").on("click", "span.card-container", (e) => {
            console.log("fired!");
            let $target = $(e.target);
            if ($target.hasClass("selected")) {
                $target.removeClass("selected");
            } else {
                $target.addClass("selected");
            }

        });
    }
    initPokerScene() {

        //ステージ雛形をクローンして持ってくる
        let $pokerStage = $("#poker-stage-prototype").clone();
        $pokerStage.attr("id", "poker-stage").show();
        $pokerStage.appendTo(this.$pokerContainer);

        //山札の描画。多分裏カード1枚ぐらい書いておけばOK
        let $deckContainer = $("#deck-container");
        $("<span>" + this.drawCard("") + "</span>").appendTo($deckContainer);

        //ボタンの描画。イベントハンドラも追加。
        let $buttonContainer = $("#button-container");
        $("<button type='button' class='change-button'>カードチェンジ</button>").appendTo($buttonContainer).on("click", (e) => {
            this.onClickCardChange();
        });
        $("<button type='button' class='retry-button'>もう1回</button>").prop("disabled", true).appendTo($buttonContainer).on("click", (e) => {
            this.onClickNewGame();
        });
        $("<button type='button' class='end-button'>終了</button>").appendTo($buttonContainer).on("click", function() {
            if (confirm("終了しますか？")) {
                game.changeScene("TitleScene");
            }

        });

    }

    drawNewGame() {
        //手札の描画。別メソッドに分ける。
        this.eraseHand();
        this.drawHand();

        //カードチェンジ出来るようにする。
        $(".change-button").prop("disabled", false);
        //ニューゲームは押せないように。
        $(".retry-button").prop("disabled", true);
    }

    drawHand() {
        let handContainer = $("#hand-container");
        this.hand.get().forEach(element => {
            $("<span class='card-container' data-num='" + element + "'>" + this.drawCard(element) + "</span>").appendTo(handContainer);
        });

    }
    eraseHand() {
        $("#hand-container").empty();
    }

    /**
     *
     * @param {String} code
     */
    drawCard(code) {
        let suit, num, numForView, suitMark = "　";
        if (code === "") {
            suit = num = "　";
        } else {
            suit = code.slice(0, 1);
            num  = code.slice(1);
        }

        if (suit === "h") {
            suitMark = "♥";
        } else if (suit === "d") {
            suitMark = "◆";
        } else if (suit === "c") {
            suitMark = "♣";
        } else if (suit === "s") {
            suitMark = "♠";
        }

        if (num === "1") {
            numForView = "Ａ";
        } else if (num === "10") {
            numForView = "⑩";
        } else if (num === "11") {
            numForView = "Ｊ";
        } else if (num === "12") {
            numForView = "Ｑ"
        } else if (num === "13") {
            numForView = "Ｋ";
        } else if (num === "　") {
            numForView = "　";
        } else {
            numForView = String.fromCharCode(num.charCodeAt(0) + 0xFEE0);
        }

        let cardPic =
            "┌───┐" +
            "│　　　│" +
            "│　　　│" +
            "│　　　│" +
            "└───┘";
        let cardPicAry = cardPic.split("");
        cardPicAry[6] = cardPicAry[18] = suitMark;
        cardPicAry[12] = numForView;
        //HTML用文字列にする。
        cardPicAry[4] = "┐<br>";
        cardPicAry[9] = cardPicAry[14] = cardPicAry[19] = "│<br>";
        cardPic = cardPicAry.join("");
        console.log(cardPic);

        return cardPic;

    }
    /**
     * ポーカーゲーム1セットの初期化。
     * カードを最初に配る際に動かす。
     * 山札初期化→シャッフル→プレイヤーに5枚配る。までを行う。
     */
    initPokerGame() {
        //ゲームカウント加算
        this.states.gameCount++;
        //山札初期化＋シャッフル
        this.deck.new();
        //手札初期化
        this.hand.new();
        //プレイヤーに配る。
        this.hand.receive(this.deck.deal(5));

        //おわり
    }

    onClickCardChange(e) {
        console.log(("card Change!!"));

        //.selectedがついているカードを拾ってチェンジする。
        let targetNums = [];
        $("#hand-container span.selected").each((i, elm) => {
            targetNums.push($(elm).data("num"));
        });
        //手札を捨てて変わりのカードを貰う。
        this.hand.discard(targetNums);
        this.hand.receive(this.deck.deal(targetNums.length));

        //カード再描画
        this.eraseHand();
        this.drawHand();

        //直ちに手役の判定
        let yaku = this.judge.toJudge(this.hand);

        if(yaku === "ブタ" || yaku === "ワンペア") {
            alert("はずれ");
        } else {
            alert(yaku);
        }
        //カードチェンジできないようにする。
        $(".change-button").prop("disabled", true);
        //newGameを有効にする。
        $(".retry-button").prop("disabled", false);
    }

    onClickNewGame() {
        //ゲーム初期化
        this.initPokerGame();

        //ニューゲーム描画
        this.drawNewGame();
    }
}

let game = null;

function initGame() {
	game = new GameScene();
}

//ゲーム起動
$(function () {
	initGame();
});