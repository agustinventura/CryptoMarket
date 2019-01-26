var cryptoCurrencies = null;
var cryptoCurrencyData = [];
var cryptoCurrencyIndex = -1;
var selectedCryptoCurrency = null;

function getTopFiveCryptoCurrencies() {
    $.ajax({
        url: "https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
        type: 'GET',
        dataType: 'json',
        data: {
            start: 1,
            limit: 5,
            convert: "EUR"
        },
        beforeSend: setHeader
    }).done(function(msg) {
        cryptoCurrencies = msg;
        getCryptoCurrencyInfo();
    }).fail(showErrorScreen);
}

function showErrorScreen() {
	$("#cryptoScreen").hide();
    $("#errorScreen").show();
}

function getCryptoCurrencyInfo() {
    incrementIndex();
    loadCryptoCurrencyData();
}

function incrementIndex() {
	if (cryptoCurrencyIndex < 4) {
        cryptoCurrencyIndex++;
    } else {
        cryptoCurrencyIndex = 0;
    }
}

function loadCryptoCurrencyData() {
	selectedCryptoCurrency = cryptoCurrencies["data"][cryptoCurrencyIndex];
    if (cryptoCurrencyData.length - 1 < cryptoCurrencyIndex) {
        loadCryptoCurrencyDataFromAPI();
    } else {
    	showCryptoCurrencyData();
    }
}

function loadCryptoCurrencyDataFromAPI() {
    $.ajax({
        url: "https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/info?id=" + selectedCryptoCurrency["id"],
        type: 'GET',
        dataType: 'json',
        beforeSend: setHeader
    }).done(function(msg) {
        cryptoCurrencyData.push(msg["data"]);
        showCryptoCurrencyData();
    }).fail(showErrorScreen);
}

function showCryptoCurrencyData() {
	$("#cryptoScreen").show();
    $("#errorScreen").hide();
    $("#cryptoCurrencyImage").attr("src", cryptoCurrencyData[cryptoCurrencyIndex][selectedCryptoCurrency.id].logo);
    $("#cryptoCurrencySymbol").text(cryptoCurrencyData[cryptoCurrencyIndex][selectedCryptoCurrency.id].symbol);
    var eurChange = selectedCryptoCurrency.quote.EUR.price;
    $("#cryptoCurrencyEur").text(OSREC.CurrencyFormatter.format(eurChange, { currency: 'EUR' }));
    var eurVolume = selectedCryptoCurrency.quote.EUR.volume_24h;
    $("#cryptoCurrencyPoints").text(OSREC.CurrencyFormatter.format(eurVolume, { currency: 'EUR' }));
    $("#cryptoCurrencyPercentage1h").text(selectedCryptoCurrency.quote.EUR.percent_change_1h);
    $("#cryptoCurrencyPercentage24h").text(selectedCryptoCurrency.quote.EUR.percent_change_24h);
    $("#cryptoCurrencyPercentage7d").text(selectedCryptoCurrency.quote.EUR.percent_change_7d);
    var eurMarketCap = selectedCryptoCurrency.quote.EUR.market_cap;
    $("#totalMarketCap").text(OSREC.CurrencyFormatter.format(eurMarketCap, { currency: 'EUR' }));
}

function init() {
	getTopFiveCryptoCurrencies();
	$(document).on('rotarydetent', getCryptoCurrencyInfo);
	$(window).on('tizenhwkey', function(e) {
		tizen.application.getCurrentApplication().exit();
    });
}
$(document).ready(init);