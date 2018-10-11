/**
 * class Judge
 * 手役の判別を担う。
 * 手札を見て、なんの役が成立しているか答える責務を持つ。
 */
class Judge {
	constructor() {

	}

	/**
	 * Handモデルに格納されているカードを基準に役を作成する。
	 * 役は高いものほど優先となる。
	 *
	 * また、カードの枚数は５枚であることが前提で作られている
	 * @param {Hand} hand
	 */
	toJudge(hand) {
		const soredHand = this.preparationJudge(hand);

		console.log(soredHand);

		const handData = this.checkPokerHand(soredHand);

		console.log(handData);

		/*
		 * 実際の役の判定。
		 * 文字列の形で役を返している。詳しくはstatics.scoreを参照。
		 * ワンペア必要ないのにかえしてるのは、せっかく調べてるしなあ、という小さい遊び心です。
		 */

		//ロイヤルストレートフラッシュの判定
		if (handData.isStraight && handData.isFlush && handData.ifFlushAllSuits === "s" && handData.isTopNumberStraight) {
			return "ロイヤルストレートフラッシュ";
		} else if (handData.isStraight && handData.isFlush) {
			return "ストレートフラッシュ";
		} else if (handData.isFourCard) {
			return "フォーカード";
		} else if (handData.isTripleCard && handData.isPairCard) {
			return "フルハウス";
		} else if (handData.isFlush) {
			return "フラッシュ";
		} else if (handData.isStraight) {
			return "ストレート";
		} else if (handData.isTripleCard) {
			return "スリーカード";
		} else if (handData.isDoubleCard) {
			return "ツーペア";
		} else if (handData.isPairCard) {
			return "ワンペア";
		} else {
			return "ブタ";
		}
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

		//カードの中身を要素ごとに分解してまとめなおす。
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

	/**
	 * 実際に役を確認する。
	 * この後、ここで判定された役から総合的に実際の役をあらためて調べるための種のようなもの。
	 * @param handCardStatus
	 * @returns {{isFlush: boolean, ifFlushAllSuits: null, isStraight: boolean, isPairCard: boolean, isDoubleCard: boolean, isTripleCard: boolean, isFourCard: boolean, isTopNumberStraight: boolean}}
	 */
	checkPokerHand(handCardStatus) {

		let handData = {
			isFlush: false, //フラッシュ
			ifFlushAllSuits: null, //もしもフラッシュだった時、その模様。
			isStraight: false, //ストレート
			isPairCard: false,
			isDoubleCard: false,
			isTripleCard: false,
			isFourCard: false,
			isTopNumberStraight: false
		};

		const suits = handCardStatus.suits;
		const numbers = handCardStatus.numbers;

		//フラッシュの判定
		const allColor = Object.keys(suits).filter((key) => {
			return suits[key] === 5;
		});

		if (allColor.length > 0) {
			handData.isFlush = true;
			handData.ifFlushAllSuits = allColor[0];
		}

		//フォーカードの判定
		const forNumbers = Object.keys(numbers).filter((key) => {
			if (key === "14") return false;

			return numbers[key] === 4;
		});

		if (forNumbers.length === 1) {
			handData.isFourCard = true;
		}

		//スリーカードの判定
		const tripleNumbers = Object.keys(numbers).filter((key) => {
			if (key === "14") return false;
			return numbers[key] === 3;
		});

		if (tripleNumbers.length === 1) {
			handData.isTripleCard = true;
		}

		//ダブルカードの判定
		const doubleNumbers = Object.keys(numbers).filter((key) => {
			if (key === "14") return false;
			return numbers[key] === 2;
		});

		if (doubleNumbers.length === 2) {
			handData.isDoubleCard = true;
		} else if (doubleNumbers.length === 1) {
			handData.isPairCard = true;
		}

		//ストレートの判定
		let count = 0;
		for(let i = 1; i <= 14; i++) {
			//連続した数字を数え、それが５になったらストレート。
			if (numbers[i] === 1) {
				count++;
			} else {
				count = 0;
			}

			if (count === 5) {
				handData.isStraight = true;
			}
		}

		//そのストレートが一番大きい役かどうか。
		//ストレートフラグが1の時、13と14が1ならば一番大きい。
		if (handData.isStraight && numbers[13] === 1 && numbers[14] === 1) {
			handData.isTopNumberStraight = true;
		}

		return handData;
	}
}