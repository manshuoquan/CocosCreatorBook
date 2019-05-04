function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function randomArr(arr) {
	if (!arr.length) 
	{ 
		return null; 
	}
	return arr[Math.floor(Math.random() * arr.length)];
};

function randomize(arr) {
	var result = [];
	var clone = arr.slice();
	while (clone.length) {
        var index = clone.indexOf(randomArr(clone));
        result.push(clone.splice(index, 1)[0]);
    }
    return result;
}

function octile(dx, dy) {
    var F = Math.SQRT2 - 1;
    return (dx < dy) ? F * dx + dy : F * dy + dx;
}

module.exports = {
    getRandomInt: getRandomInt,
    randomize:randomize,
    octile:octile,
    DIRS: {
		"4": [
			[ 0, -1],
			[ 1,  0],
			[ 0,  1],
			[-1,  0]
		],
		"8": [
			[ 0, -1],
			[ 1, -1],
			[ 1,  0],
			[ 1,  1],
			[ 0,  1],
			[-1,  1],
			[-1,  0],
			[-1, -1]
		],
		"6": [
			[-1, -1],
			[ 1, -1],
			[ 2,  0],
			[ 1,  1],
			[-1,  1],
			[-2,  0]
		]
	},
};