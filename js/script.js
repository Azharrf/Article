let url = ['https://jsonplaceholder.typicode.com/users', 'https://jsonplaceholder.typicode.com/posts']
const mainArticle = document.querySelector('.main-article');
const titleArticle = document.getElementById('title-article');
const bodyArticle = document.getElementById('body-article');
const username = document.getElementById('username');
const website = document.getElementById('website');
const sbmtButton = document.querySelector('.sbmt-button');
const dltButton = document.querySelector('.btn-delete');
const mdlPost = document.querySelector('.modal-body');
const menuIcon = document.querySelector('.menu-icon');
const menuSlide = document.querySelector('.menu');
const listElement = document.querySelector('.articles');
const paginationElement = document.querySelector('.pagination');
const newData = [];
let curentPage = 1;
let rows = 10;
let user = url[0];
let post = url[1];
let id = '';

// Menu Toggle
menuIcon.addEventListener('click', () => {
    menuSlide.classList.toggle('active');
    menuIcon.classList.toggle('active');
})

// Menu card
document.addEventListener('click', function(e) {
    if(e.target.classList.contains('menu-toggle')){
        e.target.nextElementSibling.classList.toggle('active');
    }
});

// Fetch API
Promise.all(url.map(u => fetch(u)))
        .then(response => Promise.all(response.map(res => res.json())))
        .then(data => getArticle(data))

function getArticle(data){
    // console.log("data", data)
    let users = data[0];
    let posts = data[1];

    posts.forEach(post => {
        users.forEach(user => {
            if(post.userId == user.id){
                let merged = Object.assign({}, user, post)
                newData.push(merged);
            }
        });
    });
    displayList(newData, listElement, rows, curentPage);
    setupPagination(newData, paginationElement, rows);
}

// Card
function displayList(items, wrapper, rowsPage, page) {
    wrapper.innerHTML = '';
    page--;

    let start = rowsPage * page;
    let end = start + rowsPage;
    let paginatedItems = items.slice(start, end)

    for(let i = 0; i < paginatedItems.length; i++){
        let item = paginatedItems[i];

        let itemElement = document.createElement('div');
        itemElement.classList.add('col');
        itemElement.classList.add('card-article');
        itemElement.innerHTML = card(item);

        wrapper.appendChild(itemElement);
    }
}

function card(item){
    return `<div class="card" data-post="${item.id}">
                <div class="settings">
                    <i class='bx bx-dots-vertical-rounded menu-toggle'></i>
                    <div class="set">
                        <a href="#" class="menu edit" id="edit-post" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class='bx bxs-edit'></i>Edit</a>

                        <a href="#" class="menu delete" id="delete-post" data-bs-toggle="modal" data-bs-target="#modal-alert"><i class='bx bxs-trash'></i>Delete</a>
                    </div>
                </div>
                <div class="col-md-5 poster">
                    <img src="img/3.jpg">
                </div>
                <div class="col-md-7 desc-article">
                    <h1 class="title-post">${item.title}</h1>
                    <p class="body-post">${item.body}</p>
                    <div class="user">
                        <div class="avatar">
                            <i class='bx bxs-user'></i>
                        </div>
                        <div class="name">
                            <h5 class="username">${item.name}</h5>
                            <span class="website">${item.website}</span>
                        </div>
                    </div>
                </div>
            </div>`
}

mainArticle.addEventListener('click', (e) => {
    // console.log(e.target.classList)
    var parent = e.target.parentElement.parentElement.parentElement
    let editButton = (e.target.id == "edit-post");
    id = parent.dataset.post;

    // Edit
    if(editButton){
        let titleContent = parent.querySelector('.title-post').textContent;
        let bodyContent = parent.querySelector('.body-post').textContent;
        let userName = parent.querySelector('.username').textContent;
        let webSite = parent.querySelector('.website').textContent;

        titleArticle.value = titleContent;
        bodyArticle.value = bodyContent;
        username.value = userName;
        website.value = webSite;
    }
});

// Update
sbmtButton.addEventListener('click', async (e) => {
    e.preventDefault();
    // console.log(`${id}`)
    await fetch(`${post}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: titleArticle.value,
            body: bodyArticle.value,
        })

    })
        .then(res => res.json())
        .then(data => {
            alert(`Title: ${data.title}\nBody: ${data.body}`);
            sbmtButton.setAttribute('data-bs-dismiss', 'modal')
        })
    titleArticle.value = '';
    bodyArticle.value = '';
    username.value = '';
    website.value = '';
});

// Add Post
mdlPost.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('halo')
    fetch(`${post}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: titleArticle.value,
            body: bodyArticle.value
            // name: username.value,
            // website: website.value,
        })
    })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            // const dataArr = [];
            // dataArr.push(data);
            // card(data);
            alert(`Title: ${data.title}\nBody: ${data.body}`);
            sbmtButton.setAttribute('data-bs-dismiss', 'modal');
        })
});

// Delete
dltButton.addEventListener('click', () => {
    fetch(`${post}/${id}`, {
        method: 'DELETE'
    })
        .then(res => res.json())
        .then(document.addEventListener('click', (e) => {
            if(e.target.classList.contains('btn-delete')){
                dltButton.setAttribute('data-bs-dismiss', 'modal')
            }
        }))
});

// Pagination
function setupPagination(items, wrapper, rowsPage) {
    wrapper.innerHTML = '';

    let pageCount = Math.ceil(items.length / rowsPage);
    for(let i = 1; i < pageCount + 1; i++){
        let btn = paginationButton(i, items);
        wrapper.appendChild(btn)
    }
}

function paginationButton(page, items){
    let newButton = document.createElement('li');
    newButton.classList.add('page-item');
    let newLink = document.createElement('a');
    newLink.classList.add('page-link');
    newLink.innerText = page;

    newButton.appendChild(newLink)

    if(curentPage == page){
        newButton.classList.add('active');
    }

    newButton.addEventListener('click', function() {
        curentPage = page;
        displayList(items, listElement, rows, curentPage);

        let curentBtn = document.querySelector('.pagination .page-item.active');
        curentBtn.classList.remove('active');

        newButton.classList.add('active');
        jumpTop();
    })

    return newButton;
}

function jumpTop(){
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}