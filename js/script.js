let url = ['https://jsonplaceholder.typicode.com/users', 'https://jsonplaceholder.typicode.com/posts']
const mainArticle = document.querySelector('.main-article');
const titleArticle = document.getElementById('title-article');
const bodyArticle = document.getElementById('body-article');
const username = document.getElementById('username');
const website = document.getElementById('website');
const sbmtButton = document.querySelector('.sbmt-button');
const dltButton = document.querySelector('.btn-delete');
const mdlPost = document.querySelector('.modal-foot-post');
let user = url[0];
let post = url[1];
let id = '';

// Menu Toggle
document.addEventListener('click', function(e) {
    if(e.target.classList.contains('menu-toggle')){
        e.target.nextElementSibling.classList.toggle('active');
    }
});

Promise.all(url.map(u => fetch(u)))
        .then(response => Promise.all(response.map(res => res.json())))
        .then(data => showPost(data))

function showPost(data){
    // console.log("data", data)
    const mainArticle = document.querySelector('.main-article');
    let users = data[0];
    let posts = data[1];
    let article = '';

    posts.map(post => {
        users.map(user => {
            if(post.userId == user.id){
                article += card(user, post)
            }
        });
    });

    // for(i = 0; i < 10; i++){
    //     for(x = 0; x < 10; x++){
    //         if(i >= 1){
    //             let result = x + (i * 10)
    //             // article += result;
    //             article += card(data[0][i], data[1][result])
    //         } else {
    //             // article += x
    //             article += card(data[0][i], data[1][x])
    //         }
    //         // console.log(data[0][i], data[1][x])
    //     }
    // }
    // // console.log(article)
    mainArticle.innerHTML = article;
}

function card(user, post){
    // console.log('card', user, post)
    // Limit Word
    let titleText = post.title.slice(0, 70) + (post.title.length > 70 ? "..." : " ")
    let bodyText = post.body.slice(0, 180) + (post.body.length > 180 ? "..." : " ")

    return `<div class="col card-article">
                <div class="card" data-post="${post.id}">
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
                        <h1 class="title-post">${titleText}</h1>
                        <p class="body-post">${bodyText}</p>
                        <div class="user">
                            <div class="avatar">
                                <i class='bx bxs-user'></i>
                            </div>
                            <div class="name">
                                <h5 class="username">${user.name}</h5>
                                <span class="website">${user.website}</span>
                            </div>
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

    // Update
    sbmtButton.addEventListener('click', (e) => {
        e.preventDefault();
        // console.log(`${id}`)
        fetch(`${post}/${id}`, {
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
            .then(sbmtButton.setAttribute('data-bs-dismiss', 'modal'))
        titleArticle.value = '';
        bodyArticle.value = '';
        username.value = '';
        website.value = '';
    });
});

// Add Post
mdlPost.addEventListener('click', (e) => {
    // console.log('halo')
    fetch(url, {
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
            // renderPosts(dataArr);
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