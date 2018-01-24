﻿const PRICE_PIZZA = 20;
const PRICE_HAMBURGER = 10;
const PRICE_SANDWICH = 5;

let tunningComponents = [];
let selectedCrimes = [];
let purchasedAmount = 1;
let selected = null;
let drawable = null;

function populateBusinessItems(businessItemsJson, businessName, multiplier) {
	// Inicializamos los valores
	purchasedAmount = 1;
	selected = null;

	// Obtenemos la lista de objetos a mostrar
	let businessItemsArray = JSON.parse(businessItemsJson);
	let header = document.getElementById('header');
	let content = document.getElementById('content');
	let options = document.getElementById('options');
	
	// Añadimos la cabecera del menú
	header.textContent = businessName;
	
	for(let i = 0; i < businessItemsArray.length; i++) {
		// Obtenemos el objeto en curso
		let item = businessItemsArray[i];
		
		// Creamos los elementos para mostrar cada objeto
		let itemContainer = document.createElement('div');
		let imageContainer = document.createElement('div');
		let infoContainer = document.createElement('div');
		let descContainer = document.createElement('div');
		let purchaseContainer = document.createElement('div');
		let priceContainer = document.createElement('div');
		let itemAmountContainer = document.createElement('div');
		let amountTextContainer = document.createElement('div');
		let addSubstractContainer = document.createElement('div');
		let itemImage = document.createElement('img');
		let itemDescription = document.createElement('span');
		let itemPrice = document.createElement('span');
		let itemAmount = document.createElement('span');
		let itemAdd = document.createElement('span');
		let itemSubstract = document.createElement('span');
		
		// Añadimos las clases a cada elemento
		itemContainer.classList.add('item-row');
		imageContainer.classList.add('item-image');
		infoContainer.classList.add('item-content');
		descContainer.classList.add('item-header');
		purchaseContainer.classList.add('item-purchase');
		priceContainer.classList.add('item-price-container');
		itemAmountContainer.classList.add('item-amount-container', 'hidden');
		amountTextContainer.classList.add('item-amount-desc-container');
		addSubstractContainer.classList.add('item-add-substract-container');
		itemDescription.classList.add('item-description');
		itemPrice.classList.add('item-price');
		itemAmount.classList.add('item-amount-description');
		itemAdd.classList.add('item-adder');
		itemSubstract.classList.add('item-substract', 'hidden');
		
		// Añadimos el contenido de cada elemento
		itemImage.src = '../img/inventory/' + item.hash + '.png';
		itemDescription.textContent = item.description;
		itemPrice.innerHTML = '<b>Precio unitario: </b>' + Math.round(item.products * parseFloat(multiplier)) + '$';
		itemAmount.innerHTML = '<b>Cantidad: </b>' + purchasedAmount;
		itemAdd.textContent = '+';
		itemSubstract.textContent = '-';
		
		// Ponemos la función para cada elemento
		itemContainer.onclick = (function() {
			// Comprobamos que se ha pulsado en un elemento no seleccionado
			if(selected !== i) {
				// Miramos si había algún elemento seleccionado
				if(selected != null) {
					let previousSelected = document.getElementsByClassName('item-row')[selected];
					let previousAmountNode = findFirstChildByClass(previousSelected, 'item-amount-container');
					previousSelected.classList.remove('active-item');
					previousAmountNode.classList.add('hidden');
				}
				
				// Seleccionamos el elemento pulsado
				let currentSelected = document.getElementsByClassName('item-row')[i];
				let currentAmountNode = findFirstChildByClass(currentSelected, 'item-amount-container');
				currentSelected.classList.add('active-item');
				currentAmountNode.classList.remove('hidden');
				
				// Guardamos el nuevo índice seleccionado
				purchasedAmount = 1;
				selected = i;
				
				// Actualizamos el texto del elemento
				itemAmount.innerHTML = '<b>Cantidad: </b>' + purchasedAmount;
				document.getElementsByClassName('item-adder')[selected].classList.remove('hidden');
				document.getElementsByClassName('item-substract')[selected].classList.add('hidden');
			}
		});
		
		itemAdd.onclick = (function() {
			// Sumamos una unidad
			purchasedAmount++;
			
			// Obtenemos ambos botones
			let adderButton = document.getElementsByClassName('item-adder')[selected];
			let substractButton = document.getElementsByClassName('item-substract')[selected];
			
			if(purchasedAmount == 10) {
				// Ha llegado al máximo
				adderButton.classList.add('hidden');
			} else if(substractButton.classList.contains('hidden') === true) {
				// Volvemos el elemento visible
				substractButton.classList.remove('hidden');
			}
			
			// Actualizamos la cantidad
			let amountSpan = document.getElementsByClassName('item-amount-description')[selected];
			amountSpan.innerHTML = '<b>Cantidad: </b>' + purchasedAmount;
		});
		
		itemSubstract.onclick = (function() {
			// Restamos una unidad
			purchasedAmount--;
			
			// Obtenemos ambos botones
			let adderButton = document.getElementsByClassName('item-adder')[selected];
			let substractButton = document.getElementsByClassName('item-substract')[selected];
			
			if(purchasedAmount == 1) {
				// Ha llegado al mínimo
				substractButton.classList.add('hidden');
			} else if(adderButton.classList.contains('hidden') === true) {
				// Volvemos el elemento visible
				adderButton.classList.remove('hidden');
			}
			
			// Actualizamos la cantidad
			let amountSpan = document.getElementsByClassName('item-amount-description')[selected];
			amountSpan.innerHTML = '<b>Cantidad: </b>' + purchasedAmount;
		});
		
		// Ordenamos la jerarquía de elementos
		content.appendChild(itemContainer);
		itemContainer.appendChild(imageContainer);
		itemContainer.appendChild(infoContainer);
		imageContainer.appendChild(itemImage);
		infoContainer.appendChild(descContainer);
		descContainer.appendChild(itemDescription);
		infoContainer.appendChild(purchaseContainer);
		purchaseContainer.appendChild(priceContainer);
		priceContainer.appendChild(itemPrice);
		purchaseContainer.appendChild(itemAmountContainer);
		itemAmountContainer.appendChild(amountTextContainer);
		amountTextContainer.appendChild(itemAmount);
		itemAmountContainer.appendChild(addSubstractContainer);
		addSubstractContainer.appendChild(itemAdd);
		addSubstractContainer.appendChild(itemSubstract);
	}
	
	// Añadimos los botones
	let purchaseButton = document.createElement('div');
	let cancelButton = document.createElement('div');
	
	// Añadimos las clases a cada botón
	purchaseButton.classList.add('double-button', 'accept-button');
	cancelButton.classList.add('double-button', 'cancel-button');
	
	// Añadimos el texto de los botones
	purchaseButton.textContent = 'Comprar';
	cancelButton.textContent = 'Salir';
	
	// Ponemos la función para cada elemento
	purchaseButton.onclick = (function() {
		// Mandamos la acción de compra si ha seleccionado algo
		if(selected != null) {
			mp.trigger('purchaseItem', selected, purchasedAmount);
		}
	});
	
	cancelButton.onclick = (function() {
		// Cerramos la ventana de compra
		mp.trigger('cancelBusinessPurchase');
	});
		
	// Ordenamos la jerarquía de elementos
	options.appendChild(purchaseButton);
	options.appendChild(cancelButton);
}

