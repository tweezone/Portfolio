const fs = require('fs');
const moment = require('moment');

export const getMarketContent = game => {
	return `[${game.home.name} vs ${game.visitor.name}]`;
};
export const getStartMarketYear = game => {
	return moment(game.betStartTime).format('YYYY');
};
export const getStartMarketMonth = game => {
	return moment(game.betStartTime).format('M');
};
export const getStartMarketDay = game => {
	return moment(game.betStartTime).format('D');
};
export const getStartMarketHour = game => {
	return moment(game.betStartTime).format('HH');
};
export const getStartMarketMinute = game => {
	return moment(game.betStartTime).format('mm');
};
export const getEndMarketYear = game => {
	return moment(game.betEndTime).format('YYYY');
};
export const getEndMarketMonth = game => {
	return moment(game.betEndTime).format('M');
};
export const getEndMarketDay = game => {
	return moment(game.betEndTime).format('D');
};
export const getEndMarketHour = game => {
	return moment(game.betEndTime).format('HH');
};
export const getEndMarketMinute = game => {
	return moment(game.betEndTime).format('mm');
};
export const getMinPredictionAmount = game => {
	return 1;
};
export const getMaxPredictionAmount = game => {
	return 100000*1000000*1000000*1000000;
};
export const getMinMarketAmount = game => {
	return 1;
};
export const getMaxMarketAmount = game => {
	return 100000000*1000000*1000000*1000000;
};

export const getEventTime = game => {
	return moment(game.startDateTime).valueOf();
};
export const getMarketStartTime = game => {
	return moment(game.betStartTime).valueOf();
};
export const getMarketEndTime = game => {
	return moment(game.betEndTime).valueOf();
};
export const getOptions = game => {
	return ['HomeWin', 'Draw', 'VistorWin'];
};
