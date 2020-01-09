let productImagesArr = [];
let currentIndex = 0;
let left = 0;
let startingClientX = 0;
let stopTouch = false;
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

function allowDrop(e) {
    e.preventDefault();
    e.stopPropagation();
}
function drop(e) {
    e.preventDefault();
    e.stopPropagation();
    let files = e.dataTransfer.files;
    for (let key in files) {
        let file = files[key];
        if (file.type && file.type.indexOf('image') !== -1) {
            toBase64(file).then(base64 => {
                if (productImagesArr.indexOf(base64 === -1)) {
                    productImagesArr.push(base64)
                }
            })
        }
    }
    setTimeout(function () {
        $('.slider_small_images').empty();
        $('#title').text('Can drop again!!!');
        productImagesArr.forEach(function (el, i) {
            $('.slider_small_images').append(`
                     <div class="small_item sm1 ${i === currentIndex ? 'active' : ''}" data-index="${i}">
                        <img class="carousel-image-small" alt="featureCarousel-1" src="${productImagesArr[i]}">
                    </div>
                `)
        });
        $('.customSlider').empty().append(`<img src=${productImagesArr[currentIndex]} class='bigImg'>`);
    }, 1000)

}
let closeModal = function (e) {
    if (e.target.id == "modalContainer" || e.target.id == "modalClose") {
        $('#modalContainer').removeClass("show");
        $(document.body).removeClass('over');
    }
};


function changeImageDir(dir) {
    $('.small_item[data-index=' + currentIndex + ']').removeClass('active');
    if (dir > 0 && currentIndex >= productImagesArr.length - 1) {
        currentIndex = -1;
        $('.slider_small_images').css('left', 0)
    }
    if (dir < 0 && currentIndex <= 0) {
        currentIndex = productImagesArr.length;
        let goTo = $('#modalContainer .slider_small_images').children().eq(0).outerWidth() * (productImagesArr.length) - $('#modalContainer .slider_small_images').width();
        $('#modalContainer .slider_small_images').css('left', -goTo)
    }
    currentIndex += dir;
    $('.small_item[data-index=' + currentIndex + ']').addClass('active');

    correctActivePosition($('#modalContainer'));

    $('.customSlider').empty().append(`<img src=${productImagesArr[currentIndex]} class='bigImg'>`);
    $('#modalImage').replaceWith(`
                    <img id="modalImage" src="${productImagesArr[currentIndex]}">
                `);
    if ($('#modalImage').prop('tagName') === 'IMG') {
        $('#modalImage').css(
            (window.innerHeight <= window.innerWidth) ? {'height': '70%', 'width': 'auto'} : {
                'width': '80%',
                'height': 'auto'
            }
        );
    } else {
        $('#modalImage').css(
            (window.innerHeight <= window.innerWidth) ? {'height': '70%', 'width': '85%'} : {
                'height': '40%',
                'width': '74%',
            }
        );
    }
}
$(document).on('click', '.customSlider', function () {
    $('#modalImage').attr('src', productImagesArr[currentIndex])
        .height(window.innerHeight <= window.innerWidth && '80%')
        .width(window.innerHeight > window.innerWidth && '80%');
    $('#modalContainer').addClass('show');
    $(document.body).addClass('over');
    correctActivePosition($('#modalContainer'), 'clicked');
});
$(window).on('resize', function () {
    if ($('#modalImage').prop('tagName') === 'IMG') {
        $('#modalImage').css(
            (window.innerHeight <= window.innerWidth) ? {'height': '70%', 'width': 'auto'} : {
                'width': '80%',
                'height': 'auto'
            }
        );
    } else {
        $('#modalImage').css(
            (window.innerHeight <= window.innerWidth) ? {'height': '70%', 'width': '85%'} : {
                'height': '40%',
                'width': '74%',
            }
        );
    }


});
$(document).on('click', '.small_item', function () {
    $('.small_item[data-index=' + currentIndex + ']').removeClass('active');
    currentIndex = $(this).data('index');
    $('.small_item[data-index=' + currentIndex + ']').addClass('active');
    $('.customSlider').empty().append(`<img src=${productImagesArr[currentIndex]} class='bigImg'>`);
    $('#modalImage').replaceWith(`
                    <img id="modalImage" src="${productImagesArr[currentIndex]}">
                `);
    if ($('#modalImage').prop('tagName') === 'IMG') {
        $('#modalImage').css(
            (window.innerHeight <= window.innerWidth) ? {'height': '70%', 'width': 'auto'} : {
                'width': '80%',
                'height': 'auto'
            }
        );
    } else {
        $('#modalImage').css(
            (window.innerHeight <= window.innerWidth) ? {'height': '70%', 'width': '85%'} : {
                'height': '40%',
                'width': '74%',
            }
        );
    }

    left = $(this).parents('.draggable')[0].offsetLeft;
    correctActivePosition($(this).parent().parent().parent(), 'clicked')
});
$('#modalClose').click(closeModal);
$(document).click(closeModal);

