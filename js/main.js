var cryptoCurrencies = null;
var cryptoCurrencyData = [];
var cryptoCurrencyIndex = -1;

window.onload = function() {
    getTopFiveCryptoCurrencies();
    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if (e.keyName === "back") {
            try {
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {}
        }
    });

    // Sample code
    var textbox = document.querySelector('.contents');
    textbox.addEventListener("click", function() {
        getCryptoCurrencyInfo();
        var box = document.querySelector('#textbox');
        box.innerHTML = (box.innerHTML === "Basic") ? "Sample" : "Basic";
    });

    function getTopFiveCryptoCurrencies() {
        $.ajax({
            url: "https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
            type: 'GET',
            dataType: 'json',
            data: {
                start: 1,
                limit: 5,
                convert: "EUR",
                sort: "price"
            },
            beforeSend: setHeader
        }).done(function(msg) {
            cryptoCurrencies = msg;
        });
    }

    function getCryptoCurrencyInfo() {
        if (cryptoCurrencyIndex < 4) {
            cryptoCurrencyIndex++;
        } else {
            cryptoCurrencyIndex = 0;
        }
        var cryptoCurrency = cryptoCurrencies["data"][cryptoCurrencyIndex];
        if (cryptoCurrencyData.length - 1 < cryptoCurrencyIndex) {
            loadCryptoCurrencyData(cryptoCurrency);
        }
    }

    function loadCryptoCurrencyData(cryptoCurrency) {
        $.ajax({
            url: "https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/info?id=" + cryptoCurrency["id"],
            type: 'GET',
            dataType: 'json',
            beforeSend: setHeader
        }).done(function(msg) {
            cryptoCurrencyData.push(msg);
        });
    }
};