document.addEventListener('DOMContentLoaded', function() {
    const formSubmitButton  = document.querySelector('#bookInputForm');
    formSubmitButton.addEventListener('submit', function(e) {
        inputNewBook();
        e.preventDefault();
    });

    if(checkForStorageExist()) {
        const bookKey = localStorage.getItem(bookStorageKey);
        let bookData = JSON.parse(bookKey);
    
        if(bookData !== null) {
            for(let book of bookData) {
                bookDirectory.push(book);
            }
        }
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
});

// book storage key
const bookStorageKey = 'BOOK_STORAGE_KEY';

// memeriksa apakah browser mendukung storage
const checkForStorageExist = function() {
    return typeof(Storage) !== 'undefined';
}

// membuat id unik untuk buku
const createUniqueId = function() {
    return +new Date();
}

// menginput buku baru
const inputNewBook = function() {
    if(checkForStorageExist()) {
        const idBook = createUniqueId();
        const titleBook = document.querySelector('#bookInputTitle').value;
        const authorBook = document.querySelector('#bookInputAuthor').value;
        const yearBook = document.querySelector('#bookInputYear').value;
        let isFinishedReading = document.querySelector('#bookInputIsFinished').checked;
    
        if(isFinishedReading === true) {
            isFinishedReading = true;
        }else {
            isFinishedReading = false;
        }
    
        const bookObject = createBookObject(idBook, titleBook, authorBook, yearBook, isFinishedReading);
        bookDirectory.push(bookObject);
    
        const saveBookToStorage = JSON.stringify(bookDirectory);
        localStorage.setItem(bookStorageKey, saveBookToStorage);
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
}

// membuat objek buku
const createBookObject = function(idBook, titleBook, authorBook, yearBook, isFinishedReading) {
    return {
        idBook,
        titleBook,
        authorBook,
        yearBook,
        isFinishedReading
    }
}

// array data buku
const bookDirectory = [];

// membuat buku baru
const createNewBook = function(bookObject) {
    const bookTitleElement = document.createElement('h3');
    const bookAuthorElement = document.createElement('p');
    const bookYearElement = document.createElement('p');
    const buttonsWrapper = document.createElement('div');
    const bookArticleWrapper = document.createElement('article');

    bookTitleElement.innerHTML = bookObject.titleBook;
    bookAuthorElement.innerHTML = 'Penulis : ' + bookObject.authorBook;
    bookYearElement.innerHTML = 'Tahun : ' + bookObject.yearBook;

    buttonsWrapper.classList.add('buttons');
    bookArticleWrapper.classList.add('book-item');

    if(bookObject.isFinishedReading) {
        const unfinishedButton = document.createElement('button');
        const deleteButton = document.createElement('button');

        unfinishedButton.classList.add('finished');
        unfinishedButton.innerHTML = 'Belum selesai dibaca';
        deleteButton.classList.add('delete');
        deleteButton.innerHTML = 'Hapus buku';

        unfinishedButton.addEventListener('click', function() {
            addBookToUnfinishedReadingList(bookObject.idBook);
        });

        deleteButton.addEventListener('click', function() {
            showPopUpDialog(bookObject.idBook);
        });

        buttonsWrapper.append(unfinishedButton, deleteButton);
    }else {
        const finishedButton = document.createElement('button');
        const deleteButton = document.createElement('button');

        finishedButton.classList.add('finished');
        finishedButton.innerHTML = 'Selesai dibaca';
        deleteButton.classList.add('delete');
        deleteButton.innerHTML = 'Hapus buku';

        finishedButton.addEventListener('click', function() {
            addBookToFinishedReadingList(bookObject.idBook);
        });

        deleteButton.addEventListener('click', function() {
            showPopUpDialog(bookObject.idBook);
        });

        buttonsWrapper.append(finishedButton, deleteButton);
    }

    bookArticleWrapper.append(bookTitleElement, bookAuthorElement, bookYearElement, buttonsWrapper);
    bookArticleWrapper.setAttribute('id', bookObject.idBook);

    return bookArticleWrapper;
}

// custom event untuk merender buku
const RENDER_EVENT = 'book-event';
document.addEventListener(RENDER_EVENT, function() {
    console.log(bookDirectory);
});

// merender buku untuk ditampilkan di halaman web
document.addEventListener(RENDER_EVENT, function() {
    let unfinishedBook = document.querySelector('#bookUnfinishedReadingList');
    let finishedBook = document.querySelector('#bookFinishedReadingList');

    unfinishedBook.innerHTML = '';
    finishedBook.innerHTML = '';
    
    for(let book of bookDirectory) {
        let makeBook = createNewBook(book);

        if(!book.isFinishedReading) {
            unfinishedBook.append(makeBook);
        }else {
            finishedBook.append(makeBook);
        }
    }
});

// mencari buku
const searchBook = function(idOfBook) {
    for(let book of bookDirectory) {
        if(book.idBook === idOfBook) {
            return book;
        }
    }
}

// mencari index buku
const searchBookIndex = function(idOfBook) {
    for(let i in bookDirectory) {
        if(bookDirectory[i].idBook === idOfBook) {
            return i;
        }
    }
    return -1;
}

// menambahkan buku ke selesai dibaca
const addBookToFinishedReadingList = function(idOfBook) {
    if(checkForStorageExist()) {
        const bookTarget = searchBook(idOfBook);

        if(bookTarget == null) return;
    
        bookTarget.isFinishedReading = true;

        const saveBookToStorage = JSON.stringify(bookDirectory);
        localStorage.setItem(bookStorageKey, saveBookToStorage);
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
}

// menambahkan buku ke belum selesai dibaca
const addBookToUnfinishedReadingList = function(idOfBook) {
    if(checkForStorageExist()) {
        const bookTarget = searchBook(idOfBook);

        if(bookTarget == null) return;
    
        bookTarget.isFinishedReading = false;
    
        const saveBookToStorage = JSON.stringify(bookDirectory);
        localStorage.setItem(bookStorageKey, saveBookToStorage);
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
}

// menghapus buku
const deleteBook = function(idOfBook) {
    if(checkForStorageExist()) {
        const bookTarget = searchBookIndex(idOfBook);

        if(bookTarget == -1) return;
    
        bookDirectory.splice(bookTarget, 1);

        const saveBookToStorage = JSON.stringify(bookDirectory);
        localStorage.setItem(bookStorageKey, saveBookToStorage);
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
}

// popup menghapus buku
const showPopUpDialog = function(idOfBook) {
    const popupDialog = document.querySelector('#popupDialog');
    popupDialog.classList.add('show');

    const buttonYes = document.querySelector('.yes');
    const buttonNo = document.querySelector('.no');

    buttonYes.addEventListener('click', function() {
        deleteBook(idOfBook);
        popupDialog.classList.remove('show');
    });

    buttonNo.addEventListener('click', function() {
        popupDialog.classList.remove('show');
    });
}

// mencari buku dari search box
const buttonSearchBook = document.querySelector('#bookSearchBox');
buttonSearchBook.addEventListener('submit',function(e) {
    let bookTitleInput = document.querySelector('#bookSearchTitle').value;
    let bookHasFound = findBook(bookTitleInput);

    let unfinishedBook = document.querySelector('#bookUnfinishedReadingList');
    let finishedBook = document.querySelector('#bookFinishedReadingList');

    unfinishedBook.innerHTML = '';
    finishedBook.innerHTML = '';
    
    if(bookHasFound == null) {
        unfinishedBook.innerHTML = '';
        finishedBook.innerHTML = '';
    }else {
        for(let book of bookHasFound) {
            let makeBook = createNewBook(book);
            if(!book.isFinishedReading) {
                unfinishedBook.append(makeBook);
            }else {
                finishedBook.append(makeBook);
            }
        }
    }
    
    console.log(bookHasFound);
    e.preventDefault();
});

// mencari buku dari storage
const findBook = function(titleOfBook) {
    if(checkForStorageExist()) {
        const bookKey = localStorage.getItem(bookStorageKey);
        let bookData = JSON.parse(bookKey);
        const newBook = [];

        for(let book of bookData) {
            if(book.titleBook.toLowerCase().includes(titleOfBook)) {
                newBook.push(book);
            }
        }

        return newBook;
    }
}