// slide
$(".draggable").draggable({
    axis: "x",
    scroll: false,
    stop: myDragEnd,
    drag: myDrag,
    start: function (e) {
        if (parseFloat($(this).find('.small_item').outerWidth()) * productImagesArr.length < $(this).outerWidth()) {
            e.preventDefault();
        }
    }
});

// mobile swipe
$('.draggable').on('touchstart', function (e) {
    if (parseFloat($(this).find('.small_item').outerWidth()) * productImagesArr.length < $(this).outerWidth()) {
        stopTouch = true;
        left = 0
    } else {
        left = $(this)[0].offsetLeft;
        startingClientX = e.originalEvent.touches[0].clientX;
    }

});
$('.draggable').on('touchmove', myDrag);
$('.draggable').on('touchend', myDragEnd);

// mobile swipe END
function myDrag(e) {
    if (e.originalEvent.touches) {
        let newClientX = e.originalEvent.touches[0].clientX;
        let clientDir = newClientX - startingClientX;
        let goTo = 0;
        if (!stopTouch) {
            goTo = left + clientDir
        }
        $(this).css({
            'position': 'relative',
            'left': goTo + 'px'
        });
    }
    ;
    if (parseFloat($(this).css('left')) > 0 ||
        parseFloat($(this).find('.small_item').outerWidth()) * productImagesArr.length < $(this).outerWidth() - parseFloat($(this).css('left'))
    ) {
        e.preventDefault();
    }
};
function myDragEnd(target) {
    if (!target.selector) {
        target = this
    }
    if (stopTouch) {
        left = 0;
        $(target).css({'transition': 'all .3s ease-in-out', 'left': left});
        setTimeout(() => {
            $(target).css({'transition': 'auto'});
        }, 300);
        stopTouch = false;
        return
    }
    left = $(target)[0].offsetLeft;
    let smallImgsContainer = parseFloat($(target).children().eq(0).outerWidth()) * productImagesArr.length;
    let right = left - parseFloat($(target).parent().width()) + smallImgsContainer;
    if (left > 0) {
        left = 0;
        $(target).css({'transition': 'all .3s ease-in-out', 'left': left});
        setTimeout(() => {
            $(target).css({'transition': 'auto'});
        }, 300)
    }
    if (right < 0) {
        left = parseFloat($(target).parent().width()) - smallImgsContainer;
        $(target).css({
            'transition': 'all .3s ease-in-out',
            // 'left': parseFloat($(target).parent().width()) - smallImgsContainer
            'left': left
        });
        setTimeout(() => {
            $(target).css({'transition': 'auto'});
        }, 300)
    }
    $('.draggable').width('100%');
};
function correctActivePosition(parent, clicked) {
    if (parseFloat($(parent).find('.small_item').outerWidth()) * productImagesArr.length > $(parent).outerWidth()) {
        let lastElLeft = $(parent).parents('.modalContainer').length ?
            $(parent).find('.small_item').last().offset().left :
            $(parent).find('.small_item').last()[0].offsetLeft;
        let activeLeft = $(parent).parents('.modalContainer').length ?
            $(parent).find('.small_item.active').offset().left :
            $(parent).find('.small_item.active')[0].offsetLeft;
        let containerLeft = parseFloat($(parent).find('.slider_small_images').css('left'));
        let mustBe = $(parent).find('.slider_small_images').outerWidth() / 2 - $(parent).find('.small_item.active').outerWidth() / 2;
        let stopItRight = (lastElLeft - activeLeft) >= mustBe;
        let stopItLeft = (containerLeft - activeLeft + mustBe) < 0;
        let smallImgsContainer = parseFloat($(parent).find('.small_item').outerWidth()) * productImagesArr.length;
        if (stopItLeft && stopItRight) {
            let goTo = mustBe - activeLeft > 0 ? 0 : mustBe - activeLeft;
            $(parent).find('.slider_small_images').css({
                'transition': 'all .2s ease-in-out',
                'left': goTo + 'px'
            });
        } else if (stopItLeft) {
            $(parent).find('.slider_small_images').css({
                'transition': 'all .2s ease-in-out',
                'left': parseFloat($(parent).width()) - smallImgsContainer
            })
        } else {
            $(parent).find('.slider_small_images').css({
                'transition': 'all .2s ease-in-out',
                'left': 0
            });
        }
        setTimeout(() => {
            $(parent).find('.slider_small_images').css({'transition': 'auto'});
        }, 200)
    }
}
