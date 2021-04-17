$(document).ready(function () {
    $('.cart-button').on('click', function () {
        setCartHTML(checkVisibility($('.cart')))
        updateCartTotal()
        $('.cart').toggle('hidden')
    })
})


$(window).on('scroll', function () {
    let height = $('nav').height() + 20
    if ($(this).scrollTop() > height) {
        $('.hidden-nav').css({ 'position': 'fixed', 'top': '0px' })
    }
})


$('.store-tab').on('click', function (e) {
    storeCatagorySelect($(e.target).attr('class'))
})


$('.card').on('click', function (e) {
    if ($(e.target).hasClass('guitars')) {
        storeCatagorySelect('guitars')

    } else if ($(e.target).hasClass('dj-equipment')) {
        storeCatagorySelect('dj-equipment')
    }
})


/**
    * @desc store-tab.hover and store-catagories.hover handle store menu fade in and fade out on nav bar.
    * @param element tab and menu are the store tab, and the menu it opens up, respectively   
 */
$('.store-tab').hover(
    function (e) {
        let tab = $(e.target)
        let menu = $(e.target).children().first()

        tab.addClass('hover')
        menu.css('top', 'initial')
        $('.shadow').css('opacity', '1')
    },
    function (e) {
        let tab = $(e.target)
        let menu = $(e.target).children().first()

        tab.removeClass('hover')
        setTimeout(
            function (menu, tab) {
                if (menu.hasClass('hover') === false && tab.hasClass('hover') === false) {
                    menu.css('top', '-1000px')
                    $('.shadow').css('opacity', '0')
                }
            }, 100, menu, tab
        )
    }
)


/**
    * @desc store-tab.hover and store-catagories.hover handle store menu fade in and fade out on nav bar.
    * @param element tab and menu are the store tab, and the menu it opens up, respectively   
 */
$('.store-catagories').hover(
    function (e) {
        let tab = $(e.target).parent().parent()
        let menu = $(e.target).parent()

        tab.addClass('hover')
        menu.addClass('hover')
    },

    function (e) {

        let tab = $(e.target).parent().parent()
        let menu = $(e.target).parent()

        tab.removeClass('hover')
        menu.removeClass('hover')

        setTimeout(
            function (tab, menu) {
                if (tab.hasClass('hover') === false && menu.hasClass('hover') === false) {
                    menu.css('top', '-1000px')
                    $('.shadow').css('opacity', '0')
                }

                if (tab.hasClass('hover') === false && tab.is(':hover') === true) {
                    tab.addClass('hover')
                    menu.css('top', 'initial')
                    $('.shadow').css('opacity', '1')
                }
            }, 100, tab, menu
        )
    }
)


/**
    * @desc Redirects to Store page
 */
function callStoreRedirect() {
    window.location.href = '../HTML/store.html'
}


/**
    * @desc Operates with local storage asynchronously
    * @param get recieves information from local storage
    * @param set sets information to local storage
    * @param remove deletes information from local storage
 */
const localStorageAsync = {
    set: function (key, value) {
        return Promise.resolve().then(function () {
            localStorage.setItem(key, value);
        });
    },
    get: function (key) {
        return Promise.resolve().then(function () {
            return localStorage.getItem(key);
        });
    },
    remove: function (key) {
        return Promise.resolve().then(function () {
            return localStorage.removeItem(key)
        })
    }
};


/**
    * @desc Adds selected store catagory to filter by on store page, and then redirects to store page
    * @param productType The store catagory selected from the store nav
 */
function storeCatagorySelect(productType) {
    let selected = productType
    localStorageAsync
        .set('storePage', JSON.stringify(productType))
        .then(function () {
            callStoreRedirect()
        })
}



/**
    * @desc Sets and populates the html of cart card for each item in the local storage cart
    * @param cartStatus A boolean that describes the carts visibility
 */
function setCartHTML(cartStatus) {
    let cardHTML = '';


    $.each(getCartContents(), function (index, val) {
        val.total = parseFloat(val.total).toFixed(2)
        cardHTML = `
                <div class='cart-card'>
                    <p class='cart-delete'>&#10005</p>
                    <img src='../Images/${val.item.pictureName}'>
                    <p class='cart-title'>${val.item.name}</p>
                    <div class='cart-count'>
                        <button class='cart-add'>+</button>
                        <p>${val.count}</p>
                        <button class='cart-subtract'>-</button>
                    </div>
                    <p class='price'>$${val.total}</p>
                </div>`
        $('#card-container').append(cardHTML)
    })

    if (cartStatus == false) {
        $('#card-container').empty()
    }
    setCartListener()
}


