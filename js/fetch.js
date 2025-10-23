// Select Items
var newMemberAddBtn = document.querySelector('.addMemberBtn'),
  darkBg = document.querySelector('.popup-background'),
  crossBtn = document.querySelector('.closeBtn'),
  submitBtn = document.querySelector('.submitBtn'),
  imgInput = document.querySelector('.img'),
  uploadimg = document.querySelector('#uploadimg'),
  title = document.getElementById('title'),
  idea = document.getElementById('id'),
  category = document.getElementById('category'),
  price = document.getElementById('price'),
  userInfo = document.querySelector('.userInfo'),
  table = document.querySelector('table'),
  entries = document.querySelector('.showEntries'),
  tabSize = document.getElementById('table-size'),
  search = document.getElementById('search');

var tableSize = 3;
var currentIndex = 1;
var startIndex = 0;
var endIndex = 0;
var maxIndex = 0;
var isEdit = false;
var editId = null;
var Data = [];

var apiUrl = 'http://localhost/php/kaosar/learning/api.php';
let originalData = [];

async function callApi() {
  const calledData = await fetch(apiUrl);
  const res = await calledData.json();
  originalData = res.map(item => ({
    id: item.id,
    title: item.title,
    category: item.category,
    price: item.price,
  }));
  Data = [...originalData];
}
callApi();

// Functions
function preloadCalculation() {
  maxIndex = Math.ceil(Data.length / tableSize);
}

function displayIndexBtn() {
  preloadCalculation();
  var pagination = document.querySelector('.pagination');
  pagination.innerHTML = `<button onclick="prev()" class="prev">Prev</button>`;
  for (var a = 1; a <= maxIndex; a++) {
    pagination.innerHTML += `<button onclick="paginationBtn(${a})" index="${a}">${a}</button>`;
  }
  pagination.innerHTML += `<button onclick="next()" class="next">Next</button>`;
}

function highlightIndexBtn() {
  const maxPages = Math.ceil(Data.length / tableSize);
  if (currentIndex > maxPages) currentIndex = maxPages || 1;
  startIndex = (currentIndex - 1) * tableSize;
  endIndex = startIndex + tableSize;
  if (endIndex > Data.length) endIndex = Data.length;

  entries.textContent = `Showing ${startIndex + 1} to ${endIndex} of ${
    Data.length
  } entries`;

  var paginationBtns = document.querySelectorAll('.pagination button');
  paginationBtns.forEach(btn => btn.classList.remove('active'));
  paginationBtns.forEach(btn => {
    if (btn.getAttribute('index') == currentIndex) btn.classList.add('active');
  });

  showInfo();
  disableBtn();
}

function showInfo() {
  userInfo.innerHTML = '';
  if (Data.length === 0) {
    userInfo.innerHTML = `<tr><td class="empty" colspan="6" align="center">No data available in table</td></tr>`;
    return;
  }
  // <td><img src="${staff.picture}" width="40" height="40"></td>
  for (var i = startIndex; i < endIndex; i++) {
    const staff = Data[i];
    userInfo.innerHTML += `<tr class="employeeDetails">
                  <td class="id">${staff.id}</td>
                  <td>${staff.title}</td>
                  <td>${staff.category}</td>
                  <td>$${staff.price}</td>
                  <td>
                      <button onclick="editInfo(${staff.id})">Edit</button>
                      <button onclick="deleteInfo(${staff.id})">Delete</button>
                  </td>
              </tr>`;
  }
}

// Edit & Delete Functions
function editInfo(id) {
  isEdit = true;
  editId = id;

  const index = Data.findIndex(item => item.id == id);
  const staff = Data[index];
  // imgInput.src = staff.picture || 'img.png';
  idea.value = id;
  console.log(index);
  title.value = staff.title;
  category.value = staff.category;
  price.value = staff.price;
  submitBtn.innerHTML = 'Update';
  darkBg.classList.add('active');
}

function deleteInfo(idn) {
  if (confirm('Are you sure you want to delete this entry?')) {
    // if (currentIndex > Math.ceil(Data.length / tableSize)) currentIndex--;
    const information = {
      id: idn,
    };
    console.log(JSON.stringify(information));
    fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(information),
    }).then(data => {
      init(); // it reloads table
    });
  }
}

// Event Listeners
newMemberAddBtn.addEventListener('click', () => {
  isEdit = false;
  editId = null;
  submitBtn.innerHTML = 'Submit';
  // imgInput.src = 'img.png';
  darkBg.classList.add('active');
});

crossBtn.addEventListener('click', () => {
  darkBg.classList.remove('active');
  document.getElementById('myForm').reset();
});

// uploadimg.onchange = function () {
//   if (uploadimg.files[0].size < 5000000) {
//     var filereader = new FileReader();
//     filereader.onload = function (w) {
//       imgInput.src = w.target.result;
//     };
//     filereader.readAsDataURL(uploadimg.files[0]);
//   } else {
//     alert('File is too large!');
//   }
// };

document.getElementById('myForm').addEventListener('submit', e => {
  e.preventDefault();
  const information = {
    // picture: imgInput.src || 'img.png',
    id: id.value,
    title: title.value,
    category: category.value,
    price: price.value,
  };
  console.log(JSON.stringify(information));

  if (isEdit && editId !== null) {
    fetch(apiUrl, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(information),
    }).then(data => {
      init(); // it reloads table
    });
  } else {
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(information),
    }).then(data => {
      init(); // it reloads table
    });
  }

  darkBg.classList.remove('active');
  document.getElementById('myForm').reset();
});

function next() {
  if (currentIndex < maxIndex) {
    currentIndex++;
    highlightIndexBtn();
  }
}

function prev() {
  if (currentIndex > 1) {
    currentIndex--;
    highlightIndexBtn();
  }
}

function paginationBtn(i) {
  currentIndex = i;
  highlightIndexBtn();
}

function disableBtn() {
  const prev = document.querySelector('.prev');
  const next = document.querySelector('.next');

  if (currentIndex === 1) {
    prev.classList.add('disabled');
  } else {
    prev.classList.remove('disabled');
  }

  if (currentIndex === maxIndex) {
    next.classList.add('disabled');
  } else {
    next.classList.remove('disabled');
  }
  if (Data.length === 0) {
    prev.classList.add('disabled');
    next.classList.add('disabled');
  }
}

search.addEventListener('input', function searcrhIt(e) {
  const searchText = e.target.value.toLowerCase().trim();

  if (searchText) {
    const newData = originalData.filter(item =>
      item.title.toLowerCase().includes(searchText)
    );
    Data = newData;

    currentIndex = 1;
    startIndex = 1;
    endIndex = Data.length;
    highlightIndexBtn();
    disableBtn();
    console.log(searchText);
  } else {
    Data = [...originalData];
    currentIndex = 1;
    startIndex = 1;
    showInfo();
    disableBtn();
  }
});

// Initialize
async function init() {
  await callApi();
  displayIndexBtn();
  highlightIndexBtn();
}
init();
