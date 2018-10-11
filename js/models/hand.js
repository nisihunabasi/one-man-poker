/**
 * class Hand
 *
 * ポーカーの手札を司る。
 * プレイヤーが行う動きを実装する。
 */
class Hand {
	/**
	 * 各種処理の初期化。
	 */
	constructor() {
		this.card = [];

		//二重処理にはなってしまうが、なにかしら他の手札初期化処理があればここちらに追記する。
		this.new();
	}

	/**
	 * カードを受け取る。
	 * 受け取っただけ持つ。
	 * @param array
	 * @result array
	 */
	receive(array) {
		this.card.concat(array);

		return this.card;
	}

	/**
	 * 指定されたカードを削除する
	 * @param array
	 */
	discard(array) {
		const discardCount = array.length;

		//それぞれの捨てる対象のカードについて、そのカードのindexを参照し、それを排除する。
		for (let i = 0; i < discardCount; i++) {
			const index = this.card.indexOf(array[i]);

			if (index === -1) {
				console.error("Hand内に存在していないカードが選択されました。スキップします。", array[i]);
			} else {
				this.card.splice(index, 1);
			}
		}
	}

	get() {
		return this.card;
	}

	/**
	 * 初期化。今持っているカード情報をすべて捨てて手札を空っぽにする。
	 */
	new() {
		this.card = [];
	}
}