const bookshelf = [];
const RENDER_EVENT = 'render-bookshelf';
const SAVED_EVENT = 'saved-bookshelf';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function isStorageExist(){
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(bookshelf);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const book of data) {
      bookshelf.push(book);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener('DOMContentLoaded', function () {
    const submitBook = document.getElementById('inputBook');
    submitBook.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
    });

    if (isStorageExist()) {
      loadDataFromStorage();
    }
});

function addBook() {
  const bookTitle = document.getElementById('inputBookTitle').value;
  const bookAuthor = document.getElementById('inputBookAuthor').value;
  const bookYear = document.getElementById('inputBookYear').value;
  const bookIsComplete = document.getElementById('inputBookIsComplete');
  let completed = false;

  if(bookIsComplete.checked){
    completed = true;
  }

  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, completed);
  bookshelf.push(bookObject);
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted
  }
}

document.addEventListener(RENDER_EVENT, function () {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    incompleteBookshelfList.innerHTML = '';

    const completeBookshelfList = document.getElementById('completeBookshelfList');
    completeBookshelfList.innerHTML = '';
    
    for (const bookItem of bookshelf) {
        const bookElement = makeBookShelf(bookItem);
        if (!bookItem.isCompleted)
        incompleteBookshelfList.append(bookElement);
        else
        completeBookshelfList.append(bookElement);
    }
});


function makeBookShelf(bookObject) {
  const textTitle = document.createElement('h2');
  textTitle.innerText = bookObject.title
 
  const textAuthor = document.createElement('p');
  textAuthor.innerText = bookObject.author;

  const textYear = document.createElement('p');
  textYear.innerText = bookObject.year;
 
  const textArticle = document.createElement('div');
  textArticle.append(textTitle, textAuthor, textYear);

  const action = document.createElement('div');
  action.classList.add('action');

  const buttonEdit = document.createElement('button');
  buttonEdit.classList.add('yellow');
  buttonEdit.innerText = 'Edit buku';
  
  // EDIT BUKU
  buttonEdit.addEventListener('click', function () {
    const editSection = document.getElementById('edit-section');
    editSection.style.display = 'block';

    const editBookTitle = document.getElementById('editBookTitle');
    editBookTitle.setAttribute('value', bookObject.title);

    const editBookAuthor = document.getElementById('editBookAuthor');
    editBookAuthor.setAttribute('value', bookObject.author);

    const editBookYear = document.getElementById('editBookYear');
    editBookYear.setAttribute('value', bookObject.year);

    // SUBMIT EDIT BUKU
    const editBookElement = document.getElementById('editBook');
    editBookElement.addEventListener('submit', function () {
      editBook(bookObject.id);
      alert('Berhasil mengedit buku');
    });

    // CANCEL EDIT BUKU
    const editCancel = document.getElementById('editCancel');
    editCancel.addEventListener('click', function(){
      editSection.style.display = 'none';
    })
  });

  // HAPUS BUKU
  const buttonHapus = document.createElement('button');
  buttonHapus.classList.add('red');
  buttonHapus.innerText = 'Hapus buku';

  buttonHapus.addEventListener('click', function () {
    const konfimasiHapus = confirm('Apakah anda yakin ingin meghapus buku ' + bookObject.title);
    if(konfimasiHapus){
      removeBook(bookObject.id);
    }else{
      return;
    }
  });

 
  const article = document.createElement('article');
  article.classList.add('book_item');
  article.append(textArticle, action);
  article.setAttribute('id', `book-${bookObject.id}`);

  if (bookObject.isCompleted) {
    const buttonBelumSelesai = document.createElement('button');
    buttonBelumSelesai.classList.add('green');
    buttonBelumSelesai.innerText = 'Belum Selesai';

    buttonBelumSelesai.addEventListener('click', function () {
      undoBookFromCompleted(bookObject.id);
    });
 
    action.append(buttonBelumSelesai, buttonEdit, buttonHapus);
  } else {
    const buttonSelesai = document.createElement('button');
    buttonSelesai.classList.add('green');
    buttonSelesai.innerText = ' Selesai';

    buttonSelesai.addEventListener('click', function () {
      addBookToCompleted(bookObject.id);
    });
 
    action.append(buttonSelesai, buttonEdit, buttonHapus);
  }

  saveData();
 
  return article;
}

function addBookToCompleted (bookId) {
  const bookTarget = findBook(bookId);
 
  if (bookTarget == null) return;
 
  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of bookshelf) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId);
 
  if (bookTarget === -1) return;
 
  bookshelf.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
 
  if (bookTarget == null) return;
 
  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in bookshelf) {
    if (bookshelf[index].id === bookId) {
      return index;
    }
  }
 
  return -1;
}

function editBook(bookId){
  const editTitle = document.getElementById('editBookTitle').value;
  const editAuthor = document.getElementById('editBookAuthor').value;
  const editYear = document.getElementById('editBookYear').value;

  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.title = editTitle;
  bookTarget.author = editAuthor;
  bookTarget.year = editYear;
  
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

