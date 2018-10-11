/**
 * class Judge
 * 手役の判別を担う。
 * 手札を見て、なんの役が成立しているか答える責務を持つ。
 */
class Judge {
	constructor() {

	}

	/**
	 *
	 * @param {Hand} hand
	 */
	toJudge(hand) {
		const soredHand = this.preparationJudge(hand);

		console.log(soredHand);
	}


	/**
	 * ポーカーのルールにおいて、役を判別するための準備の作成
	 * @param {Hand} hand
	 * @retun [{mark:string, number:int}, ....]
	 */
	preparationJudge(hand) {
		const handCard = hand.get();

		const objHandCard = handCard.map(value => {
			const suit = value.slice(0, 1);
			let number = value.slice(1);

			return {suit: suit, number: Number(number)}
		});

		let handCardStatus = {
			suits: {s:0, h:0, c:0, d:0},
			numbers: {1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0, 11:0, 12:0, 13:0, 14:0} //エースは1かつ14と扱う
		};
		objHandCard.forEach(value => {
			handCardStatus["suits"][value["suit"]]++;
			handCardStatus["numbers"][value["number"]]++;

			if (value["number"] === 1) {
				handCardStatus["numbers"][14]++;
			}

		});

		return handCardStatus;
	}
}