function populateTunningMenu(tunningComponentsJSON) {
	// Añadimos el título al menú
	let header = document.getElementById('header');
	header.textContent = 'Menú de modificaciones';
	
	// Obtenemos la lista de componentes
	tunningComponents = JSON.parse(tunningComponentsJSON);
	
	// Mostramos el menú principal
	populateTunningHome();
}

function populateTunningHome() {
	// Obtenemos el nodo contenedor
	let content = document.getElementById('content');
	let options = document.getElementById('options');
	
	// Inicializamos las opciones
	selected = null;
	drawable = null;
	
	// Limpiamos el contenido
	while(content.firstChild) {
		content.removeChild(content.firstChild);
	}
	
	// Limpiamos las opciones
	while(options.firstChild) {
		options.removeChild(options.firstChild);
	}
	
	for(let i = 0; i < tunningComponents.length; i++) {
		// Obtenemos el objeto en curso
		let group = tunningComponents[i];
		
		// Creamos los elementos para mostrar cada objeto
		let itemContainer = document.createElement('div');
		let infoContainer = document.createElement('div');
		let descContainer = document.createElement('div');
		let itemDescription = document.createElement('span');
		
		// Añadimos las clases a cada elemento
		itemContainer.classList.add('item-row');
		infoContainer.classList.add('item-content');
		descContainer.classList.add('item-header');
		itemDescription.classList.add('item-description');
		
		// Añadimos el contenido de cada elemento
		itemDescription.textContent = group.desc;
		
		// Ponemos la función para cada elemento
		itemContainer.onclick = (function() {
			// Seleccionamos el elemento pulsado
			selected = i;
			
			// Mostramos la página de componentes
			populateTunningComponents();
		});
		
		// Ordenamos la jerarquía de elementos
		content.appendChild(itemContainer);
		itemContainer.appendChild(infoContainer);
		infoContainer.appendChild(descContainer);
		descContainer.appendChild(itemDescription);
	}
	
	// Añadimos el botón
	let exitButton = document.createElement('div');
	
	// Añadimos las clases al botón
	exitButton.classList.add('single-button', 'cancel-button');
	
	// Añadimos el texto de los botones
	exitButton.textContent = 'Salir';
	
	exitButton.onclick = (function() {
		// Cerramos la ventana de compra
		mp.trigger('destroyBrowser');
	});
		
	// Ordenamos la jerarquía de elementos
	options.appendChild(exitButton);
}

