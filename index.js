import {menuArray} from "/data"

const paymentFormEl = document.getElementById("payment-form")

const orderList = []

let orderIsPayed = false
let user = {
    name: null,
    cardNumber: null,
    cvv: null
}

//  When user clicks on document
document.addEventListener('click', function(e)
{
    const paymentModalEl = document.getElementById("payment-modal")
    
    // if the payment modal is open
    if (!paymentModalEl.classList.contains('hidden'))
    {
        //  and the user clicked outside the modal, close the modal
        const clickInside = paymentModalEl.contains(e.target)
        
        if (!clickInside){
            hidePaymentModal()
        }
    }
    //  if the payment modal is not open
    else
    {    //  Add Item to Order
        if (e.target.className === "add-item-btn")
        {
            addItem(e.target.dataset.id)
        }
        //  Remove Item from Order
        else if (e.target.dataset.order)
        {
            removeItem(e.target.dataset.order)
        }
        //  Open payment modal when user clicks complete order btn
        else if (e.target.id === "complete-order-btn")
        {
            handleCompleteOrderBtn()
        }
    }
})

paymentFormEl.addEventListener("submit", function(e){
    e.preventDefault()
    
    //  log users info for later use
    user.name = document.getElementById("user-name").value
    user.cardNumber = document.getElementById("user-card-number").value
    user.cvv = document.getElementById("user-cvv").value
    
    // Display Order-Complete State
    handlePaymentBtn()
    
    // Once the payment form is submitted, hide the paymentFormModal
    hidePaymentModal()
    
    render()
})

function addItem(item) {
    const menuItem = menuArray.find(function(foundItem){
        return foundItem.id == item
    })
    
    orderList.push(menuItem)
    
    render()
}

function removeItem(orderId){
    orderList.splice(orderId, 1)
    
    render()
}

function handleCompleteOrderBtn(){
    //  show payment modal when user clicks complete order button
    showPaymentModal()
}

function render()
{
    // Render Menu Items
    document.getElementById("menu-list").innerHTML = getMenuHtml()
    
    //  Render Checkout list
    document.getElementById("checkout-list").innerHTML = getCheckoutHtml()
    
    //  Render Total Price at checkout
    renderTotalPriceHtml(getTotalPrice())
    
    //  Render Completed Order message
    renderCompleteOrder()
}

function getMenuHtml(){
    const menuHtml = menuArray.map(function(item)
    {
        const {name, ingredients, id, price, emoji} = item
        return `
        <li class="menu-item">
            <div class="item-image">
                <p>${emoji}<p>
            </div>
            <div class="item-info">
                <h2 class="item-info-name">${name}</h2>
                <p class="item-info-ingredients">${ingredients.join(', ')}</p>
                <p class="item-info-price">$${price}</p>
            </div>
            <div class="item-button">
                <button class="add-item-btn" data-id="${id}">+</button>
            </div>
        </li>
        `
    }).join('')
    
    return menuHtml
}

function getCheckoutHtml()
{
    //  Checkout list is hidden if there are no items in the user's order or if the user has already payed
    if (orderList.length == 0 || orderIsPayed)
    {
        document.getElementById("checkout").classList.add('hidden')
    }
    else
    {
        document.getElementById("checkout").classList.remove('hidden')
    }
    
    const checkoutListHtml = orderList.map(function(order, index)
    {
        return `
            <li class="order-item">${order.name} 
                <span class="remove-btn" data-order=${index}>remove</span> 
                <span class="price">$${order.price}</span>
            </li>`
    }).join('')
    
    return checkoutListHtml
}

function renderCompleteOrder(){
    if(orderIsPayed)
    {
        const completeOrderEl = document.getElementById('complete-order')
        
        completeOrderEl.innerHTML = `
            <div class="container-inner">
                <p class="completed-order-message">Thanks, ${sanitizeHTML(user.name)}! Your order is on its way!<p>
            </div>`
    }
}

function getTotalPrice()
{
    return orderList.reduce(function(total, currentItem){
        return total + currentItem.price
    }, 0)
}

function renderTotalPriceHtml(totalPrice)
{
    const totalPriceEl = document.getElementById("total-price")
    totalPriceEl.innerHTML = `Total Price: <span class="price total">$${totalPrice}</span>`
}

function handlePaymentBtn()
{
    orderIsPayed = true;
}

function hidePaymentModal()
{
    document.getElementById("payment-modal").classList.add("hidden")
}

function showPaymentModal()
{
    document.getElementById("payment-modal").classList.remove("hidden")
}

//  filters malicious html from user input
var sanitizeHTML = function (str) {
    var temp = document.createElement('div')
    temp.textContent = str;
    return temp.innerHTML
}

render()