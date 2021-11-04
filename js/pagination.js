const listItem = [
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5',
    'Item 6',
    'Item 7',
    'Item 8',
    'Item 9',
    'Item 10'
];

const listElement = document.querySelector('.articles');
const paginationElement = document.querySelector('.pagination');

let curentPage = 1;
let rows = 5;

function displayList(items, wrapper, rowsPage, page) {
    wrapper.innerHTML = '';
    page--;

    let start = rowsPage * page;
    let end = start + rowsPage;
    let paginatedItems = items.slice(start, end)

    for(let i = 0; i < paginatedItems.length; i++){
        let item = paginatedItems[i];

        let itemElement = document.createElement('div');
        itemElement.classList.add('item');
        itemElement.innerText = item;

        wrapper.appendChild(itemElement);
    }
}

function setupPagination(items, wrapper, rowsPage) {
    wrapper.innerHTML = '';

    let pageCount = Math.ceil(items.length / rowsPage);
    for(let i = 1; i < pageCount + 1; i++){
        let btn = paginationButton(i, items);
        wrapper.appendChild(btn)
    }
}

function paginationButton(page, items){
    let button = document.createElement('button');
    button.innerText = page;

    if(curentPage == page){
        button.classList.add('active');
    }

    button.addEventListener('click', function() {
        curentPage = page;
        displayList(items, listElement, rows, curentPage);

        let curentBtn = document.querySelector('.pagination button.active');
        curentBtn.classList.remove('active');

        button.classList.add('active');
    })

    return button;
}

displayList(listItem, listElement, rows, curentPage);
setupPagination(listItem, paginationElement, rows)