function populateTunningComponents() {
	// Obtenemos el nodo contenedor
	let content = document.getElementById('content');
	let options = document.getElementById('options');
	
	// Limpiamos el contenido
	while(content.firstChild) {
		content.removeChild(content.firstChild);
	}
	
	// Limpiamos las opciones
	while(options.firstChild) {
		options.removeChild(options.firstChild);
	}
	
	for(let i = 0; i < tunningComponents[selected].components.length; i++) {
		// Obtenemos el componente
		let component = tunningComponents[selected].components[i];
		
		// Creamos los elementos para mostrar cada objeto
		let itemContainer = document.createElement('div');
		let infoContainer = document.createElement('div');
		let descContainer = document.createElement('div');
		let purchaseContainer = document.createElement('div');
		let priceContainer = document.createElement('div');
		let itemDescription = document.createElement('span');
		let itemPrice = document.createElement('span');
		
		// Añadimos las clases a cada elemento
		itemContainer.classList.add('item-row');
		infoContainer.classList.add('item-content');
		descContainer.classList.add('item-header');
		purchaseContainer.classList.add('item-purchase');
		priceContainer.classList.add('item-price-container');
		itemDescription.classList.add('item-description');
		itemPrice.classList.add('item-price');
		
		// Añadimos el contenido de cada elemento
		itemDescription.textContent = component.desc;
		itemPrice.innerHTML = '<b>Precio unitario: </b>' + tunningComponents[selected].products + '$';
		
		// Ponemos la función para cada elemento
		itemContainer.onclick = (function() {
			// Comprobamos que se ha pulsado en un elemento no seleccionado
			if(drawable !== i) {
				// Miramos si había algún elemento seleccionado
				if(drawable != null) {
					let previousSelected = document.getElementsByClassName('item-row')[drawable];
					previousSelected.classList.remove('active-item');
				}
				
				// Seleccionamos el elemento pulsado
				let currentSelected = document.getElementsByClassName('item-row')[i];
				currentSelected.classList.add('active-item');
				
				// Guardamos el nuevo índice seleccionado
				drawable = i;
				
				// Actualizamos el tunning del vehículo
				mp.trigger('addVehicleComponent', tunningComponents[selected].slot, drawable);
			}
		});
		
		// Ordenamos la jerarquía de elementos
		content.appendChild(itemContainer);
		itemContainer.appendChild(infoContainer);
		infoContainer.appendChild(descContainer);
		descContainer.appendChild(itemDescription);
		infoContainer.appendChild(purchaseContainer);
		purchaseContainer.appendChild(priceContainer);
		priceContainer.appendChild(itemPrice);
	}
	
	// Añadimos los botones
	let purchaseButton = document.createElement('div');
	let cancelButton = document.createElement('div');
	
	// Añadimos las clases a cada botón
	purchaseButton.classList.add('double-button', 'accept-button');
	cancelButton.classList.add('double-button', 'cancel-button');
	
	// Añadimos el texto de los botones
	purchaseButton.textContent = 'Comprar';
	cancelButton.textContent = 'Atrás';
	
	// Ponemos la función para cada elemento
	purchaseButton.onclick = (function() {
		// Mandamos la acción de compra si ha seleccionado algo
		if(selected != null) {
			//mp.trigger('purchaseItem', selected, purchasedAmount);
		}
	});
	
	cancelButton.onclick = (function() {
		// Volvemos al inicio
		populateTunningHome();
	});
		
	// Ordenamos la jerarquía de elementos
	options.appendChild(purchaseButton);
	options.appendChild(cancelButton);
}

