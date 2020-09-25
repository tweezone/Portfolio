const fs = require('fs');
const Promise = require('promise');
const moment = require('moment');
const GameScheduleHelper = require('../helpers/gameScheduleHelper');

const StringsLib = artifacts.require('./StringsLib.sol');
var PredictionMarket = artifacts.require('./PredictionMarket.sol');
var AiWinCoin = artifacts.require('./AiWinCoin.sol');

let dataSource_nba_2018_2019 = fs.readFileSync(
	'../dataSource/NBA_2018_2019.json',
);
let gamesData = JSON.parse(dataSource_nba_2018_2019)[0].games;

let networkName = 'ganache_nba_2018_2019.json';

module.exports = deployer => {
	let deployLog;
	const delopyStringsLib = deployer.deploy(StringsLib);
	const deployLink = deployer.link(StringsLib, PredictionMarket).then(() => {
		// const deployAiWinCoin = deployer.deploy(AiWinCoin).then(() => {
		fs.writeFileSync(
			'./dataSource/deploy-log.json',
			`
[
	{
		"datetime":"${moment(Date.now())}",
		"details":{
			"contract":"AiWinCoin",
			"targetNetwork":"devnet",
			"address":"0xc5147222ac5913654a4bfb2ddd29b733784c06a0"
		}
	}
]
			`,
		);

		deployLog = JSON.parse(fs.readFileSync('./dataSource/deploy-log.json'));
	});

	const deployPredictionMarketContracts = gamesData.map(game => {
		deployer
			.deploy(
				PredictionMarket,
				GameScheduleHelper.getMarketContent(game),
				GameScheduleHelper.getEventTime(game),
				GameScheduleHelper.getOptions(game),
				GameScheduleHelper.getMarketStartTime(game),
				GameScheduleHelper.getMarketEndTime(game),
				GameScheduleHelper.getMinPredictionAmount(game),
				GameScheduleHelper.getMaxPredictionAmount(game),
				GameScheduleHelper.getMinMarketAmount(game),
				GameScheduleHelper.getMaxMarketAmount(game),
				0xc5147222ac5913654a4bfb2ddd29b733784c06a0,
			)
			.then(() => {
				gamesData.map(item => {
					if (item.id === game.id) {
						item.smartContractAddress = PredictionMarket.address;
					}
				});
				let log = `
{
	"datetime": "${moment(Date.now())}",
	"details": {
		"targetNetwork": "devnet",
		"contracts": "PredictionMarket",
		"address": "${PredictionMarket.address}",
		"game": "'${game.home.name}' vs '${game.visitor.name}'"
	}
}
					`;
				deployLog.push(JSON.parse(log));
			});
	});

	Promise.all([
		delopyStringsLib,
		deployLink,
		// deployAiWinCoin,
		deployPredictionMarketContracts,
	]).then(() => {
		let dataSourceJson = JSON.parse(dataSource_nba_2018_2019);
		dataSourceJson[0].games = gamesData;
		fs.writeFileSync(
			'./dataSource/devnet_nba_2018_2019.json',
			JSON.stringify(dataSourceJson),
		);

		fs.writeFileSync('./dataSource/deploy-log.json', JSON.stringify(deployLog));
	});
};
