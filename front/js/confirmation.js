let href = window.location.href
let url = new URL(href)
let orderID = url.searchParams.get("orderID")

document.getElementById("orderId").textContent = orderID