function populateFastfoodOrders(ordersJson, distancesJson) {
	// Obtenemos la lista de pedidos
	let fastfoodOrders = JSON.parse(ordersJson);
	let distances = JSON.parse(distancesJson);
	let header = document.getElementById('header');
	let content = document.getElementById('content');
	let options = document.getElementById('options');
	
	// Añadimos la cabecera del menú
	header.textContent = 'Pedidos de comida rápida';
	
	for(let i = 0; i < fastfoodOrders.length; i++) {
		// Obtenemos el objeto en curso
		let order = fastfoodOrders[i];
		
		// Calculamos el precio del pedido
		let amount = order.pizzas * PRICE_PIZZA + order.hamburgers * PRICE_HAMBURGER + order.sandwitches * PRICE_SANDWICH;
		
		// Creamos los elementos para mostrar cada objeto
		let itemContainer = document.createElement('div');
		let infoContainer = document.createElement('div');
		let descContainer = document.createElement('div');
		let purchaseContainer = document.createElement('div');
		let priceContainer = document.createElement('div');
		let itemAmountContainer = document.createElement('div');
		let amountTextContainer = document.createElement('div');
		let itemDescription = document.createElement('span');
		let itemPrice = document.createElement('span');
		let itemAmount = document.createElement('span');
		
		// Añadimos las clases a cada elemento
		itemContainer.classList.add('item-row');
		infoContainer.classList.add('item-content');
		descContainer.classList.add('item-header');
		purchaseContainer.classList.add('item-purchase');
		priceContainer.classList.add('item-price-container');
		itemAmountContainer.classList.add('item-amount-container');
		amountTextContainer.classList.add('item-amount-desc-container');
		itemDescription.classList.add('item-description');
		itemPrice.classList.add('item-price');
		itemAmount.classList.add('item-amount-description');
		
		// Añadimos el contenido de cada elemento
		itemDescription.textContent = 'Pedido #' + order.id;
		itemPrice.innerHTML = '<b>Pedido: </b>' + amount + '$';
		itemAmount.innerHTML = '<b>Distancia: </b>' + parseFloat(distances[i] / 1000).toFixed(2) + 'km';
		
		// Ponemos la función para cada elemento
		itemContainer.onclick = (function() {
			// Comprobamos que se ha pulsado en un elemento no seleccionado
			if(selected !== i) {
				// Miramos si había algún elemento seleccionado
				if(selected != null) {
					let previousSelected = document.getElementsByClassName('item-row')[selected];
					previousSelected.classList.remove('active-item');
				}
				
				// Seleccionamos el elemento pulsado
				let currentSelected = document.getElementsByClassName('item-row')[i];
				currentSelected.classList.add('active-item');
				
				// Guardamos el nuevo índice seleccionado
				selected = i;
			}
		});
		
		// Ordenamos la jerarquía de elementos
		content.appendChild(itemContainer);
		itemContainer.appendChild(infoContainer);
		infoContainer.appendChild(descContainer);
		descContainer.appendChild(itemDescription);
		infoContainer.appendChild(purchaseContainer);
		purchaseContainer.appendChild(priceContainer);
		priceContainer.appendChild(itemPrice);
		purchaseContainer.appendChild(itemAmountContainer);
		itemAmountContainer.appendChild(amountTextContainer);
		amountTextContainer.appendChild(itemAmount);
	}
	
	// Añadimos los botones
	let deliverButton = document.createElement('div');
	let cancelButton = document.createElement('div');
	
	// Añadimos las clases a cada botón
	deliverButton.classList.add('double-button', 'accept-button');
	cancelButton.classList.add('double-button', 'cancel-button');
	
	// Añadimos el texto de los botones
	deliverButton.textContent = 'Entregar';
	cancelButton.textContent = 'Salir';
	
	// Ponemos la función para cada elemento
	deliverButton.onclick = (function() {
		// Entregamos el pedido seleccionado
		if(selected != null) {
			mp.trigger('deliverFastfoodOrder', fastfoodOrders[selected].id);
		}
	});
	
	cancelButton.onclick = (function() {
		// Cerramos la ventana de pedidos
		mp.trigger('destroyBrowser');
	});
		
	// Ordenamos la jerarquía de elementos
	options.appendChild(deliverButton);
	options.appendChild(cancelButton);
}

