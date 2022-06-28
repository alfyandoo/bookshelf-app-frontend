// Menu Mobile
const menu = document.querySelector('#menu');
const hero = document.querySelector('.hero');
const main = document.querySelector('main');
const drawer = document.querySelector('#drawer');

menu.addEventListener('click', function (event) {
    drawer.classList.toggle('open');
    event.stopPropagation();
});

hero.addEventListener('click', function (event) {
    drawer.classList.remove('open');
    event.stopPropagation();
});

main.addEventListener('click', function (event) {
    drawer.classList.remove('open');
    event.stopPropagation();
});