import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, deleteField } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC6pr5WtpJspCSoyNkbC3ZCLsQK5sT19m8",
  authDomain: "foodpanda-ebe8e.firebaseapp.com",
  projectId: "foodpanda-ebe8e",
  storageBucket: "foodpanda-ebe8e.firebasestorage.app",
  messagingSenderId: "122142660166",
  appId: "1:122142660166:web:085ee15b2b53c5e09c5c47",
  measurementId: "G-X2XBFY6P0B"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let getsbtn = document.getElementById('signup')
if (getsbtn) {
  getsbtn.addEventListener('click', () => {
    let getemail = document.getElementById('semail')
    let getpass = document.getElementById('spass')
    createUserWithEmailAndPassword(auth, getemail.value, getpass.value)
      .then((userCredential) => {

        const user = userCredential.user;
        alert("Sign up successfully")
        //  location.href = "./login.html"
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage)
      });
  })
}

let getlbtn = document.getElementById('login')
if (getlbtn) {
  getlbtn.addEventListener('click', () => {
    let getLemail = document.getElementById('lemail')
    let getlpass = document.getElementById('lpass')
    signInWithEmailAndPassword(auth, getLemail.value, getlpass.value)
      .then((userCredential) => {

        const user = userCredential.user;

        location.href = 'selector.html'
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage)
      });

  })
}
let getDiv = document.getElementById('read')


async function createData() {
  getDiv.innerHTML = ""
  let proid = document.getElementById('p-id')
  let proname = document.getElementById('p-name')
  let prodes = document.getElementById('p-desc')
  let proprice = document.getElementById('p-price')
  let proimg = document.getElementById('p-img')

  try {
    const docRef = await addDoc(collection(db, "Products"), {
      id: proid.value,
      name: proname.value,
      description: prodes.value,
      price: proprice.value,
      image: proimg.value
    });

    readData()
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  window.location.reload()
}
window.createData = createData
async function readData() {
  if (!getDiv) return;
  getDiv.innerHTML = ""


  const querySnapshot = await getDocs(collection(db, "Products"));
  querySnapshot.forEach((doc) => {
    getDiv.innerHTML += `
        <div class="mat col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center">
          <div class="abc card m-2" style="width: 100%;max-width:250px">
      <img src="${doc.data().image}" width="20%" height="200px"  class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">${doc.data().name}</h5>
        <p class="card-text">${doc.data().description}</p>
             <p>${doc.data().price}</p>
             <button onclick="delData('${doc.id}')" class="btn btn-success">Delete</button>
             <button onclick="editData('${doc.id}')" class="btn btn-danger">Edit</button>
    
             <br>
        </div>
    </div>
    </div>
          `
  }
  );
}
if (getDiv) {
  readData();
}



async function delData(e) {
  getDiv.innerHTML = ""
  const cityRef = doc(db, 'Products', e);

  await deleteDoc(cityRef)
    
    ;
  readData()

}
window.delData = delData


async function editData(e) {
  getDiv.innerHTML = ""
  let prompt1 = prompt('Enter correct id')
  let prompt2 = prompt('Enter updated name')
  let prompt3 = prompt('Enter updated description')
  let prompt4 = prompt('Enter updated price')
  let prompt5 = prompt('Enter updated image url')

  const cityRef = doc(db, 'Products', e);

  await updateDoc(cityRef, {
    id: prompt1,
    name: prompt2,
    description: prompt3,
    price: prompt4,
    image: prompt5,
  });
  readData()
}
window.editData = editData
let getDiv2 = document.getElementById('div2')
async function readData2() {
  if (!getDiv2) return;
  getDiv2.innerHTML = ""


  const querySnapshot = await getDocs(collection(db, "Products"));
  querySnapshot.forEach((doc) => {
    getDiv2.innerHTML += `
        <div class=" col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center">
          <div class="card m-2" style="width: 100%;max-width:250px">
      <img src="${doc.data().image}" width="20%" height="200px"  class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">${doc.data().name}</h5>
        <p class="card-text">${doc.data().description}</p>
             <p>${doc.data().price}</p>
<button onclick="addToCart('${doc.data().id}','${doc.data().name}','${doc.data().price}','${doc.data().image}')" class="btn btn-success">Add to Cart</button>    
             <br>
        </div>
    </div>
    </div>
          `
  }
  );
}
if (getDiv2) {
  readData2();
}


async function cartItems() {

  location.href = "cart.html"

}
window.cartItems = cartItems
async function addToCart(id, name, price, image) {
  try {
    const querySnapshot = await getDocs(collection(db, "Carts"));
    let itemsExists = false;  

    querySnapshot.forEach((doc) => {
      if (doc.data().id === id) {
        itemsExists = true;
        updateQuantity(doc.id, doc.data().Quantity + 1);
      }
    });

    if (!itemsExists) {
      await addDoc(collection(db, "Carts"), {
        id,
        name,
        price,
        image,
        Quantity: 1
      });
      alert(`${name} added to cart!`);
    }

    updated();
    readCartItems();  
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}


window.addToCart = addToCart

let getDiv3 = document.getElementById('lbc')
async function readCartItems() {
  const getDiv3 = document.getElementById('lbc');
  if (!getDiv3) return;

  getDiv3.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "Carts"));
  let count = 0;

  querySnapshot.forEach((doc) => {
    count += doc.data().Quantity;
    getDiv3.innerHTML += `
      <div class="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center">
        <div class="card m-2" style="width: 100%;max-width:250px">
          <img src="${doc.data().image}" width="20%" height="200px" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${doc.data().name}</h5>
            <p>${doc.data().price}</p>
            <p>Quantity: &nbsp;
              <button class="zxc" onclick="updateQuantity('${doc.id}', ${doc.data().Quantity - 1})">-</button>&nbsp;
              ${doc.data().Quantity} &nbsp;
              <button class="zxc" onclick="updateQuantity('${doc.id}', ${doc.data().Quantity + 1})">+</button>
            </p>
            <button class="btn btn-success" onclick="deleteData('${doc.id}')">Delete</button>
          </div>
        </div>
      </div>
    `;
  });

  const cartBadge = document.getElementById("cartBadge");
  if (cartBadge) {
    cartBadge.innerHTML = count;
    cartBadge.classList.remove('visually-hidden');
  }
}
readCartItems()
async function deleteData(e) {
  getDiv3.innerHTML = ""
  const cityRef = doc(db, 'Carts', e);

  await deleteDoc(cityRef)
  updated()


  readCartItems()

}
window.deleteData = deleteData


async function updateQuantity(id, quantity) {
  if (quantity < 1) {
    alert("Quantity can't be less than 1");
    return;
  }

  const cityRef = doc(db, 'Carts', id);

  await updateDoc(cityRef, {
    Quantity: Math.floor(quantity), 
  });

  readCartItems();
}

window.updateQuantity = updateQuantity
const cartBadge = document.getElementById("cartBadge");
 async function updated(){
  

  const querySnapshot = await getDocs(collection(db, "Carts"));
  let count = 0;
  querySnapshot.forEach((doc) => {
   count += doc.data().Quantity;
  }) 
  if (cartBadge) {
    cartBadge.innerHTML = count 
    cartBadge.classList.remove('visually-hidden'); 
    }
}
updated()
function userDashboard(){
  location.href = "userdash.html"
}
window.userDashboard = userDashboard

function adminDashboard(){
  location.href="dashboard.html"
}
window.adminDashboard = adminDashboard
function goTo(){
location.href="selector.html"
}
window.goTo = goTo
function goesTo(){
  location.href = "userdash.html"
}
window.goesTo = goesTo