function populateCrimesMenu(crimesJson) {
	// Obtenemos el nodo contenedor
	let header = document.getElementById('header');
	let content = document.getElementById('content');
	let options = document.getElementById('options');
	
	// Añadimos el texto de cabecera y obtenemos la lista de delitos
	let crimesArray = JSON.parse(crimesJson);
	header.textContent = 'Lista de delitos';
	selectedCrimes = [];
	
	for(let i = 0; i < crimesArray.length; i++) {
		// Obtenemos el componente
		let crime = crimesArray[i];
		
		// Creamos los elementos para mostrar cada objeto
		let itemContainer = document.createElement('div');
		let infoContainer = document.createElement('div');
		let descContainer = document.createElement('div');
		let purchaseContainer = document.createElement('div');
		let priceContainer = document.createElement('div');
		let itemAmountContainer = document.createElement('div');
		let amountTextContainer = document.createElement('div');
		let itemDescription = document.createElement('span');
		let itemPrice = document.createElement('span');
		let itemAmount = document.createElement('span');
		
		// Añadimos las clases a cada elemento
		itemContainer.classList.add('item-row');
		infoContainer.classList.add('item-content');
		descContainer.classList.add('item-header');
		purchaseContainer.classList.add('item-purchase');
		priceContainer.classList.add('item-price-container');
		itemAmountContainer.classList.add('item-amount-container');
		amountTextContainer.classList.add('item-amount-desc-container');
		itemDescription.classList.add('item-description');
		itemPrice.classList.add('item-price');
		itemAmount.classList.add('item-amount-description');
		
		if(selectedCrimes.indexOf(crime) > -1) {
			// Marcamos el delito como aplicable
			itemContainer.classList.add('active-item');
		}
		
		// Añadimos el contenido de cada elemento
		itemDescription.textContent = crime.crime;
		itemPrice.innerHTML = '<b>Multa: </b>' + crime.fine + '$';
		itemAmount.innerHTML = '<b>Tiempo: </b>' + crime.jail + 'min.';
		
		// Ponemos la función para cada elemento
		itemContainer.onclick = (function() {
			// Comprobamos que se ha pulsado en un elemento no seleccionado
			if(selectedCrimes.indexOf(crime) === -1) {
				// Seleccionamos el elemento pulsado
				let currentSelected = document.getElementsByClassName('item-row')[i];
				currentSelected.classList.add('active-item');
				
				// Guardamos el índice seleccionado
				selectedCrimes.push(crime);
			} else {
				// Eliminamos la selección del elemento pulsado
				let currentSelected = document.getElementsByClassName('item-row')[i];
				currentSelected.classList.remove('active-item');
				
				// Eliminamos el índice seleccionado
				selectedCrimes.splice(selectedCrimes.indexOf(crime), 1);
			}
		});
		
		// Ordenamos la jerarquía de elementos
		content.appendChild(itemContainer);
		itemContainer.appendChild(infoContainer);
		infoContainer.appendChild(descContainer);
		descContainer.appendChild(itemDescription);
		infoContainer.appendChild(purchaseContainer);
		purchaseContainer.appendChild(priceContainer);
		priceContainer.appendChild(itemPrice);
		purchaseContainer.appendChild(itemAmountContainer);
		itemAmountContainer.appendChild(amountTextContainer);
		amountTextContainer.appendChild(itemAmount);
	}
	
	// Añadimos los botones
	let applyButton = document.createElement('div');
	let cancelButton = document.createElement('div');
	
	// Añadimos las clases a cada botón
	applyButton.classList.add('double-button', 'accept-button');
	cancelButton.classList.add('double-button', 'cancel-button');
	
	// Añadimos el texto de los botones
	applyButton.textContent = 'Inculpar';
	cancelButton.textContent = 'Salir';
	
	// Ponemos la función para cada elemento
	applyButton.onclick = (function() {
		// Entregamos el pedido seleccionado
		if(selectedCrimes.length > 0) {
			mp.trigger('applyCrimes', selectedCrimes);
		}
	});
	
	cancelButton.onclick = (function() {
		// Cerramos la ventana de pedidos
		mp.trigger('destroyBrowser');
	});
		
	// Ordenamos la jerarquía de elementos
	options.appendChild(applyButton);
	options.appendChild(cancelButton);
}

function findFirstChildByClass(element, className) {
	let foundElement = null, found;
	function recurse(element, className, found) {
		for (let i = 0; i < element.childNodes.length && !found; i++) {
			let el = element.childNodes[i];
			let classes = el.className != undefined? el.className.split(" ") : [];
			for (let j = 0, jl = classes.length; j < jl; j++) {
				if (classes[j] == className) {
					found = true;
					foundElement = element.childNodes[i];
					break;
				}
			}
			if(found)
				break;
			recurse(element.childNodes[i], className, found);
		}
	}
	recurse(element, className, false);
	return foundElement;
}		