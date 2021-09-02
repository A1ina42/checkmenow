let countWrongAnswer = function (questionUser, questionBase) {
    try {
        let countWrongAnswer = 0;
        let haveWrongAnswer = false;
        questionUser.forEach((el, index1) => {
            haveWrongAnswer = false;
            if (el.type != 'free') {
                el.answers.forEach((ans, index2) => {
                    if (questionBase[index1][index2].isCorrect != ans.isCorrect)
                        haveWrongAnswer = true;
                })
            }
            else {
                if (questionBase[index1][0].text.toLowerCase() != el.answers[0].userText.toLowerCase()) {
                    haveWrongAnswer = true;
                }
            }
            if (haveWrongAnswer) countWrongAnswer++;
        });
        return countWrongAnswer;
    } catch (err) {
        console.error(err);
    }
}

module.exports.countWrongAnswer = countWrongAnswer;