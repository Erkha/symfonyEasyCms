import '../css/app.scss';

const $ = require('jquery');

require('bootstrap');

require('./custom.js');
require('./contact-form-script.js');
require('./form-validator.min.js');
require('./images-loded.min.js');
require('./isotope.min.js');
require('./main.js');
require('./owl.carousel.min.js');
require('./popper.min.js');
require('./responsiveslides.min.js');
require('./slider-index.js');
require('./smoothscroll.js');
require('./TweenMax.min.js');


$(document).ready(function() {
    $('[data-toggle="popover"]').popover();
});