/**
    * @desc Checks the visibility of the element suppplied
    * @param element Element that is to be checked
 */

function checkVisibility(element) {
    return element.css('display') == 'none'
}


/**
    * @desc Sets event handlers on each applicable element in the cart
 */
function setCartListener() {
    $('.cart-add').on('click', function (e) {
        cartAdd(e)
    })

    $('.cart-subtract').on('click', function (e) {
        cartMinus(e)
    })

    $('.cart-delete').on('click', function (e) {
        cartDelete(e.target)
    })

    $('#checkout').on('click', function () {
        alert('Thank you for your Purchase!')
    })
}


/**
    * @desc Increments the related item count in the cart by one, and updates the cart total as well as the cart contents
    * @desc in the local storage
    * @param e The event that caused the function to fire. 
 */
function cartAdd(e) {
    let itemCount = $(e.target).next()
    let totalCost = $(e.target).parents('.cart-card').children('.price')
    let targetItem = getCartContents().filter(cart => cart.item.name === $(e.target).parents('.cart-card').children('.cart-title')[0].innerText)
    targetItem = targetItem[0]
    targetItem.count = targetItem.count + 1;
    targetItem.total = targetItem.count * targetItem.unitCost

    itemCount.text(targetItem.count)
    totalCost.text('$' + targetItem.total.toFixed(2))

    updateCartTotal()
    updateCartContents(updateItemCount(targetItem))
}


/**
    * @desc Deccrements the related item count in the cart by one, and updates the cart total as well as the cart contents
    * @desc in the local storage
    * @param e The event that caused the function to fire. 
 */
function cartMinus(e) {
    let itemCount = $(e.target).prev()
    let totalCost = $(e.target).parents('.cart-card').children('.price')
    let targetItem = getCartContents().filter(cart => cart.item.name === $(e.target).parents('.cart-card').children('.cart-title')[0].innerText)
    targetItem = targetItem[0]
    targetItem.count = targetItem.count - 1;
    targetItem.total = targetItem.count * targetItem.unitCost

    itemCount.text(targetItem.count)
    totalCost.text('$' + targetItem.total.toFixed(2))

    if (targetItem.count == 0) {
        cartDelete($(e.target).parents('.cart-count').siblings('.cart-delete'))
        updateCartTotal()
    } else {
        updateCartContents(updateItemCount(targetItem))
        updateCartTotal()
    }


}


/**
    * @desc Compares input with current cart contents and replaces if it finds a match and returns the updated cart contents.
    * @param itemUpdate Item to be compared against the cart. 
 */
function updateItemCount(itemUpdate) {
    $.each(cartContents, function (index, val) {
        if (val.item.name == itemUpdate.item.name) {
            val = itemUpdate
        }
    })
    return cartContents
}


/**
    * @desc  Deletes item from the cart, updates the cart total as well as the cart contents in local storage.
    * @param element The element that the remove button is tied to. 
 */
function cartDelete(element) {
    $(element).parent().remove()
    let updatedCart = getCartContents().filter(cart => cart.item.name !== $(element).siblings('.cart-title')[0].innerText)
    updateCartTotal()
    updateCartContents(updatedCart)
}


/**
    * @desc Finds and returns the contents of the cart in local storage. 
 */
function getCartContents() {
    cartContents = JSON.parse(localStorage.getItem('cart'))
    return cartContents
}


/**
    * @desc Sets the local storage cart contents to the input. 
    * @param cartContents The desired cart contens to be written to local storage. 
 */
function updateCartContents(cartContents) {
    localStorage.setItem('cart', JSON.stringify(cartContents))
}


/**
    * @desc Updates the cart total shown in the visual cart.
 */
function updateCartTotal() {
    let total = 0;
    $('.cart-card').each(function (index, val) {
        total = total + parseFloat($(val).children('.price')[0].innerText.replace('$', ''))
    })
    $('#cart-total').html('$' + Math.round((total + Number.EPSILON) * 100) / 100)
}











