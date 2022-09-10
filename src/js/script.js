$(document).ready(function(){
    $("a").on('click', function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800, function(){
                window.location.hash = hash;
            });
        }
    });
});

const hamburger = document.querySelector('#hamburger');
const landingMenu = document.querySelector('#landing-menu');
const menu = document.querySelector('#landing');

hamburger.addEventListener('click', function(){
    if(landingMenu.style.display === 'none'){
        landingMenu.style.display = 'block';
    }else{
        landingMenu.style.display = 'none';
    }
});


window.onscroll = function(){
    const header = document.querySelector('header');
    const fixedNav = header.offsetTop;

    if(window.pageYOffset > fixedNav){
        header.classList.add('navbar-fixed');
    }else{
            header.classList.remove('navbar-fixed');
    }
}