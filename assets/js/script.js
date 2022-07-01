const books = [];
const STORAGE_KEY = 'BOOKSHELF';
const RENDER_BOOK = 'renderBook';
const SAVED_BOOK = 'savedBook';

const checkStorage = () => {
    if (typeof Storage === undefined) {
        alert('Your browser does not support local storage');
        return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', () => {
    const recordBook = document.querySelector('#recordBook');

    recordBook.addEventListener('submit', (e) => {
        e.preventDefault();
        addBook();

        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#year').value = '';
        document.querySelector('#isComplete').checked = false;
    });


    const editForm = document.querySelector('#editBook');
    console.log(editBook);
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        editBook();

        const record = document.querySelector('#record');
        record.removeAttribute('hidden');

        const edit = document.querySelector('#edit');
        edit.setAttribute('hidden', true);
    });

    if (checkStorage()) {
        loadDataBooksFromStorage();
    }
});

const cancelEdit = document.querySelector('#cancelEdit');
cancelEdit.addEventListener('click', () => {
    const record = document.querySelector('#record');
    record.removeAttribute('hidden');

    const edit = document.querySelector('#edit');
    edit.setAttribute('hidden', true);
});

const addBook = () => {
    const getId = getIdBook();
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const year = document.querySelector('#year').value;
    const isComplete = document.querySelector('#isComplete').checked;
    
    const booksObject = generateBookObject(getId, title, author, year, isComplete);

    books.push(booksObject);

    document.dispatchEvent(new Event(RENDER_BOOK));

    saveDataBooks();
}

const editBook = () => {
    const idBook = parseInt(document.querySelector('#idBook').value);
    console.log(`idBook: ${idBook}`);
    for (item of books) {
        console.log(`item.id: ${item.id}`);
        console.log(`idBook: ${idBook}`);
        console.log(item.id === idBook);
        if (item.id === idBook) {
            item.title = document.querySelector('#editTitle').value;
            item.author = document.querySelector('#editAuthor').value;
            item.year = document.querySelector('#editYear').value;
            item.isComplete = document.querySelector('#editIsComplete').checked;

            document.dispatchEvent(new Event(RENDER_BOOK));

            saveDataBooks();
        }
    }
}

const getIdBook = () => {
    return +new Date();
}

const generateBookObject = (id, title, author, year, isComplete) => {
    return {
        id,
        title,
        author,
        year,
        isComplete
    }
}

const saveDataBooks = () => {
    if (checkStorage()) {
        const parse = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parse);
        document.dispatchEvent(new Event(SAVED_BOOK));
    }
}

