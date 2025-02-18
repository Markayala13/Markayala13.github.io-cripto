// Mapeo de códigos de criptomonedas a nombres reales según la API de CoinGecko
const cryptoMapping = {
    "BTC": "bitcoin",
    "ETH": "ethereum",
    "USDT": "tether",
    "BNB": "binancecoin",
    "SOL": "solana",
    "XRP": "xrp",
    "ADA": "cardano",
    "DOGE": "dogecoin",
    "DOT": "polkadot",
    "LTC": "litecoin"
};

// Seleccionamos el botón de conversión
const convert = document.querySelector(".convert button");

// Evento que se ejecuta al hacer clic en el botón "Convert"

let cryptoChart;




convert.addEventListener("click", async function () {
    // Obtener la cantidad ingresada y convertirla en número
    const quantity = parseFloat(document.getElementById("quantity").value);

    // Validar que el usuario ingresó un número válido
    if (isNaN(quantity) || quantity <= 0) {
        alert("Ingresa un número mayor a 0");
        return;
    }

    // Obtener la criptomoneda seleccionada y la moneda local
    const selectCrypto = document.getElementById("cryptoCurrency").value;
    const localCurrency = document.getElementById("localCurrency").value;

    // Convertir la cripto seleccionada a su nombre real en la API
    const cryptoName = cryptoApiName(selectCrypto);

    // Mostrar en consola los valores seleccionados para verificar
    console.log("Cantidad ingresada:", quantity);
    console.log("Criptomoneda seleccionada (código):", selectCrypto);
    console.log("Criptomoneda seleccionada (nombre API):", cryptoName);
    console.log("Moneda local seleccionada:", localCurrency);

    // Llamar a la función que obtiene el precio, pasando la cantidad como parámetro
    await getCripto(quantity, cryptoName, localCurrency);
});

// Función para convertir el código de la cripto a su nombre real usado en la API
function cryptoApiName(name) {
    return cryptoMapping[name];
}

// Función para obtener el precio de la criptomoneda seleccionada en la moneda local
async function getCripto(quantity, cryptoName, elementCurrency) {

    elementCurrency = elementCurrency.toLowerCase(); 
    // Llamar a la API de CoinGecko para obtener los precios en distintas monedas
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,binancecoin,solana,xrp,cardano,dogecoin,polkadot,litecoin&vs_currencies=usd,eur,mxn,clp");

    // Convertir la respuesta en JSON
    const data = await res.json();
    console.log("Datos obtenidos de la API:", data);

    // Verificar que la API realmente tenga el precio de la cripto en la moneda seleccionada
    if (!data[cryptoName]) {
        console.log(`⚠️ No hay datos en la API para ${cryptoName}`);
        alert(`No se pudo obtener el precio de ${cryptoName} en ${elementCurrency}. Verifica los valores seleccionados.`);
        return;
    }

    console.log("Precios disponibles para", cryptoName, ":", data[cryptoName]);

    if (!data[cryptoName][elementCurrency]) {
        console.log(`⚠️ La API no tiene el precio de ${cryptoName} en ${elementCurrency}`);
        alert(`No se pudo obtener el precio de ${cryptoName} en ${elementCurrency}. Verifica los valores seleccionados.`);
        return;
    }

    // Obtener el precio unitario de la criptomoneda en la moneda local
    const selectedPrice = data[cryptoName][elementCurrency];
    console.log(`El precio unitario de ${cryptoName} en ${elementCurrency} es:`, selectedPrice);

    // Calcular el total multiplicando el precio unitario por la cantidad ingresada
    const totalPrice = selectedPrice * quantity;

    // Mostrar el resultado en la página dentro del <p id="resultado">
    document.getElementById("resultado").innerText = `Total: ${quantity} ${cryptoName} = ${totalPrice.toFixed(2)} ${elementCurrency}`;

    // También mostrar en la consola el resultado final
    console.log(`Total convertido: ${quantity} ${cryptoName} = ${totalPrice.toFixed(2)} ${elementCurrency}`);

//CriptoChart

// Obtener el contexto del canvas donde se dibujará el gráfico
const canvas = document.getElementById("cryptoChart");
const ctx = canvas.getContext("2d");

// Si ya hay un gráfico, destruirlo y limpiar el canvas
if (cryptoChart) {
    cryptoChart.destroy();
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia el canvas
}

// Crear el nuevo gráfico
cryptoChart = new Chart(ctx, {
    type: "bar",
    data: {
        labels: [cryptoName], 
        datasets: [{
            label: `Valor en ${elementCurrency}`,
            data: [totalPrice], 
            backgroundColor: "rgba(0, 255, 0, 0.6)", 
            borderColor: "#0f0", 
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});


}

