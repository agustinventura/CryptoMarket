var cryptoCurrencies = null;
var cryptoCurrencyData = new Array(5);
var cryptoCurrencyIndex = 0;
var selectedCryptoCurrency = null;

function getTopFiveCryptoCurrencies() {
    $.ajax({
        url: "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
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
        $(document).on('rotarydetent', getCryptoCurrencyInfo);
        loadCryptoCurrencyData();
    }).fail(showErrorScreen);
}

function showErrorScreen() {
	$("#cryptoScreen").hide();
    $("#errorScreen").show();
}

function getCryptoCurrencyInfo(ev) {
	var direction = ev.detail.direction;
    if (direction === "CW") {
    	incrementIndex();
    } else {
        decreaseIndex();
    }
    loadCryptoCurrencyData();
}

function incrementIndex() {
	if (cryptoCurrencyIndex < 4) {
        cryptoCurrencyIndex++;
    } else {
        cryptoCurrencyIndex = 0;
    }
}

function decreaseIndex() {
	if (cryptoCurrencyIndex > 0) {
        cryptoCurrencyIndex--;
    } else {
        cryptoCurrencyIndex = 4;
    }
}

function loadCryptoCurrencyData() {
	selectedCryptoCurrency = cryptoCurrencies["data"][cryptoCurrencyIndex];
    if (cryptoCurrencyData[cryptoCurrencyIndex] == null) {
        loadCryptoCurrencyDataFromAPI();
    } else {
    	showCryptoCurrencyData();
    }
}

function loadCryptoCurrencyDataFromAPI() {
    $.ajax({
        url: "https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?id=" + selectedCryptoCurrency["id"],
        type: 'GET',
        dataType: 'json',
        beforeSend: setHeader
    }).done(function(msg) {
    	cryptoCurrencyData[cryptoCurrencyIndex] = msg["data"];
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
    var percentage1h = selectedCryptoCurrency.quote.EUR.percent_change_1h;
    $("#cryptoCurrencyPercentage1h").text(percentage1h);
    if (percentage1h < 0) {
    	$("#cryptoCurrencyPercentage1h").parent().addClass("red");
    } else {
    	$("#cryptoCurrencyPercentage1h").parent().addClass("green");
    }
    var percentage24h = selectedCryptoCurrency.quote.EUR.percent_change_24h;
    $("#cryptoCurrencyPercentage24h").text(percentage24h);
    if (percentage24h < 0) {
    	$("#cryptoCurrencyPercentage24h").parent().addClass("red");
    } else {
    	$("#cryptoCurrencyPercentage24h").parent().addClass("green");
    }
    var percentage7d = selectedCryptoCurrency.quote.EUR.percent_change_7d;
    $("#cryptoCurrencyPercentage7d").text(percentage7d);
    if (percentage7d < 0) {
    	$("#cryptoCurrencyPercentage7d").parent().addClass("red");
    } else {
    	$("#cryptoCurrencyPercentage7d").parent().addClass("green");
    }
    var eurVolume = selectedCryptoCurrency.quote.EUR.volume_24h;
    $("#cryptoCurrencyPoints").text(OSREC.CurrencyFormatter.format(eurVolume, { currency: 'EUR' }));
    var percentage1h = selectedCryptoCurrency.quote.EUR.percent_change_1h;
    var eurMarketCap = selectedCryptoCurrency.quote.EUR.market_cap;
    $("#totalMarketCap").text(OSREC.CurrencyFormatter.format(eurMarketCap, { currency: 'EUR' }));
}

function init() {
	getTopFiveCryptoCurrencies();
	$(window).on('tizenhwkey', function(e) {
		tizen.application.getCurrentApplication().exit();
    });
}
$(document).ready(init);