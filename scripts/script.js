let cart = JSON.parse(localStorage.getItem("strive_cart"));

const fetchBooks = () => {
  fetch("https://striveschool-api.herokuapp.com/books")
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Risposta ricevuta, ma errore!", response.status);
      }
    })
    .then((books) => {
      renderBooks(books);
    })
    .catch((error) => {
      console.error("Si è verificato un errore:", error);
      const container = document.getElementById("book-container");
      container.innerHTML = `<p class="text-danger text-center w-100">Impossibile caricare i libri. Riprova più tardi.</p>`;
    });
};

const renderBooks = (books) => {
  const container = document.getElementById("book-container");
  container.innerHTML = "";

  books.forEach((book) => {
    const col = document.createElement("div");
    col.classList.add("col");
    col.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${book.img}" class="object-fit-cover h-100 card-img-top" alt="${book.title}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title text-truncate" title="${book.title}">${book.title}</h5>
                    <p class="card-text fw-bold text-muted">${book.price}€</p>
                    <div class="mt-auto d-flex gap-2">
                        <button class="btn btn-outline-danger btn-sm w-100" onclick="discardCard(this)">Scarta</button>
                        <button class="btn btn-success btn-sm w-100" onclick="addToCart('${book.asin}', '${book.title}', ${book.price})">Aggiungi al carrello</button>
                    </div>
                </div>
            </div>
        `;
    container.appendChild(col);
  });
};

const discardCard = (btn) => {
  btn.closest(".col").remove();
};

const addToCart = (asin, title, price) => {
  const item = { asin, title: title, price };
  cart.push(item);
  updateStorage();
  renderCart();
};

const removeFromCart = (i) => {
  cart.splice(i, 1);
  updateStorage();
  renderCart();
};

const updateStorage = () => {
  localStorage.setItem("strive_cart", JSON.stringify(cart));
};

const renderCart = () => {
  const list = document.getElementById("cart-list");
  const totalElem = document.getElementById("cart-total");
  list.innerHTML = "";

  let total = 0;

  let i = 0;

  cart.forEach((item) => {
    total += item.price;
    const li = document.createElement("li");
    li.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center",
      "fs-6",
    );
    li.innerHTML = `
            <span class="text-truncate me-2">${item.title}</span>
            <span class="me-2 ms-auto">${item.price}€</span>
            <button class="btn btn-sm text-danger" onclick="removeFromCart(${i})">
                &times;
            </button>
        `;
    list.appendChild(li);
    i++;
  });

  totalElem.innerText = `Totale: ${total}€`;
};

fetchBooks();
renderCart();
