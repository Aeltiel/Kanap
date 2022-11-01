// Récupération du panier depuis le localStorage
let paniers = JSON.parse(localStorage.getItem('products'));
let totalPrix = 0;
let totalQuantity = 0;
let ProduitsID = []

if (paniers === null) {
    console.log("Il n'y a pas d'article")
}

// Tri du pannier avec la méthode sort
async function triPanier() { // le async me permet de définir cette fonction comme une promesse
    return paniers.sort(function id(a, b) {
        if (a.id > b.id)
            return 1;
        if (a.id < b.id)
            return -1;
        return 0
    })
}

/*appel de la fonction avec une promesse pour récupérer les donneées de l'Api de manière asynchrone, 
afin que le tri ce fasse d'abord pour ensuite récupérer les donner, une fois le tri fait, et une fois les données
obtenue, afficher le panier
*/
triPanier().then(async (paniers) => {
    for (const product of paniers) { //utilisation de la boucle for of pour accéder aux éléments du tableau en fonction de leur ordre
        const response = await fetch(`http://localhost:3000/api/products/${product.id}`)
        const canape = await response.json()
        panier(canape, product)
    }
})

// création des produits dans le panier en fonction des éléments qui sont dans le local storage et ce qu'on a récupéré juste avant
function panier(data, userData) {

    // création de la structure des articles via des constantes
    const article = document.createElement("article");
    const divImg = document.createElement("div");
    const imgProduct = document.createElement("img");
    const divItemContent = document.createElement("div");
    const divItemDescription = document.createElement("div");
    const nameProduct = document.createElement("h2");
    const color = document.createElement("p");
    const price = document.createElement("p");
    const divSettings = document.createElement("div");
    const divQuantity = document.createElement("div");
    const quantity = document.createElement("p");
    const input = document.createElement("input");
    const divDelete = document.createElement("div");
    const pDelete = document.createElement("p");

    //Complétion des classes pour les éléments à ajouter dans le DOM
    article.className = "cart__item"
    divImg.className = "cart__item__img"
    divItemContent.className = "cart__item__content"
    divItemDescription.className = "cart__item__content__description"
    divSettings.className = "cart__item__content__settings"
    divQuantity.className = "cart__item__content__settings__quantity"
    quantity.textContent = "Qté : "
    input.type = "number"
    input.className = "itemQuantity"
    input.name = "itemQuantity"
    input.min = "1"
    input.max = "100"
    divDelete.className = "cart__item__content__settings__delete"
    pDelete.className = "deleteItem"
    pDelete.textContent = "Supprimer"

    //Complétiton du contenu avec les éléments récupérés dans la boucle ci dessus
    imgProduct.src = data.imageUrl
    imgProduct.alt = data.altTxt
    nameProduct.textContent = data.name
    color.textContent = userData.color
    price.textContent = data.price
    input.value = userData.quantity

    //implémantation des articles dans le DOM
    const cartItems = document.getElementById('cart__items');
    cartItems.appendChild(article)
    article.insertAdjacentElement('beforeend', divImg);
    article.insertAdjacentElement('beforeend', divItemContent);
    article.insertAdjacentElement('beforeend', divSettings);
    divImg.insertAdjacentElement('beforeend', imgProduct);
    divItemContent.insertAdjacentElement('beforeend', divItemDescription);
    divItemDescription.insertAdjacentElement('beforeend', nameProduct);
    divItemDescription.insertAdjacentElement('beforeend', color);
    divItemDescription.insertAdjacentElement('beforeend', price);
    divSettings.insertAdjacentElement('beforeend', divQuantity);
    divSettings.insertAdjacentElement('beforeend', divDelete);
    divQuantity.insertAdjacentElement('beforeend', quantity),
        divQuantity.insertAdjacentElement('beforeend', input);
    divDelete.insertAdjacentElement('beforeend', pDelete);

    // Pour le calcul du prix de tous les articles dans le panier
    function calculPrice() {
        var prixProduit = parseInt(data.price) * parseInt(userData.quantity)
        totalPrix = totalPrix + prixProduit
    }
    calculPrice()

    //l'event pour ajouter des produits directement sur la page produit
    input.addEventListener('change', function (e) { addQuantity(e, userData) })

    //l'event pour supprimer un produit directement dans le panier
    pDelete.addEventListener('click', (e) => {
        deleteProduct(userData, article)
    })
}

//fonction qui permet de calculer la quantité d'objet dans le panier et de l'afficher dynamiquement sur la page 
function counterPanier() {
    let articleQuantity = paniers.reduce(function (total, { quantity }) {
        return total + quantity++
    }, 0);
    const barNav = document.querySelectorAll("nav li");
    barNav[1].innerHTML = `Panier (${articleQuantity})`
}
counterPanier()

//utilisation de la méthode reduce() sur mon tableau paniers pour calaculé, la totalité de la propriété quantity du tableau
let quantity = paniers.reduce(function (total, { quantity }) {
    return total + quantity++
}, 0)

let totalArticle = document.getElementById('totalQuantity');
let totalPrice = document.getElementById('totalPrice');

totalArticle.textContent = quantity

//Pour afficher le prix du panier de manière dynamique, il se met à jour toutes les secondes
setTimeout(() => {
    totalPrice.textContent = totalPrix
}, 1000)

