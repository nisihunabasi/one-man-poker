/**
 * class Wallet
 * プレイヤーの財布。
 * ベットするコインを入れるケースとして振る舞う。当然持ち金が0になったらゲームオーバー。
 */
class Wallet {
	constructor(initCoin) {
		this.coin = initCoin;
	}

	/**
	 * お金を支払う
	 * 0 以下にもなるので注意。
	 * @param {int} num
	 */
	spend(num) {
		this.coin = this.coin - num;

		if (this.coin <= 0) {
			console.log("コインが0よりも少なくなりました。 coin:", this.coin);
		}
	}

	/**
	 * お金を追加する。
	 * @param num
	 */
	add(num) {
		this.coin = this.coin + num;

		if (Number.MAX_SAFE_INTEGER <= this.coin) {
			console.warn("コインの数がjavascriptで扱うことのできる最大の数を超えたため、計算エラーが発生しているかもしれません。");
		}
	}

	/**
	 * お金が０以下になっていることを判別する。
	 * （実際には、「ゲーム続行できるだけのコインがあるかどうか」を判別するため、0でなくても良い）
	 * @returns {boolean}
	 */
	isBouzu() {
		return (this.coin <= 0);
	}

	get() {
		return this.coin;
	}
}