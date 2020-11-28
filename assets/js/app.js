// List constructor
class List {
  constructor(logo, promo1, promo2, promo3, rating, remark, url) {
    this.logo = logo;
    this.promo1 = promo1;
    this.promo2 = promo2;
    this.promo3 = promo3;
    this.rating = rating;
    this.remark = remark;
  }
}

// UI Constructor
class UI {
  addList(list) {
    const record = document.querySelector('.list-content');

    // create row
    const row = document.createElement('div');
    // add class
    row.className = 'row';

    // add innerHTML
    row.innerHTML = `
      <div class="list-details">
        <div class="brand">
          <a href="#"><img src="./assets/images/${list.logo}" alt="Wix logo"></a>
        </div>
        <div class="brand-info">
          <ul>
            <li>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <span> Please vote!</span>
            </li>
            <li>
              <i class="fas fa-cog"></i> ${list.promo1}..
            </li>
            <li>
              <i class="fas fa-cog"></i> ${list.promo2}..
            </li>
            <li>
              <i class="fas fa-cog"></i> ${list.promo3}..
            </li>
          </ul>
        </div>
        <div class="brand-rating">
          <ul>
            <li>${list.rating}</li>
            <li>${list.remark}</li>
          </ul>
        </div>
        <div>
          <a class="btn" href="#">Visit Site <i class="fas fa-angle-double-right"></i></a>
        </div>
        <div id="delete-btn">
          <a class="btn delete" href="#">Delete <i class="fas fa-trash-alt"></i></a>
        </div>
      </div>
      <div class="show-more">
        <a href="#"><i class="fas fa-angle-down"></i></a>
      </div>
    `;

    record.appendChild(row);
  }

  showAlert(message, className) {
    // create div
    const div = document.createElement('div');
    // Add class name
    div.className = `alert ${className} my-3`;
    // Add Text node
    div.appendChild(document.createTextNode(message));

    // Get parent
    const parent = document.getElementById('parent');
    // Get form 
    const form = document.getElementById('manage-form');

    // insert alert
    parent.insertBefore(div, form);

    setTimeout(() => {
      document.querySelector('.alert').remove();
    }, 3000);
  }

  deleteList(target) {
    if (target.classList.contains('delete')) {
      target.parentElement.parentElement.parentElement.remove();
    }
  }

  clearFields() {
    document.getElementById('logo').value = '';
    document.getElementById('promo1').value = '';
    document.getElementById('promo2').value = '';
    document.getElementById('promo3').value = '';
    document.getElementById('rating').value = '';
    document.getElementById('remark').value = '';
  }
}

// Local Storage Constructor
class Store {
  static getList() {
    let lists;
    if (localStorage.getItem('lists') === null) {
      lists = [];
    } else {
      lists = JSON.parse(localStorage.getItem('lists'));
    }

    return lists;
  }

  static displayList() {
    const lists = Store.getList();

    // Instantiate UI
    const ui = new UI();

    lists.forEach((list) => {
      ui.addList(list);
    });

  }

  static addList(list) {
    const lists = Store.getList();
    lists.push(list);
    localStorage.setItem('lists', JSON.stringify(lists));
  }

  static removeList(rating) {
    const lists = Store.getList();

    // Instantiate ui
    const ui = new UI();

    // console.log(typeof rating);

    lists.forEach((list, index) => {
      if (list.rating === parseFloat(rating)) {
        // console.log(typeof list.rating);
        lists.splice(index, 1);
      }
    });

    localStorage.setItem('lists', JSON.stringify(lists));

    ui.showAlert('List Removed', 'success');

  }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayList);

// Event Listener for adding List
document.getElementById('manage-form').addEventListener('submit', (e) => {
  // Get form values
  const logo = document.getElementById('logo').value,
    promo1 = document.getElementById('promo1').value,
    promo2 = document.getElementById('promo2').value,
    promo3 = document.getElementById('promo3').value,
    rating = document.getElementById('rating').value,
    remark = document.getElementById('remark').value;

  const rounded = Math.round(rating * 10) / 10;
  const fixed = parseFloat(rounded.toFixed(1));
  const length = 40;
  const trimmedPromo1 = promo1.substring(0, length);
  const trimmedPromo2 = promo2.substring(0, length);
  const trimmedPromo3 = promo3.substring(0, length);

  console.log(typeof fixed);

  // get filename of logo
  const filename = logo.replace(/^.*[\\\/]/, '');

  // Init List
  const list = new List(filename, trimmedPromo1, trimmedPromo2, trimmedPromo3, fixed, remark);

  // Init UI
  const ui = new UI();

  // Validate
  if (logo === '' || promo1 === '' || promo2 === '' || promo3 === '' || rating === '' || remark === '') {
    ui.showAlert('Please fill in all fields', 'error');
  } else {
    // Add List
    ui.addList(list);

    // Add to Local storage
    Store.addList(list);

    // Show success
    ui.showAlert('List successfully added', 'success');

    // clear fields
    ui.clearFields();
  }

  e.preventDefault();
});


// Event Listener for Delete 
document.getElementById('list-record').addEventListener('click', e => {

  // Instantiate UI
  const ui = new UI();

  // Delete list
  ui.deleteList(e.target);

  // Remove from local storage
  Store.removeList(e.target.parentElement.previousElementSibling.previousElementSibling.firstElementChild.firstElementChild.textContent);

  e.preventDefault();
});