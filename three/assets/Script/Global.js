var BOARD_ROW = 9
var BOARD_COL = 10

function get_board_row()
{
    return BOARD_ROW
}

function get_board_col()
{
    return BOARD_COL
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = {
    getRandomInt: getRandomInt,
    get_board_row: get_board_row,
    get_board_col: get_board_col
};