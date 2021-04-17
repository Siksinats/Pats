
var overviewItem = '';
if (localStorage.getItem('cart') === null) {
    var cartContents = []
} else {
    var cartContents = getCartContents()
}

$(document).ready(function () {
    overviewItem = JSON.parse(localStorage.getItem('calledProduct'))
    populateProduct(setHTML())

    $('#add-btn').on('click', function () {
        addToCart(getCost())
    })
})


/**
    * @desc Returns the desired html template for the product page.
 */
function setHTML() {
    return (`
    <div class='product-heading'>
        <h1>${overviewItem.name}</h1>
    </div>
    <div class='container'>
        <img src='../Images/${overviewItem.pictureName}'>
    </div>
    <div class="container">
        <h3>Description:</h3>
        <p>${overviewItem.description}</p>
        <p class="bold">Would You Like To Add a Lesson?</p>

        <div class='lesson-container'>
            <div class='lesson'>
                <p>30 Minute Lesson</p>
                <p>+$30.00</p>
            </div>
            <div class='lesson'>
                <p>1 Hour Lesson</p>
                <p>+$50.00</p>
            </div>
        </div>


    </div>
    <div class='container'>
        <div class='price-container'>
            <p id='price'>${overviewItem.price}</p>
            <p>+ tax</p>
        </div>

        <div id='quantity'>
            <input id='unit-count' type="number" min='1' max="99" value='1'>
            <button id='add-btn'>Add</button>
        </div>

        <div class='help-box'>
            <h4 class="bold">Unsure About Something?</h4>
            <p>Give us a call and we'll be glad to help!</p>
        </div>
    </div>`)
}


/**
    * @desc Appends the html input to the overview body 
    * @param html Desired html to be appened to product body
 */
function populateProduct(html) {
    $('#overview').append(html)
}


/**
    * @desc Returns the cost and count of the item displayed in the product page. 
 */
function getCost() {
    let unitCost = overviewItem.price.replace('$', '').replace(',', '')
    let unitCount = $('#unit-count').val()

    return [unitCount, unitCost]

}


/**
    * @desc Adds showcased item and count to the viewable cart and the local storage cart. 
    * @param setCart Array [@param count, @param cost]
 */
function addToCart(setCart) {
    let addContents = {}

    addContents = {
        'item': overviewItem,
        'count': parseFloat(setCart[0]),
        'unitCost': setCart[1],
        'total': Math.round(setCart[0] * setCart[1])
    }

    if (cartContents.length == 0) {
        cartContents.push(addContents)
    } else if (cartContents.filter(e => e.item.name === addContents.item.name).length > 0) {
        $(cartContents).each(function (i, value) {
            if (value.item.name == addContents.item.name) {
                value.count = value.count + addContents.count
                value.total = value.count * value.unitCost
            }
        })
    } else {
        cartContents.push(addContents)
    }
    updateCartContents(cartContents)
}


/**
    * @desc Updates the viewable cart total. 
 */
function updateCartTotal() {
    let total = 0;
    $('.cart-card').each(function (index, val) {
        total = total + parseFloat($(val).children('.price')[0].innerText.replace('$', ''))
    })
    $('#cart-total').html('$' + Math.round((total + Number.EPSILON) * 100) / 100)
}