//fonction pour ajouter un produit via l'input quantité du panier
function addQuantity(event, ancienProduit) {
    let monPanier = JSON.parse(localStorage.getItem('products')); // on récupère lelocal storage
    let newProduit = monPanier.find(function (produit) {// ça c'est le produit du panier sur lequel on interagit.
        if (ancienProduit.id == produit.id && ancienProduit.color == produit.color) {
            return produit
        }
    })
    let newCanape = {//copie du produit avec lequel on interagit, seule la quantité change
        ...newProduit,
        quantity: event.target.value //la valeur de l'input avec lequel on interagit.
    }
    monPanier[monPanier.indexOf(newProduit)] = newCanape; //on récupère l'index du produit qui est dans le panier (ce qu'il y a dans les crochet) et on le remplace par newCanape
    localStorage.setItem('products', JSON.stringify(monPanier)) //on ré enregistre le panier dnas le localStorage
    totalPrix = 0;
    totalQuantity = 0;
    monPanier.forEach(async element => {
        const response = await fetch(`http://localhost:3000/api/products/${element.id}`)
        const canape = await response.json()
        totalPrix = totalPrix + (parseInt(element.quantity) * canape.price)
        totalQuantity = totalQuantity + parseInt(element.quantity);
        totalArticle.textContent = totalQuantity
        totalPrice.textContent = totalPrix

    });
    counterPanier()
}

// fonction qui permet de supprimer un élément du panier, autant dans le local storage que dans l'affichage de ce dernier
function deleteProduct(product, article) {
    let monPanier = JSON.parse(localStorage.getItem('products'));
    let choiceProduct = monPanier.find(function (produit) {// ça c'est le produit du panier sur lequel on interagit.
        if (product.id == produit.id && product.color == produit.color) {
            return produit
        }
    })
    monPanier.splice([monPanier.indexOf(choiceProduct)], 1);
    localStorage.setItem('products', JSON.stringify(monPanier))

    article.remove()

    totalPrix = 0;
    totalQuantity = 0;
    monPanier.forEach(async element => {
        const response = await fetch(`http://localhost:3000/api/products/${element.id}`)
        const canape = await response.json()
        totalPrix = totalPrix + (parseInt(element.quantity) * canape.price)
        totalQuantity = totalQuantity + parseInt(element.quantity);
        totalArticle.textContent = totalQuantity
        totalPrice.textContent = totalPrix

    });
    counterPanier()
}

// variable permettant la validation des données du formulaire
var firstName = false;
var lastName = false;
var address = false;
var city = false;
var mail = false;

//regex qui permet de controler si le nom et prénom contiennent majuscule + minuscule + tiret et contient entre 2 et 40 caractères
var regFirstName = /[a-zA-Z\-']{2,20}/g
var regName = /[a-zA-Z\-']{2,20}/g
// regex qui permet de controler l'adresse avec les chiffres et le nom de la rue
var regAddress = new RegExp("[0-9]{0,3}[\sa-zA-Z\-']{2,}")
//regex pour controler la ville, ckeck les minuscules, majuscules, tiret et apostrophe
var regCity = new RegExp("[A-Za-z\-']{3,}[\sa-zA-Z\-']*")
//regex pour vérifier l'adresse mail en controlant les chiffres, lettres, tirer, underscore et point
var regMail = new RegExp("[a-z0-9\-_]+[a-z0-9\.\-_]*@[a-z0-9\-_]{2,}\.[a-z\.\-_]+[a-z\-_]+")

// ensemble de fonction permettant de vérifier les inputs avec les regex pour ensuite les stocker
var prenom = document.getElementById('firstName');
prenom.addEventListener('change', function (event) {
    if (regFirstName.test(event.target.value) == false) {
        var nameError = document.getElementById('firstNameErrorMsg');
        nameError.textContent = "Erreur : Veillez vérifier les données que vous avez entré"
        event.preventDefault();
    } else {
        firstName = true;
    }
})

var nom = document.getElementById('lastName');
nom.addEventListener('change', function (event) {
    if (regName.test(event.target.value) == false) {
        var lastError = document.getElementById('lastNameErrorMsg');
        lastError.textContent = "Erreur : Veillez vérifier les données que vous avez entré"
        event.preventDefault();
    } else {
        lastName = true;
    }
})

var adresse = document.getElementById('address');
adresse.addEventListener('change', function (event) {
    if (regAddress.test(event.target.value) == false) {
        var adresseError = document.getElementById('addressErrorMsg');
        adresseError.textContent = "Erreur : Veillez vérifier les données que vous avez entré"
        event.preventDefault();
    } else {
        address = true;
    }
})

var ville = document.getElementById('city');
ville.addEventListener('change', function (event) {
    if (regCity.test(event.target.value) == false) {
        var cityError = document.getElementById('cityErrorMsg');
        cityError.textContent = "Erreur : Veillez vérifier les données que vous avez entré"
        event.preventDefault();
    } else {
        city = true;
    }
})

var email = document.getElementById('email');
email.addEventListener('change', function (event) {
    if (regMail.test(event.target.value) == false) {
        var mailError = document.getElementById('emailErrorMsg');
        mailError.textContent = "Erreur : Votre adresse mail est invalide"
        event.preventDefault();
    } else {
        mail = true;
    }

})

//fonctions pour enregistré et envoyé les données au click lors de l'envoi du formulaire

//fonction pour récupéré les id des produits du paniers, pour les envoyé par la suite dans le tableau, lors de l'envoi post
function validPanier(e) {
    e.preventDefault()
    paniers.forEach(produit => {
        ProduitsID.push(produit.id)
    })
    //requete API pour envoyé les données afin d'avoir le bon de commande
    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                contact: {
                    firstName: prenom.value,
                    lastName: nom.value,
                    address: adresse.value,
                    city: ville.value,
                    email: email.value
                },
                products: ProduitsID
            }
        )
    })
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(json => {
            alert("Merci pour votre achat")
            localStorage.removeItem("products")
            window.location.href = `./confirmation.html?orderID=${json.orderId}`
        })
}

const order = document.getElementById("order");
order.addEventListener('click', validPanier)