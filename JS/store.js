// Initialize Variables
var storeData = {};
storePage = '',
    products = [],
    isChecked = [];

$(document).ready(function () {
    storePage = JSON.parse(localStorage.getItem('storePage'))
    $('#catagories').children().children('input').each(function (index, value) {
        if (value.id == storePage) {
            value.checked = true
        }
    })
    readStoreJSON()
})

$('#catagories input:checkbox').on('click', function () {
    populateShop(sortChecked(findChecked()))
})

$('#filter-hide').on('click', function () {
    $('#filter').css({ 'left': '-220px' })
    $('#store-body').css({ 'margin-left': '50px' })
    $('#filter-show').css({ 'opacity': '100' })
})

$('#filter-show').on('click', function () {
    $('#filter').css({ 'left': '0px' })
    $('#store-body').css({ 'margin-left': '220px' })
    $('#filter-show').css({ 'opacity': '0' })
})


/**
 * @desc Capitalizes the first letter of every word in a string
 * 
 * @param {string} str String to be capitalized
 * @return {string} Capitalized String
 */
function capitalize_Words(str) {
    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}


/**
 * @desc Retrieves and sets store.html html based off of JSON file, and checked catagories.  
 * 
 * @param get Retrieves store data from local JSON file
 * @param done runs populateShop based off of what catagories is checked
 */
function readStoreJSON() {
    $.get('../JSON/store.json', function (data) {
        storeData = JSON.parse(JSON.stringify(data))
        
        $.each(storeData.store, function (index, value) {
            products.push(this)
            products[index].key = `P${index}`
        })
    }).done(function () {
        populateShop(sortChecked(findChecked()))
    })
}


/**
 * @desc Decides what catagory, if any, to write the store html for and passes it to storHTML
 * 
 * @param {array} list The list that is to be written onto store html. 
 */
function populateShop(list) {
    $('#store-body').empty()
    if (list.length == 0) {
        storeHTML(products)
    } else {
        storeHTML(list)
    }
}


/**
 * @desc Sets the html of store.html based off of list input
 *
 * @param {array} list The array to be parse through and html written for. 
 */
function storeHTML(list) {
    $.each(list, function () {
        $(this).each(function () {
            $('#store-body').append(
                `<div id=${this.key} class='item-card'>
                <div>
                    <img src='../Images/${this.pictureName}'>
                </div>
                    <h3>${this.name}</h3>
                    <p>${this.price}
                </div>`
            )
        })
    })
    $('.item-card').on('click', function (e) {
        let selectedItem = e.target;
        console.log(selectedItem)
        $.each(products, function () {
            if (this.key == selectedItem.id) {
                localStorageAsync
                    .set('calledProduct', JSON.stringify(this))
                    .then(function () {
                        callProductRedirect();
                    })
            }
        })
    })
}

/**
 * @desc Parses through all catagories and returns an array of those that are selected.
 *
 * @return {array} An array of all catagories that are checked. 
 */
function findChecked() {
    isChecked = []
    $('#catagories input:checkbox').each(function () {
        if (this.checked == true) {
            let str = this.value.replace(/\W+/g, ' ').toUpperCase()
            isChecked.push(capitalize_Words(str))
        }
    })
    return isChecked
}


/**
 * @desc Compares all items to checked catagories and returns an array of those that match.
 *
 * @param {array} isChecked An array of all checked catagories
 * @return {array} An array of all items that match the checked catagories
 */
function sortChecked(isChecked) {
    let selected = [];
    $(storeData.store).each(function (index, e) {
        for (let i = 0; i < isChecked.length; i++) {
            if (e.dept == isChecked[i]) {
                selected.push(e)
            }
        }
    })
    return selected;
}


/**
 * @desc Calls for redirect to product page. 
 */
function callProductRedirect() {
    window.location.href = '../HTML/product.html'
}










