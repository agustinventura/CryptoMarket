var cryptoCurrencies = null;
var cryptoCurrencyData = [];
var cryptoCurrencyIndex = -1;

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
    	console.log(msg);
        cryptoCurrencies = msg;
        getCryptoCurrencyInfo();
    }).fail(function(jqXHR, textStatus, errorThrown){
    	console.log(jqXHR);
    	console.log(textStatus);
    	console.log(errorThrown);
    	//$("#cryptoScreen").hide();
        //$("#errorScreen").show();
    });
}

function getCryptoCurrencyInfo() {
    incrementIndex();
    loadCryptoCurrencyData();
    showCryptoCurrencyData();
}

function incrementIndex() {
	if (cryptoCurrencyIndex < 4) {
        cryptoCurrencyIndex++;
    } else {
        cryptoCurrencyIndex = 0;
    }
}

function loadCryptoCurrencyData() {
	console.log(cryptoCurrencies);
	var cryptoCurrency = cryptoCurrencies["data"][cryptoCurrencyIndex];
    if (cryptoCurrencyData.length - 1 < cryptoCurrencyIndex) {
        loadCryptoCurrencyDataFromAPI(cryptoCurrency);
    }
}

function loadCryptoCurrencyDataFromAPI(cryptoCurrency) {
    $.ajax({
        url: "https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/info?id=" + cryptoCurrency["id"],
        type: 'GET',
        dataType: 'json',
        beforeSend: setHeader
    }).done(function(msg) {
        cryptoCurrencyData.push(msg);
    }).fail(showErrorScreen);
}

function showCryptoCurrencyData() {
	$("#cryptoScreen").show();
    $("#errorScreen").hide();
}

function init() {
	getTopFiveCryptoCurrencies();
	$(document).on('rotarydetent', getTopFiveCryptoCurrencies);
	$(window).on('tizenhwkey', function(e) {
		tizen.application.getCurrentApplication().exit();
    });
}
$(document).ready(init);