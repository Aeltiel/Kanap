//ici, nous allons récupérer les id des canapés pour afficher sur chaque page le détail du produit correspond
// Récupération de l'url
let canapeUrl = window.location.href;
let url = new URL(canapeUrl);
let canapeId = url.searchParams.get("id");

recupereProduit(canapeId)

//appel à l'api pour récupérer les données nécessaires pour afficher les produits
async function recupereProduit(idProduit) {
  const response = await fetch(`http://localhost:3000/api/products/${idProduit}`)
  const canape = await response.json()
  afficherProduit(canape)
}

//affichage des détails lié au produit dans la page
function afficherProduit(detailProduct) {
  const titrePage = document.querySelector("title");
  titrePage.textContent = `${detailProduct.name}`

  const image = document.createElement("img");
  image.src = detailProduct.imageUrl;
  image.alt = detailProduct.altTxt;

  const img = document.querySelector(".item__img");
  img.appendChild(image)

  const title = document.getElementById("title");
  title.textContent = detailProduct.name;

  const price = document.getElementById("price");
  price.textContent = detailProduct.price;

  const descritpion = document.getElementById("description");
  descritpion.textContent = detailProduct.description;

  //Récupération du tableau lié aux couleurs, puis création d'une boucle pour créer les options de couleur dans la page
  const optionColor = document.getElementById("colors");
  let colors = detailProduct.colors;
  colors.forEach(option => {
    const color = document.createElement("option");
    color.value = option
    color.textContent = option
    optionColor.appendChild(color)
  });
}

//Récupération des données du produit choisi par le client dans le but de le mettre dans le panier
const colorProduct = document.getElementById("colors");
const quantityProduct = document.getElementById("quantity");

// création du tableau et son stockage dans le localStorage
function storage() {
  //Création d'un tableau des données du produit sous format JSON pour les sauvegarder dans le localStorage
  let productChoose = {
    id: canapeId,
    color: colorProduct.value,
    quantity: quantityProduct.value
  }
  // Tout ce code en dessous c'est pour ajouter un objet au panier

  if (colorProduct.value == "" || quantityProduct.value == 0) {// On n'ajoute pas d'objet au panier s'il n'y a pas de couleur ni de quantity
    alert("Veuillez séléctionner une couleur et une quantité pour ajouter ce produit à vore panier")

  } else {
    if (localStorage.getItem('products') == null) {// créer un tableau dans le localstorage s'il n'y a pas de produi
      localStorage.setItem('products', JSON.stringify([productChoose]))
    }
    else {//permet de rajouter un produit dans le tableau du local storage
      let products = JSON.parse(localStorage.getItem('products'));

      let ifInCart = products.findIndex(//On recherche les éléments ayant le même id et la même couleur
        (item => item.id === productChoose.id && item.color === productChoose.color)
      )
      if (ifInCart == -1) { //S'il n'existe pas, on l'ajoute au local Storage
        products.push(productChoose)
      }
      else { //Sinon on additionne la quantité de produit ayant la même id et la même couleur dans le local Storage
        products[ifInCart].quantity = String(parseInt(products[ifInCart].quantity) + parseInt(productChoose.quantity))
      }
      localStorage.setItem('products', JSON.stringify(products))
    }
    //Message de validation pour confirmer l'ajout du produit au panier, et redirection vers la page panier si le client clique sur "OK"
    /*if (confirm("Votre article a été ajouté ! Voulez-vous accéder à votre panier ?")){
      window.location.href ="../html/cart.html"
    }*/
  }
}

//fonction qui permet de calculer la quantité d'objet dans le panier et de l'afficher dynamiquement sur la page 
function counterPanier() {
  let paniers = JSON.parse(localStorage.getItem('products'));
  if (paniers != null) {
    let articleQuantity = paniers.reduce(function (total, { quantity }) {
      return total + quantity++
    }, 0);
    const barNav = document.querySelectorAll("nav li");
    barNav[1].innerHTML = `Panier (${articleQuantity})`
  }
}
counterPanier()

//event au clic qui permet d'ajouter un produit au panier
let addProduct = document.getElementById('addToCart');
addProduct.addEventListener('click', function (event) {
  storage()
  counterPanier()
})
