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

    if (checkStorage()) {
        loadDataBooksFromStorage();
    }

    recordBook.addEventListener('click', (e) => {
        e.preventDefault();
        addBook();
    });
});

const saveBook = () => {
    if (checkStorage()) {
        const parse = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parse);
        document.dispatchEvent(new Event(SAVED_BOOK));
    }
}

document.addEventListener(SAVED_BOOK, () => {
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

const saveDataBooks = () => {
    if (checkStorage()) {
        const parse = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parse);
        document.dispatchEvent(new Event(SAVED_BOOK));
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

document.addEventListener(RENDER_BOOK, () => {
    const notFinishedYet = document.querySelector('#notFinishedYetList');
    notFinishedYet.innerHTML = '';

    const finished = document.querySelector('#finishedList');
    finished.innerHTML = '';

    for (item of books) {
        const bookElement = createBookElement(item);

        if (item.isComplete) {
            finished.append(bookElement);
        } else {
            notFinishedYet.append(bookElement);
        }
    }
});

const createBookElement = (booksObject) => {
    const { id, title, author, year, isComplete } = booksObject;

    const bookTitle = document.createElement('h3');
    bookTitle.innerHTML = title;

    const bookAuthor = document.createElement('p');
    bookAuthor.innerHTML = author;

    const bookYear = document.createElement('p');
    bookYear.innerHTML = year;

    const containerList = document.createElement('article');
    containerList.classList.add('book_list');
    containerList.append(bookTitle, bookAuthor, bookYear);
    containerList.setAttribute('id', `id-${id}`);

    if (isComplete) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo');
        undoButton.innerHTML = 'Not Finished Yet';

        const removeButton = document.createElement('button');
        removeButton.classList.add('delete');
        removeButton.innerHTML = 'Delete';

        const editButton = document.createElement('button');
        editButton.classList.add('edit');
        editButton.innerHTML = 'Edit';

        const tagDiv = document.createElement('div');
        tagDiv.classList.add('action');
        tagDiv.append(undoButton, removeButton, editButton);

        undoButton.addEventListener('click', () => {
            addToNorFinishedYet(id);
        })

        removeButton.addEventListener('click', () => {
            const modal = document.querySelector('#modal');
            modal.style.display = 'block';

            const validate = document.querySelector('.validate');

            validate.addEventListener('click', () => {
                removeBook(id);
                modal.style.display = 'none';
            })

            const cancelDelete = document.querySelector('.cancel');
            cancelDelete.addEventListener('click', () => {
                modal.style.display = 'none';
            })
        });

        editButton.addEventListener('click', () => {
            const editBook = document.querySelector('#editBook');
            editBook.style.display = 'block';

            const bookSubmit = document.querySelector('#book_submit');

            bookSubmit.addEventListener('click', (e) => {
                e.preventDefault();
                editBookDetail(id);
                editBook.style.display = 'none';
            });
        });

        containerList.append(tagDiv);
    } else {}
}