const API = "http://localhost:5000/api";

/* =========================
   REGISTER
========================= */

async function register(){

    const username =
    document.getElementById("username").value;

    const email =
    document.getElementById("email").value;

    const password =
    document.getElementById("password").value;

    if(!username || !email || !password){

        alert("Please Fill All Fields");

        return;
    }

    try{

        const res = await fetch(
            `${API}/auth/register`,
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({
                    username,
                    email,
                    password
                })
            }
        );

        const data = await res.json();

        alert(data.message);

        window.location = "login.html";

    }catch(error){

        console.log(error);

        alert("Registration Failed");

    }
}

/* =========================
   LOGIN
========================= */

async function login(){

    const email =
    document.getElementById("loginEmail").value;

    const password =
    document.getElementById("loginPassword").value;

    if(!email || !password){

        alert("Please Fill All Fields");

        return;
    }

    try{

        const res = await fetch(
            `${API}/auth/login`,
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await res.json();

        if(data.token){

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            alert("Login Successful");

            window.location =
            "dashboard.html";

        }
        else{

            alert(data.message);

        }

    }catch(error){

        console.log(error);

        alert("Login Failed");

    }
}

/* =========================
   GO BACK
========================= */

function goBack(){

     window.location.href = "index.html";

}

/* =========================
   LOGOUT
========================= */

function logout(){

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location = "login.html";
}

/* =========================
   CREATE POST
========================= */

async function createPost(){

    const title =
    document.getElementById("title").value;

    const content =
    document.getElementById("content").value;

    const image =
    document.getElementById("image").value;

    const token =
    localStorage.getItem("token");

    if(!token){

        alert("Please Login");

        return;
    }

    if(!title || !content){

        alert("Please Fill All Fields");

        return;
    }

    try{

        const res = await fetch(
            `${API}/posts`,
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json",
                    "Authorization":token
                },

                body:JSON.stringify({
                    title,
                    content,
                    image
                })
            }
        );

        const data = await res.json();

        alert(data.message);

        document.getElementById("title").value = "";
        document.getElementById("content").value = "";
        document.getElementById("image").value = "";

        loadPosts();

    }catch(error){

        console.log(error);

        alert("Post Creation Failed");

    }
}

/* =========================
   LOAD POSTS
========================= */

async function loadPosts(){

    const postsContainer =
    document.getElementById("postsContainer");

    const dashboardContainer =
    document.getElementById("dashboardPosts");

    try{

        const res = await fetch(
            `${API}/posts`
        );

        const posts = await res.json();

        if(postsContainer){
            postsContainer.innerHTML = "";
        }

        if(dashboardContainer){
            dashboardContainer.innerHTML = "";
        }

        posts.forEach(post=>{

            const postHTML = `
            
            <div class="card">

                <div class="user-info">

                    <div class="avatar">
                        ${post.username.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <h4>${post.username}</h4>
                        <small>Posted Recently</small>
                    </div>

                </div>

                <img src="${post.image}">
                
                <h2>${post.title}</h2>

                <p>${post.content}</p>

                <div class="actions">

                    <button onclick="likePost(${post.id})">
                    ❤️ Like
                    </button>

                    <button onclick="sharePost(${post.id})">
                    📤 Share
                    </button>

                    <button onclick="savePost(${post.id})">
                    📌 Save
                    </button>

                    <button onclick="deletePost(${post.id})">
                    🗑 Delete
                    </button>

                </div>

                <div class="comment-box">

                    <input
                    type="text"
                    id="comment-${post.id}"
                    placeholder="Write comment">

                    <button
                    onclick="addComment(${post.id})">
                    💬 Comment
                    </button>

                    <div id="comments-${post.id}">
                    </div>

                </div>

            </div>
            `;

            if(postsContainer){
                postsContainer.innerHTML += postHTML;
            }

            if(dashboardContainer){
                dashboardContainer.innerHTML += postHTML;
            }

            loadComments(post.id);

        });

    }catch(error){

        console.log(error);

    }
}

/* =========================
   DELETE POST
========================= */

async function deletePost(id){

    const token =
    localStorage.getItem("token");

    if(!token){

        alert("Login Required");

        return;
    }

    try{

        const res = await fetch(
            `${API}/posts/${id}`,
            {
                method:"DELETE",

                headers:{
                    "Authorization":token
                }
            }
        );

        const data = await res.json();

        alert(data.message);

        loadPosts();

    }catch(error){

        console.log(error);

        alert("Delete Failed");

    }
}

/* =========================
   LIKE POST
========================= */

async function likePost(id){

    const token =
    localStorage.getItem("token");

    if(!token){

        alert("Please Login");

        return;
    }

    await fetch(
        `${API}/posts/like/${id}`,
        {
            method:"POST",

            headers:{
                "Authorization":token
            }
        }
    );

    alert("Liked ❤️");
}

/* =========================
   SAVE POST
========================= */

function savePost(id){

    let saved =
    JSON.parse(
        localStorage.getItem("saved")
    ) || [];

    saved.push(id);

    localStorage.setItem(
        "saved",
        JSON.stringify(saved)
    );

    alert("Saved 📌");
}

/* =========================
   SHARE POST
========================= */

function sharePost(id){

    navigator.clipboard.writeText(
        window.location.href + "?post=" + id
    );

    alert("Post Link Copied 📤");
}

/* =========================
   ADD COMMENT
========================= */

async function addComment(postId){

    const comment =
    document.getElementById(
        `comment-${postId}`
    ).value;

    const token =
    localStorage.getItem("token");

    if(!token){

        alert("Please Login");

        return;
    }

    if(!comment){

        alert("Write Something");

        return;
    }

    try{

        const res = await fetch(
            `${API}/comments`,
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json",
                    "Authorization":token
                },

                body:JSON.stringify({
                    comment,
                    post_id:postId
                })
            }
        );

        const data = await res.json();

        alert(data.message);

        document.getElementById(
            `comment-${postId}`
        ).value = "";

        loadComments(postId);

    }catch(error){

        console.log(error);

    }
}

/* =========================
   LOAD COMMENTS
========================= */

async function loadComments(postId){

    const container =
    document.getElementById(
        `comments-${postId}`
    );

    if(!container) return;

    try{

        const res = await fetch(
            `${API}/comments/${postId}`
        );

        const comments =
        await res.json();

        container.innerHTML = "";

        comments.forEach(comment=>{

            container.innerHTML += `
            
            <div class="comment">

                <strong>
                ${comment.username}
                </strong>

                <p>${comment.comment}</p>

            </div>
            `;
        });

    }catch(error){

        console.log(error);

    }
}

/* =========================
   SEARCH POSTS
========================= */

function searchPosts(){

    const value =
    document.getElementById(
        "searchInput"
    ).value.toLowerCase();

    const cards =
    document.querySelectorAll(".card");

    cards.forEach(card=>{

        card.style.display =
        card.innerText
        .toLowerCase()
        .includes(value)
        ? "block"
        : "none";

    });
}

/* =========================
   INITIAL LOAD
========================= */

loadPosts();