// Code nécessaire pour intégrer les produits sur la page d'acceuil de façon dynamique
// Récupération des données de l'API
    fetch("http://localhost:3000/api/products")
    .then(function(res) {
        if (res.ok){
            return res.json();
        }
    })
    .then(function(canapes){
        canapes.forEach(function(canape) {
            // création des objets à insérer dans la page
            var link = document.createElement("a");
            link.href="./product.html?id="+canape._id
            
            var linkArticle = document.createElement("article");
            
            var image = document.createElement("img");
            image.src = canape.imageUrl
            image.alt = canape.altTxt
            
            var nameproduct = document.createElement("h3");
            nameproduct.textContent=canape.name
            nameproduct.className="productName"
            
            var description = document.createElement("p");
            description.textContent = canape.description
            description.className ="productDescription"
            
            //implémantation des objets dans la page
            var card = document.getElementById('items');
            card.appendChild(link);
            card.appendChild(link).appendChild(linkArticle);
            card.appendChild(link).appendChild(linkArticle).appendChild(image);
            card.appendChild(link).appendChild(linkArticle).appendChild(nameproduct);
            card.appendChild(link).appendChild(linkArticle).appendChild(description);  
        })
    })
    .catch(function(error) { //en cas d'erreur lors de la requete à l'api
      const err = document.querySelector('.titles');
      err.innerHTML ="<h2>Veuillez nous excusez, une erreur est survenue.</h2>"
      console.error(error)
    });