document.addEventListener(SAVED_BOOK, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

const loadDataBooksFromStorage = () => {
    const listBook = localStorage.getItem(STORAGE_KEY);

    let dataBooks = JSON.parse(listBook);

    if (dataBooks !== null) {
        for (list of dataBooks) {
            books.push(list);
        }
    }

    document.dispatchEvent(new Event(RENDER_BOOK));
}

document.addEventListener(RENDER_BOOK, () => {
    const notFinishedReading = document.querySelector('#notFinishedReadingList');
    notFinishedReading.innerHTML = '';

    const finishedReading = document.querySelector('#finishedReadingList');
    finishedReading.innerHTML = '';

    for (item of books) {
        const bookElement = createBookElement(item);

        if (item.isComplete) {
            finishedReading.append(bookElement);
        } else {
            notFinishedReading.append(bookElement);
        }
    }
});

const createBookElement = (booksObject) => {
    const { id, title, author, year, isComplete } = booksObject;

    const bookTitle = document.createElement('h3');
    bookTitle.innerHTML = title;

    const bookAuthor = document.createElement('p');
    bookAuthor.innerHTML = `Author: ${author}`;

    const bookYear = document.createElement('p');
    bookYear.innerHTML = year;

    const containerList = document.createElement('article');
    containerList.classList.add('book_list');
    containerList.append(bookTitle, bookAuthor, bookYear);
    containerList.setAttribute('id', `id-${id}`);

    if (isComplete) {
        const notFinishedButton = document.createElement('button');
        notFinishedButton.classList.add('not-finished-book');
        notFinishedButton.innerHTML = 'Not Finished';

        const editButton = document.createElement('button');
        editButton.classList.add('edit-book');
        editButton.innerHTML = 'Edit';

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-book');
        deleteButton.innerHTML = 'Delete';


        const tagDiv = document.createElement('div');
        tagDiv.classList.add('action');
        tagDiv.append(notFinishedButton,  editButton, deleteButton);

        notFinishedButton.addEventListener('click', () => {
            addToNotFinishedReading(id);
        })

        deleteButton.addEventListener('click', () => {
            const modal = document.querySelector('.modal');
            modal.style.display = 'block';

            const validate = document.querySelector('.validation');

            validate.addEventListener('click', () => {
                deleteBook(id);
                modal.style.display = 'none';
            })

            const cancelDelete = document.querySelector('.cancel');
            cancelDelete.addEventListener('click', () => {
                modal.style.display = 'none';
            })
        });

        editButton.addEventListener("click", function () {
            showFormEdit(id);
        });

        containerList.append(tagDiv);
    } else {
        const finishedButton = document.createElement('button');
        finishedButton.classList.add('finished-book');
        finishedButton.innerText = 'Finished';

        const editButton = document.createElement('button');
        editButton.classList.add('edit-book');
        editButton.innerText = 'Edit';

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-book');
        deleteButton.innerText = 'Delete';


        const tagDiv = document.createElement('div');
        tagDiv.classList.add('action');
        tagDiv.append(finishedButton, editButton, deleteButton);

        finishedButton.addEventListener('click', () => {
            addToFinishedReading(id);
        });

        deleteButton.addEventListener('click', () => {
            const modalButton = document.querySelector('#modalButton');
            modalButton.style.display = 'block';

            const validasi = document.querySelector('.validation');
            validasi.addEventListener('click', () => {
                deleteBook(id);
                modalButton.style.display = 'none';
            });

            const cancelDelete = document.querySelector('.cancel');
            cancelDelete.addEventListener('click',() => {
                modalButton.style.display = 'none';
            });
        });

        editButton.addEventListener('click', function () {
            showFormEdit(id);
        });

        containerList.append(tagDiv);
    }
    return containerList;
}

const showFormEdit = (id) => {
    for (const item of books) {
      if (item.id === id) {
        const addForm = document.querySelector("#record");
        addForm.setAttribute("hidden", true);
  
        const editForm = document.querySelector("#edit");
        editForm.removeAttribute("hidden");
  
        document.querySelector("#idBook").value = item.id;
        document.querySelector("#editTitle").value = item.title;
        document.querySelector("#editAuthor").value = item.author;
        document.querySelector("#editYear").value = item.year;
        document.querySelector("#editIsComplete").checked = item.isComplete;
      }
    }
    location.href = '#edit';
  }

const addToFinishedReading = (id) => {
    const target = findId(id);
    console.log(target);
    if (target == null) {
        return;
    }

    target.isComplete = true;
    document.dispatchEvent(new Event(RENDER_BOOK));

    saveDataBooks();
}

const addToNotFinishedReading = (id)=> {
        const target = findId(id);
        if (target == null) {
            return;
        }
    
        target.isComplete = false;
        document.dispatchEvent(new Event(RENDER_BOOK));
    
        saveDataBooks();
    }

const findId = (id) => {
    for (item of books) {
        if (item.id === id) {
            return item;
        }
    }
    return null;
}

const findIndex = (id) => {
    for (index in books) {
        if (books[index].id === id) {
            return index;
        }
    }
    return -1;
}

const deleteBook = (id) => {
    const bookTarget = findIndex(id);
    if (bookTarget === -1) {
        return;
    }
    books.splice(bookTarget, 1);

    document.dispatchEvent(new Event(RENDER_BOOK));

    saveDataBooks();
}

const editBookDetail = (id) => {
    const targetEdit = findIndex(id);
    if (targetEdit === -1) {
        return;
    }
    for (const item of books) {
        if (item.id === id) {
            console.log('tes')
          item.title = document.querySelector("#editTitle").value;
          item.author = document.querySelector("#editAuthor").value;
          item.year = document.querySelector("#editYear").value;
          item.isComplete = document.querySelector("#editIsComplete").checked;

          document.dispatchEvent(new Event(RENDER_EVENT));
          
          saveData();
        }
      }
    document.dispatchEvent(new Event(RENDER_BOOK));

    saveDataBooks();
}

const buttonSearch = document.querySelector('#searchTitle');
const searchValue = document.querySelector('#searchByTitle');

buttonSearch.addEventListener('click', () => {
    if (localStorage.getItem(STORAGE_KEY) == null) {    
        return alert("There Is No Book Data")
    } else {
        const getByTitle = JSON.parse(localStorage.getItem(STORAGE_KEY)).filter(a => a.title == searchValue.value.trim());
        if (getByTitle.length == 0) {
            alert(`Data Not Found With Keywords: ${searchValue.value}`)
        } else {
            showSearchResult(getByTitle);
        }
    }

    searchValue.value = ''
});

const showSearchResult = (books) => {
    const searchResult = document.querySelector("#searchResult")

    searchResult.innerHTML = ''

    books.forEach(book => {
        let element = `
        <h2 class="text-center text-result">Result</h2>
        <article class="book_list">
            <h3>${book.title}</h3>
            <p>Author : ${book.author}</p>
            <p>${book.year}</p>
            <p>Status : ${book.isComplete ? 'Finished Reading' : 'Not Finished Reading'}</p>
        </article>
        `
        searchResult.innerHTML += element;
    });
}
