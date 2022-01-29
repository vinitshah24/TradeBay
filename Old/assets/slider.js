function slideShow() {
    var counter;
    var timeoutSec = 5000;
    var slides = document.getElementsByClassName("slide");
    var slidePointer = document.getElementsByClassName("slide-pointer");
    for (counter = 0; counter < slides.length; counter++) {
        slides[counter].style.display = "none";
    }
    slideIdx++;
    if (slideIdx > slides.length) { slideIdx = 1 }
    for (counter = 0; counter < slidePointer.length; counter++) {
        slidePointer[counter].className = slidePointer[counter].className.replace(" active", "");
    }
    slides[slideIdx - 1].style.display = "block";
    slidePointer[slideIdx - 1].className += " active";
    setTimeout(slideShow, timeoutSec);
}

var slideIdx = 0;
slideShow();