/**
 * class Deck
 * ポーカーの山札を司る。
 * ディーラーが主に行う動きを実装する。
 */
class Deck {
	/**
	 * @param {Array} card
	 */
	constructor(card) {
		this.stack = [].concat(card);
		this.cardData = [].concat(card);

		this.new();
	}

	/**
	 * 山札を新規作成する。
	 * 新規作成時、山札のシャッフルを行う。
	 */
	new () {
		this.stack = this.cardData.clone();
		this.shuffle();
	}

	/**
	 * 山札をシャッフルする
	 */
	shuffle() {
		let stack = this.stack;

		let n = stack.length, t, i;

		while (n) {
			i = Math.floor(Math.random() * n--);
			t = stack[n];
			stack[n] = stack[i];
			stack[i] = t;
		}

		this.stack = stack;
	}

	/**
	 * カードを配布する。
	 * また、stackから配布数分数が減る。
	 * @param {int} num
	 * @returns {Array}
	 */
	deal(num) {
		let dealCard = [];
		
		for (let i = 0; i < num; i++) {
			dealCard.push(this.stack.shift());
		}

		return dealCard;
	}
}