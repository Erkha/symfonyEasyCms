import '../css/app.scss';

const $ = require('jquery');

require('bootstrap');


/*
CUSTOM.JS
 */
jQuery(document).ready(function () {


    $('#carouselHacked').carousel();

    //this code is for the gmap
    var map = new GMaps({
        el: '#map',
        lat: -12.043333,
        lng: -77.028333
    });


    //this code is for smooth scroll and nav selector
    $(document).ready(function () {
        $(document).on("scroll", onScroll);

        //smoothscroll
        $('a[href^="#"]').on('click', function (e) {
            e.preventDefault();
            $(document).off("scroll");

            $('a').each(function () {
                $(this).removeClass('active');
            })
            $(this).addClass('active');

            var target = this.hash,
                menu = target;
            $target = $(target);
            $('html, body').stop().animate({
                'scrollTop': $target.offset().top + 2
            }, 500, 'swing', function () {
                window.location.hash = target;
                $(document).on("scroll", onScroll);
            });
        });
    });

    function onScroll(event) {
        var scrollPos = $(document).scrollTop();
        $('.navbar-default .navbar-nav>li>a').each(function () {
            var currLink = $(this);
            var refElement = $(currLink.attr("href"));
            if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
                $('.navbar-default .navbar-nav>li>a').removeClass("active");
                currLink.addClass("active");
            } else {
                currLink.removeClass("active");
            }
        });
    }


    //this code is for animation nav
    jQuery(window).scroll(function () {
        var windowScrollPosTop = jQuery(window).scrollTop();

        if (windowScrollPosTop >= 150) {
            jQuery(".header").css({
                "background": "#B193DD",
            });
            jQuery(".top-header img.logo").css({
                "margin-top": "-40px",
                "margin-bottom": "0"
            });
            jQuery(".navbar-default").css({
                "margin-top": "-15px",
            });
        } else {
            jQuery(".header").css({
                "background": "transparent",
            });
            jQuery(".top-header img.logo").css({
                "margin-top": "-15px",
                "margin-bottom": "25px"
            });
            jQuery(".navbar-default").css({
                "margin-top": "12px",
                "margin-bottom": "0"
            });
        }
    });

});

//GMAPS.JS
(function(root, factory) {
    if(typeof exports === 'object') {
        module.exports = factory();
    }
    else if(typeof define === 'function' && define.amd) {
        define('GMaps', [], factory);
    }

    root.GMaps = factory();

}(this, function() {

    /*!
     * GMaps.js v0.4.16
     * http://hpneo.github.com/gmaps/
     *
     * Copyright 2014, Gustavo Leon
     * Released under the MIT License.
     */

    if (!(typeof window.google === 'object' && window.google.maps)) {
        throw 'Google Maps API is required. Please register the following JavaScript library http://maps.google.com/maps/api/js?sensor=true.'
    }

    var extend_object = function(obj, new_obj) {
        var name;

        if (obj === new_obj) {
            return obj;
        }

        for (name in new_obj) {
            obj[name] = new_obj[name];
        }

        return obj;
    };

    var replace_object = function(obj, replace) {
        var name;

        if (obj === replace) {
            return obj;
        }

        for (name in replace) {
            if (obj[name] != undefined) {
                obj[name] = replace[name];
            }
        }

        return obj;
    };

    var array_map = function(array, callback) {
        var original_callback_params = Array.prototype.slice.call(arguments, 2),
            array_return = [],
            array_length = array.length,
            i;

        if (Array.prototype.map && array.map === Array.prototype.map) {
            array_return = Array.prototype.map.call(array, function(item) {
                callback_params = original_callback_params;
                callback_params.splice(0, 0, item);

                return callback.apply(this, callback_params);
            });
        }
        else {
            for (i = 0; i < array_length; i++) {
                callback_params = original_callback_params;
                callback_params.splice(0, 0, array[i]);
                array_return.push(callback.apply(this, callback_params));
            }
        }

        return array_return;
    };

    var array_flat = function(array) {
        var new_array = [],
            i;

        for (i = 0; i < array.length; i++) {
            new_array = new_array.concat(array[i]);
        }

        return new_array;
    };

    var coordsToLatLngs = function(coords, useGeoJSON) {
        var first_coord = coords[0],
            second_coord = coords[1];

        if (useGeoJSON) {
            first_coord = coords[1];
            second_coord = coords[0];
        }

        return new google.maps.LatLng(first_coord, second_coord);
    };

    var arrayToLatLng = function(coords, useGeoJSON) {
        var i;

        for (i = 0; i < coords.length; i++) {
            if (!(coords[i] instanceof google.maps.LatLng)) {
                if (coords[i].length > 0 && typeof(coords[i][0]) == "object") {
                    coords[i] = arrayToLatLng(coords[i], useGeoJSON);
                }
                else {
                    coords[i] = coordsToLatLngs(coords[i], useGeoJSON);
                }
            }
        }

        return coords;
    };

    var getElementById = function(id, context) {
        var element,
            id = id.replace('#', '');

        if ('jQuery' in this && context) {
            element = $("#" + id, context)[0];
        } else {
            element = document.getElementById(id);
        };

        return element;
    };

    var findAbsolutePosition = function(obj)  {
        var curleft = 0,
            curtop = 0;

        if (obj.offsetParent) {
            do {
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
            } while (obj = obj.offsetParent);
        }

        return [curleft, curtop];
    };

    var GMaps = (function(global) {
        "use strict";

        var doc = document;

        var GMaps = function(options) {
            if (!this) return new GMaps(options);

            options.zoom = options.zoom || 15;
            options.mapType = options.mapType || 'roadmap';

            var self = this,
                i,
                events_that_hide_context_menu = ['bounds_changed', 'center_changed', 'click', 'dblclick', 'drag', 'dragend', 'dragstart', 'idle', 'maptypeid_changed', 'projection_changed', 'resize', 'tilesloaded', 'zoom_changed'],
                events_that_doesnt_hide_context_menu = ['mousemove', 'mouseout', 'mouseover'],
                options_to_be_deleted = ['el', 'lat', 'lng', 'mapType', 'width', 'height', 'markerClusterer', 'enableNewStyle'],
                container_id = options.el || options.div,
                markerClustererFunction = options.markerClusterer,
                mapType = google.maps.MapTypeId[options.mapType.toUpperCase()],
                map_center = new google.maps.LatLng(options.lat, options.lng),
                zoomControl = options.zoomControl || false,
                zoomControlOpt = options.zoomControlOpt || {
                    style: 'DEFAULT',
                    position: 'TOP_LEFT'
                },
                zoomControlStyle = zoomControlOpt.style || 'DEFAULT',
                zoomControlPosition = zoomControlOpt.position || 'TOP_LEFT',
                panControl = options.panControl || false,
                mapTypeControl = options.mapTypeControl || false,
                scaleControl = options.scaleControl || true,
                streetViewControl = options.streetViewControl || false,
                overviewMapControl = overviewMapControl || true,
                map_options = {},
                map_base_options = {
                    zoom: this.zoom,
                    center: map_center,
                    mapTypeId: mapType
                },
                map_controls_options = {
                    panControl: panControl,
                    zoomControl: zoomControl,
                    zoomControlOptions: {
                        style: google.maps.ZoomControlStyle[zoomControlStyle],
                        position: google.maps.ControlPosition[zoomControlPosition]
                    },
                    mapTypeControl: mapTypeControl,
                    scaleControl: scaleControl,
                    streetViewControl: streetViewControl,
                    overviewMapControl: overviewMapControl
                };

            if (typeof(options.el) === 'string' || typeof(options.div) === 'string') {
                this.el = getElementById(container_id, options.context);
            } else {
                this.el = container_id;
            }

            if (typeof(this.el) === 'undefined' || this.el === null) {
                throw 'No element defined.';
            }

            window.context_menu = window.context_menu || {};
            window.context_menu[self.el.id] = {};

            this.controls = [];
            this.overlays = [];
            this.layers = []; // array with kml/georss and fusiontables layers, can be as many
            this.singleLayers = {}; // object with the other layers, only one per layer
            this.markers = [];
            this.polylines = [];
            this.routes = [];
            this.polygons = [];
            this.infoWindow = null;
            this.overlay_el = null;
            this.zoom = options.zoom;
            this.registered_events = {};

            this.el.style.width = options.width || this.el.scrollWidth || this.el.offsetWidth;
            this.el.style.height = options.height || this.el.scrollHeight || this.el.offsetHeight;

            google.maps.visualRefresh = options.enableNewStyle;

            for (i = 0; i < options_to_be_deleted.length; i++) {
                delete options[options_to_be_deleted[i]];
            }

            if(options.disableDefaultUI != true) {
                map_base_options = extend_object(map_base_options, map_controls_options);
            }

            map_options = extend_object(map_base_options, options);

            for (i = 0; i < events_that_hide_context_menu.length; i++) {
                delete map_options[events_that_hide_context_menu[i]];
            }

            for (i = 0; i < events_that_doesnt_hide_context_menu.length; i++) {
                delete map_options[events_that_doesnt_hide_context_menu[i]];
            }

            this.map = new google.maps.Map(this.el, map_options);

            if (markerClustererFunction) {
                this.markerClusterer = markerClustererFunction.apply(this, [this.map]);
            }

            var buildContextMenuHTML = function(control, e) {
                var html = '',
                    options = window.context_menu[self.el.id][control];

                for (var i in options){
                    if (options.hasOwnProperty(i)) {
                        var option = options[i];

                        html += '<li><a id="' + control + '_' + i + '" href="#">' + option.title + '</a></li>';
                    }
                }

                if (!getElementById('gmaps_context_menu')) return;

                var context_menu_element = getElementById('gmaps_context_menu');

                context_menu_element.innerHTML = html;

                var context_menu_items = context_menu_element.getElementsByTagName('a'),
                    context_menu_items_count = context_menu_items.length,
                    i;

                for (i = 0; i < context_menu_items_count; i++) {
                    var context_menu_item = context_menu_items[i];

                    var assign_menu_item_action = function(ev){
                        ev.preventDefault();

                        options[this.id.replace(control + '_', '')].action.apply(self, [e]);
                        self.hideContextMenu();
                    };

                    google.maps.event.clearListeners(context_menu_item, 'click');
                    google.maps.event.addDomListenerOnce(context_menu_item, 'click', assign_menu_item_action, false);
                }

                var position = findAbsolutePosition.apply(this, [self.el]),
                    left = position[0] + e.pixel.x - 15,
                    top = position[1] + e.pixel.y- 15;

                context_menu_element.style.left = left + "px";
                context_menu_element.style.top = top + "px";

                context_menu_element.style.display = 'block';
            };

            this.buildContextMenu = function(control, e) {
                if (control === 'marker') {
                    e.pixel = {};

                    var overlay = new google.maps.OverlayView();
                    overlay.setMap(self.map);

                    overlay.draw = function() {
                        var projection = overlay.getProjection(),
                            position = e.marker.getPosition();

                        e.pixel = projection.fromLatLngToContainerPixel(position);

                        buildContextMenuHTML(control, e);
                    };
                }
                else {
                    buildContextMenuHTML(control, e);
                }
            };

            this.setContextMenu = function(options) {
                window.context_menu[self.el.id][options.control] = {};

                var i,
                    ul = doc.createElement('ul');

                for (i in options.options) {
                    if (options.options.hasOwnProperty(i)) {
                        var option = options.options[i];

                        window.context_menu[self.el.id][options.control][option.name] = {
                            title: option.title,
                            action: option.action
                        };
                    }
                }

                ul.id = 'gmaps_context_menu';
                ul.style.display = 'none';
                ul.style.position = 'absolute';
                ul.style.minWidth = '100px';
                ul.style.background = 'white';
                ul.style.listStyle = 'none';
                ul.style.padding = '8px';
                ul.style.boxShadow = '2px 2px 6px #ccc';

                doc.body.appendChild(ul);

                var context_menu_element = getElementById('gmaps_context_menu')

                google.maps.event.addDomListener(context_menu_element, 'mouseout', function(ev) {
                    if (!ev.relatedTarget || !this.contains(ev.relatedTarget)) {
                        window.setTimeout(function(){
                            context_menu_element.style.display = 'none';
                        }, 400);
                    }
                }, false);
            };

            this.hideContextMenu = function() {
                var context_menu_element = getElementById('gmaps_context_menu');

                if (context_menu_element) {
                    context_menu_element.style.display = 'none';
                }
            };

            var setupListener = function(object, name) {
                google.maps.event.addListener(object, name, function(e){
                    if (e == undefined) {
                        e = this;
                    }

                    options[name].apply(this, [e]);

                    self.hideContextMenu();
                });
            };

            //google.maps.event.addListener(this.map, 'idle', this.hideContextMenu);
            google.maps.event.addListener(this.map, 'zoom_changed', this.hideContextMenu);

            for (var ev = 0; ev < events_that_hide_context_menu.length; ev++) {
                var name = events_that_hide_context_menu[ev];

                if (name in options) {
                    setupListener(this.map, name);
                }
            }

            for (var ev = 0; ev < events_that_doesnt_hide_context_menu.length; ev++) {
                var name = events_that_doesnt_hide_context_menu[ev];

                if (name in options) {
                    setupListener(this.map, name);
                }
            }

            google.maps.event.addListener(this.map, 'rightclick', function(e) {
                if (options.rightclick) {
                    options.rightclick.apply(this, [e]);
                }

                if(window.context_menu[self.el.id]['map'] != undefined) {
                    self.buildContextMenu('map', e);
                }
            });

            this.refresh = function() {
                google.maps.event.trigger(this.map, 'resize');
            };

            this.fitZoom = function() {
                var latLngs = [],
                    markers_length = this.markers.length,
                    i;

                for (i = 0; i < markers_length; i++) {
                    if(typeof(this.markers[i].visible) === 'boolean' && this.markers[i].visible) {
                        latLngs.push(this.markers[i].getPosition());
                    }
                }

                this.fitLatLngBounds(latLngs);
            };

            this.fitLatLngBounds = function(latLngs) {
                var total = latLngs.length;
                var bounds = new google.maps.LatLngBounds();

                for(var i=0; i < total; i++) {
                    bounds.extend(latLngs[i]);
                }

                this.map.fitBounds(bounds);
            };

            this.setCenter = function(lat, lng, callback) {
                this.map.panTo(new google.maps.LatLng(lat, lng));

                if (callback) {
                    callback();
                }
            };

            this.getElement = function() {
                return this.el;
            };

            this.zoomIn = function(value) {
                value = value || 1;

                this.zoom = this.map.getZoom() + value;
                this.map.setZoom(this.zoom);
            };

            this.zoomOut = function(value) {
                value = value || 1;

                this.zoom = this.map.getZoom() - value;
                this.map.setZoom(this.zoom);
            };

            var native_methods = [],
                method;

            for (method in this.map) {
                if (typeof(this.map[method]) == 'function' && !this[method]) {
                    native_methods.push(method);
                }
            }

            for (i=0; i < native_methods.length; i++) {
                (function(gmaps, scope, method_name) {
                    gmaps[method_name] = function(){
                        return scope[method_name].apply(scope, arguments);
                    };
                })(this, this.map, native_methods[i]);
            }
        };

        return GMaps;
    })(this);

    GMaps.prototype.createControl = function(options) {
        var control = document.createElement('div');

        control.style.cursor = 'pointer';

        if (options.disableDefaultStyles !== true) {
            control.style.fontFamily = 'Roboto, Arial, sans-serif';
            control.style.fontSize = '11px';
            control.style.boxShadow = 'rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px';
        }

        for (var option in options.style) {
            control.style[option] = options.style[option];
        }

        if (options.id) {
            control.id = options.id;
        }

        if (options.classes) {
            control.className = options.classes;
        }

        if (options.content) {
            if (typeof options.content === 'string') {
                control.innerHTML = options.content;
            }
            else if (options.content instanceof HTMLElement) {
                control.appendChild(options.content);
            }
        }

        if (options.position) {
            control.position = google.maps.ControlPosition[options.position.toUpperCase()];
        }

        for (var ev in options.events) {
            (function(object, name) {
                google.maps.event.addDomListener(object, name, function(){
                    options.events[name].apply(this, [this]);
                });
            })(control, ev);
        }

        control.index = 1;

        return control;
    };

    GMaps.prototype.addControl = function(options) {
        var control = this.createControl(options);
        this.controls.push(control);
        this.map.controls[control.position].push(control);

        return control;
    };

    GMaps.prototype.removeControl = function(control) {
        var position = null;

        for (var i = 0; i < this.controls.length; i++) {
            if (this.controls[i] == control) {
                position = this.controls[i].position;
                this.controls.splice(i, 1);
            }
        }

        if (position) {
            for (i = 0; i < this.map.controls.length; i++) {
                var controlsForPosition = this.map.controls[control.position]
                if (controlsForPosition.getAt(i) == control) {
                    controlsForPosition.removeAt(i);
                    break;
                }
            }
        }

        return control;
    };

    GMaps.prototype.createMarker = function(options) {
        if (options.lat == undefined && options.lng == undefined && options.position == undefined) {
            throw 'No latitude or longitude defined.';
        }

        var self = this,
            details = options.details,
            fences = options.fences,
            outside = options.outside,
            base_options = {
                position: new google.maps.LatLng(options.lat, options.lng),
                map: null
            },
            marker_options = extend_object(base_options, options);

        delete marker_options.lat;
        delete marker_options.lng;
        delete marker_options.fences;
        delete marker_options.outside;

        var marker = new google.maps.Marker(marker_options);

        marker.fences = fences;

        if (options.infoWindow) {
            marker.infoWindow = new google.maps.InfoWindow(options.infoWindow);

            var info_window_events = ['closeclick', 'content_changed', 'domready', 'position_changed', 'zindex_changed'];

            for (var ev = 0; ev < info_window_events.length; ev++) {
                (function(object, name) {
                    if (options.infoWindow[name]) {
                        google.maps.event.addListener(object, name, function(e){
                            options.infoWindow[name].apply(this, [e]);
                        });
                    }
                })(marker.infoWindow, info_window_events[ev]);
            }
        }

        var marker_events = ['animation_changed', 'clickable_changed', 'cursor_changed', 'draggable_changed', 'flat_changed', 'icon_changed', 'position_changed', 'shadow_changed', 'shape_changed', 'title_changed', 'visible_changed', 'zindex_changed'];

        var marker_events_with_mouse = ['dblclick', 'drag', 'dragend', 'dragstart', 'mousedown', 'mouseout', 'mouseover', 'mouseup'];

        for (var ev = 0; ev < marker_events.length; ev++) {
            (function(object, name) {
                if (options[name]) {
                    google.maps.event.addListener(object, name, function(){
                        options[name].apply(this, [this]);
                    });
                }
            })(marker, marker_events[ev]);
        }

        for (var ev = 0; ev < marker_events_with_mouse.length; ev++) {
            (function(map, object, name) {
                if (options[name]) {
                    google.maps.event.addListener(object, name, function(me){
                        if(!me.pixel){
                            me.pixel = map.getProjection().fromLatLngToPoint(me.latLng)
                        }

                        options[name].apply(this, [me]);
                    });
                }
            })(this.map, marker, marker_events_with_mouse[ev]);
        }

        google.maps.event.addListener(marker, 'click', function() {
            this.details = details;

            if (options.click) {
                options.click.apply(this, [this]);
            }

            if (marker.infoWindow) {
                self.hideInfoWindows();
                marker.infoWindow.open(self.map, marker);
            }
        });

        google.maps.event.addListener(marker, 'rightclick', function(e) {
            e.marker = this;

            if (options.rightclick) {
                options.rightclick.apply(this, [e]);
            }

            if (window.context_menu[self.el.id]['marker'] != undefined) {
                self.buildContextMenu('marker', e);
            }
        });

        if (marker.fences) {
            google.maps.event.addListener(marker, 'dragend', function() {
                self.checkMarkerGeofence(marker, function(m, f) {
                    outside(m, f);
                });
            });
        }

        return marker;
    };

    GMaps.prototype.addMarker = function(options) {
        var marker;
        if(options.hasOwnProperty('gm_accessors_')) {
            // Native google.maps.Marker object
            marker = options;
        }
        else {
            if ((options.hasOwnProperty('lat') && options.hasOwnProperty('lng')) || options.position) {
                marker = this.createMarker(options);
            }
            else {
                throw 'No latitude or longitude defined.';
            }
        }

        marker.setMap(this.map);

        if(this.markerClusterer) {
            this.markerClusterer.addMarker(marker);
        }

        this.markers.push(marker);

        GMaps.fire('marker_added', marker, this);

        return marker;
    };

    GMaps.prototype.addMarkers = function(array) {
        for (var i = 0, marker; marker=array[i]; i++) {
            this.addMarker(marker);
        }

        return this.markers;
    };

    GMaps.prototype.hideInfoWindows = function() {
        for (var i = 0, marker; marker = this.markers[i]; i++){
            if (marker.infoWindow) {
                marker.infoWindow.close();
            }
        }
    };

    GMaps.prototype.removeMarker = function(marker) {
        for (var i = 0; i < this.markers.length; i++) {
            if (this.markers[i] === marker) {
                this.markers[i].setMap(null);
                this.markers.splice(i, 1);

                if(this.markerClusterer) {
                    this.markerClusterer.removeMarker(marker);
                }

                GMaps.fire('marker_removed', marker, this);

                break;
            }
        }

        return marker;
    };

    GMaps.prototype.removeMarkers = function (collection) {
        var new_markers = [];

        if (typeof collection == 'undefined') {
            for (var i = 0; i < this.markers.length; i++) {
                var marker = this.markers[i];
                marker.setMap(null);

                if(this.markerClusterer) {
                    this.markerClusterer.removeMarker(marker);
                }

                GMaps.fire('marker_removed', marker, this);
            }

            this.markers = new_markers;
        }
        else {
            for (var i = 0; i < collection.length; i++) {
                var index = this.markers.indexOf(collection[i]);

                if (index > -1) {
                    var marker = this.markers[index];
                    marker.setMap(null);

                    if(this.markerClusterer) {
                        this.markerClusterer.removeMarker(marker);
                    }

                    GMaps.fire('marker_removed', marker, this);
                }
            }

            for (var i = 0; i < this.markers.length; i++) {
                var marker = this.markers[i];
                if (marker.getMap() != null) {
                    new_markers.push(marker);
                }
            }

            this.markers = new_markers;
        }
    };

    GMaps.prototype.drawOverlay = function(options) {
        var overlay = new google.maps.OverlayView(),
            auto_show = true;

        overlay.setMap(this.map);

        if (options.auto_show != null) {
            auto_show = options.auto_show;
        }

        overlay.onAdd = function() {
            var el = document.createElement('div');

            el.style.borderStyle = "none";
            el.style.borderWidth = "0px";
            el.style.position = "absolute";
            el.style.zIndex = 100;
            el.innerHTML = options.content;

            overlay.el = el;

            if (!options.layer) {
                options.layer = 'overlayLayer';
            }

            var panes = this.getPanes(),
                overlayLayer = panes[options.layer],
                stop_overlay_events = ['contextmenu', 'DOMMouseScroll', 'dblclick', 'mousedown'];

            overlayLayer.appendChild(el);

            for (var ev = 0; ev < stop_overlay_events.length; ev++) {
                (function(object, name) {
                    google.maps.event.addDomListener(object, name, function(e){
                        if (navigator.userAgent.toLowerCase().indexOf('msie') != -1 && document.all) {
                            e.cancelBubble = true;
                            e.returnValue = false;
                        }
                        else {
                            e.stopPropagation();
                        }
                    });
                })(el, stop_overlay_events[ev]);
            }

            if (options.click) {
                panes.overlayMouseTarget.appendChild(overlay.el);
                google.maps.event.addDomListener(overlay.el, 'click', function() {
                    options.click.apply(overlay, [overlay]);
                });
            }

            google.maps.event.trigger(this, 'ready');
        };

        overlay.draw = function() {
            var projection = this.getProjection(),
                pixel = projection.fromLatLngToDivPixel(new google.maps.LatLng(options.lat, options.lng));

            options.horizontalOffset = options.horizontalOffset || 0;
            options.verticalOffset = options.verticalOffset || 0;

            var el = overlay.el,
                content = el.children[0],
                content_height = content.clientHeight,
                content_width = content.clientWidth;

            switch (options.verticalAlign) {
                case 'top':
                    el.style.top = (pixel.y - content_height + options.verticalOffset) + 'px';
                    break;
                default:
                case 'middle':
                    el.style.top = (pixel.y - (content_height / 2) + options.verticalOffset) + 'px';
                    break;
                case 'bottom':
                    el.style.top = (pixel.y + options.verticalOffset) + 'px';
                    break;
            }

            switch (options.horizontalAlign) {
                case 'left':
                    el.style.left = (pixel.x - content_width + options.horizontalOffset) + 'px';
                    break;
                default:
                case 'center':
                    el.style.left = (pixel.x - (content_width / 2) + options.horizontalOffset) + 'px';
                    break;
                case 'right':
                    el.style.left = (pixel.x + options.horizontalOffset) + 'px';
                    break;
            }

            el.style.display = auto_show ? 'block' : 'none';

            if (!auto_show) {
                options.show.apply(this, [el]);
            }
        };

        overlay.onRemove = function() {
            var el = overlay.el;

            if (options.remove) {
                options.remove.apply(this, [el]);
            }
            else {
                overlay.el.parentNode.removeChild(overlay.el);
                overlay.el = null;
            }
        };

        this.overlays.push(overlay);
        return overlay;
    };

    GMaps.prototype.removeOverlay = function(overlay) {
        for (var i = 0; i < this.overlays.length; i++) {
            if (this.overlays[i] === overlay) {
                this.overlays[i].setMap(null);
                this.overlays.splice(i, 1);

                break;
            }
        }
    };

    GMaps.prototype.removeOverlays = function() {
        for (var i = 0, item; item = this.overlays[i]; i++) {
            item.setMap(null);
        }

        this.overlays = [];
    };

    GMaps.prototype.drawPolyline = function(options) {
        var path = [],
            points = options.path;

        if (points.length) {
            if (points[0][0] === undefined) {
                path = points;
            }
            else {
                for (var i=0, latlng; latlng=points[i]; i++) {
                    path.push(new google.maps.LatLng(latlng[0], latlng[1]));
                }
            }
        }

        var polyline_options = {
            map: this.map,
            path: path,
            strokeColor: options.strokeColor,
            strokeOpacity: options.strokeOpacity,
            strokeWeight: options.strokeWeight,
            geodesic: options.geodesic,
            clickable: true,
            editable: false,
            visible: true
        };

        if (options.hasOwnProperty("clickable")) {
            polyline_options.clickable = options.clickable;
        }

        if (options.hasOwnProperty("editable")) {
            polyline_options.editable = options.editable;
        }

        if (options.hasOwnProperty("icons")) {
            polyline_options.icons = options.icons;
        }

        if (options.hasOwnProperty("zIndex")) {
            polyline_options.zIndex = options.zIndex;
        }

        var polyline = new google.maps.Polyline(polyline_options);

        var polyline_events = ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'rightclick'];

        for (var ev = 0; ev < polyline_events.length; ev++) {
            (function(object, name) {
                if (options[name]) {
                    google.maps.event.addListener(object, name, function(e){
                        options[name].apply(this, [e]);
                    });
                }
            })(polyline, polyline_events[ev]);
        }

        this.polylines.push(polyline);

        GMaps.fire('polyline_added', polyline, this);

        return polyline;
    };

    GMaps.prototype.removePolyline = function(polyline) {
        for (var i = 0; i < this.polylines.length; i++) {
            if (this.polylines[i] === polyline) {
                this.polylines[i].setMap(null);
                this.polylines.splice(i, 1);

                GMaps.fire('polyline_removed', polyline, this);

                break;
            }
        }
    };

    GMaps.prototype.removePolylines = function() {
        for (var i = 0, item; item = this.polylines[i]; i++) {
            item.setMap(null);
        }

        this.polylines = [];
    };

    GMaps.prototype.drawCircle = function(options) {
        options =  extend_object({
            map: this.map,
            center: new google.maps.LatLng(options.lat, options.lng)
        }, options);

        delete options.lat;
        delete options.lng;

        var polygon = new google.maps.Circle(options),
            polygon_events = ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'rightclick'];

        for (var ev = 0; ev < polygon_events.length; ev++) {
            (function(object, name) {
                if (options[name]) {
                    google.maps.event.addListener(object, name, function(e){
                        options[name].apply(this, [e]);
                    });
                }
            })(polygon, polygon_events[ev]);
        }

        this.polygons.push(polygon);

        return polygon;
    };

    GMaps.prototype.drawRectangle = function(options) {
        options = extend_object({
            map: this.map
        }, options);

        var latLngBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(options.bounds[0][0], options.bounds[0][1]),
            new google.maps.LatLng(options.bounds[1][0], options.bounds[1][1])
        );

        options.bounds = latLngBounds;

        var polygon = new google.maps.Rectangle(options),
            polygon_events = ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'rightclick'];

        for (var ev = 0; ev < polygon_events.length; ev++) {
            (function(object, name) {
                if (options[name]) {
                    google.maps.event.addListener(object, name, function(e){
                        options[name].apply(this, [e]);
                    });
                }
            })(polygon, polygon_events[ev]);
        }

        this.polygons.push(polygon);

        return polygon;
    };

    GMaps.prototype.drawPolygon = function(options) {
        var useGeoJSON = false;

        if(options.hasOwnProperty("useGeoJSON")) {
            useGeoJSON = options.useGeoJSON;
        }

        delete options.useGeoJSON;

        options = extend_object({
            map: this.map
        }, options);

        if (useGeoJSON == false) {
            options.paths = [options.paths.slice(0)];
        }

        if (options.paths.length > 0) {
            if (options.paths[0].length > 0) {
                options.paths = array_flat(array_map(options.paths, arrayToLatLng, useGeoJSON));
            }
        }

        var polygon = new google.maps.Polygon(options),
            polygon_events = ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'rightclick'];

        for (var ev = 0; ev < polygon_events.length; ev++) {
            (function(object, name) {
                if (options[name]) {
                    google.maps.event.addListener(object, name, function(e){
                        options[name].apply(this, [e]);
                    });
                }
            })(polygon, polygon_events[ev]);
        }

        this.polygons.push(polygon);

        GMaps.fire('polygon_added', polygon, this);

        return polygon;
    };

    GMaps.prototype.removePolygon = function(polygon) {
        for (var i = 0; i < this.polygons.length; i++) {
            if (this.polygons[i] === polygon) {
                this.polygons[i].setMap(null);
                this.polygons.splice(i, 1);

                GMaps.fire('polygon_removed', polygon, this);

                break;
            }
        }
    };

    GMaps.prototype.removePolygons = function() {
        for (var i = 0, item; item = this.polygons[i]; i++) {
            item.setMap(null);
        }

        this.polygons = [];
    };

    GMaps.prototype.getFromFusionTables = function(options) {
        var events = options.events;

        delete options.events;

        var fusion_tables_options = options,
            layer = new google.maps.FusionTablesLayer(fusion_tables_options);

        for (var ev in events) {
            (function(object, name) {
                google.maps.event.addListener(object, name, function(e) {
                    events[name].apply(this, [e]);
                });
            })(layer, ev);
        }

        this.layers.push(layer);

        return layer;
    };

    GMaps.prototype.loadFromFusionTables = function(options) {
        var layer = this.getFromFusionTables(options);
        layer.setMap(this.map);

        return layer;
    };

    GMaps.prototype.getFromKML = function(options) {
        var url = options.url,
            events = options.events;

        delete options.url;
        delete options.events;

        var kml_options = options,
            layer = new google.maps.KmlLayer(url, kml_options);

        for (var ev in events) {
            (function(object, name) {
                google.maps.event.addListener(object, name, function(e) {
                    events[name].apply(this, [e]);
                });
            })(layer, ev);
        }

        this.layers.push(layer);

        return layer;
    };

    GMaps.prototype.loadFromKML = function(options) {
        var layer = this.getFromKML(options);
        layer.setMap(this.map);

        return layer;
    };

    GMaps.prototype.addLayer = function(layerName, options) {
        //var default_layers = ['weather', 'clouds', 'traffic', 'transit', 'bicycling', 'panoramio', 'places'];
        options = options || {};
        var layer;

        switch(layerName) {
            case 'weather': this.singleLayers.weather = layer = new google.maps.weather.WeatherLayer();
                break;
            case 'clouds': this.singleLayers.clouds = layer = new google.maps.weather.CloudLayer();
                break;
            case 'traffic': this.singleLayers.traffic = layer = new google.maps.TrafficLayer();
                break;
            case 'transit': this.singleLayers.transit = layer = new google.maps.TransitLayer();
                break;
            case 'bicycling': this.singleLayers.bicycling = layer = new google.maps.BicyclingLayer();
                break;
            case 'panoramio':
                this.singleLayers.panoramio = layer = new google.maps.panoramio.PanoramioLayer();
                layer.setTag(options.filter);
                delete options.filter;

                //click event
                if (options.click) {
                    google.maps.event.addListener(layer, 'click', function(event) {
                        options.click(event);
                        delete options.click;
                    });
                }
                break;
            case 'places':
                this.singleLayers.places = layer = new google.maps.places.PlacesService(this.map);

                //search, nearbySearch, radarSearch callback, Both are the same
                if (options.search || options.nearbySearch || options.radarSearch) {
                    var placeSearchRequest  = {
                        bounds : options.bounds || null,
                        keyword : options.keyword || null,
                        location : options.location || null,
                        name : options.name || null,
                        radius : options.radius || null,
                        rankBy : options.rankBy || null,
                        types : options.types || null
                    };

                    if (options.radarSearch) {
                        layer.radarSearch(placeSearchRequest, options.radarSearch);
                    }

                    if (options.search) {
                        layer.search(placeSearchRequest, options.search);
                    }

                    if (options.nearbySearch) {
                        layer.nearbySearch(placeSearchRequest, options.nearbySearch);
                    }
                }

                //textSearch callback
                if (options.textSearch) {
                    var textSearchRequest  = {
                        bounds : options.bounds || null,
                        location : options.location || null,
                        query : options.query || null,
                        radius : options.radius || null
                    };

                    layer.textSearch(textSearchRequest, options.textSearch);
                }
                break;
        }

        if (layer !== undefined) {
            if (typeof layer.setOptions == 'function') {
                layer.setOptions(options);
            }
            if (typeof layer.setMap == 'function') {
                layer.setMap(this.map);
            }

            return layer;
        }
    };

    GMaps.prototype.removeLayer = function(layer) {
        if (typeof(layer) == "string" && this.singleLayers[layer] !== undefined) {
            this.singleLayers[layer].setMap(null);

            delete this.singleLayers[layer];
        }
        else {
            for (var i = 0; i < this.layers.length; i++) {
                if (this.layers[i] === layer) {
                    this.layers[i].setMap(null);
                    this.layers.splice(i, 1);

                    break;
                }
            }
        }
    };

    var travelMode, unitSystem;

    GMaps.prototype.getRoutes = function(options) {
        switch (options.travelMode) {
            case 'bicycling':
                travelMode = google.maps.TravelMode.BICYCLING;
                break;
            case 'transit':
                travelMode = google.maps.TravelMode.TRANSIT;
                break;
            case 'driving':
                travelMode = google.maps.TravelMode.DRIVING;
                break;
            default:
                travelMode = google.maps.TravelMode.WALKING;
                break;
        }

        if (options.unitSystem === 'imperial') {
            unitSystem = google.maps.UnitSystem.IMPERIAL;
        }
        else {
            unitSystem = google.maps.UnitSystem.METRIC;
        }

        var base_options = {
                avoidHighways: false,
                avoidTolls: false,
                optimizeWaypoints: false,
                waypoints: []
            },
            request_options =  extend_object(base_options, options);

        request_options.origin = /string/.test(typeof options.origin) ? options.origin : new google.maps.LatLng(options.origin[0], options.origin[1]);
        request_options.destination = /string/.test(typeof options.destination) ? options.destination : new google.maps.LatLng(options.destination[0], options.destination[1]);
        request_options.travelMode = travelMode;
        request_options.unitSystem = unitSystem;

        delete request_options.callback;
        delete request_options.error;

        var self = this,
            service = new google.maps.DirectionsService();

        service.route(request_options, function(result, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                for (var r in result.routes) {
                    if (result.routes.hasOwnProperty(r)) {
                        self.routes.push(result.routes[r]);
                    }
                }

                if (options.callback) {
                    options.callback(self.routes);
                }
            }
            else {
                if (options.error) {
                    options.error(result, status);
                }
            }
        });
    };

    GMaps.prototype.removeRoutes = function() {
        this.routes = [];
    };

    GMaps.prototype.getElevations = function(options) {
        options = extend_object({
            locations: [],
            path : false,
            samples : 256
        }, options);

        if (options.locations.length > 0) {
            if (options.locations[0].length > 0) {
                options.locations = array_flat(array_map([options.locations], arrayToLatLng,  false));
            }
        }

        var callback = options.callback;
        delete options.callback;

        var service = new google.maps.ElevationService();

        //location request
        if (!options.path) {
            delete options.path;
            delete options.samples;

            service.getElevationForLocations(options, function(result, status) {
                if (callback && typeof(callback) === "function") {
                    callback(result, status);
                }
            });
            //path request
        } else {
            var pathRequest = {
                path : options.locations,
                samples : options.samples
            };

            service.getElevationAlongPath(pathRequest, function(result, status) {
                if (callback && typeof(callback) === "function") {
                    callback(result, status);
                }
            });
        }
    };

    GMaps.prototype.cleanRoute = GMaps.prototype.removePolylines;

    GMaps.prototype.drawRoute = function(options) {
        var self = this;

        this.getRoutes({
            origin: options.origin,
            destination: options.destination,
            travelMode: options.travelMode,
            waypoints: options.waypoints,
            unitSystem: options.unitSystem,
            error: options.error,
            callback: function(e) {
                if (e.length > 0) {
                    self.drawPolyline({
                        path: e[e.length - 1].overview_path,
                        strokeColor: options.strokeColor,
                        strokeOpacity: options.strokeOpacity,
                        strokeWeight: options.strokeWeight
                    });

                    if (options.callback) {
                        options.callback(e[e.length - 1]);
                    }
                }
            }
        });
    };

    GMaps.prototype.travelRoute = function(options) {
        if (options.origin && options.destination) {
            this.getRoutes({
                origin: options.origin,
                destination: options.destination,
                travelMode: options.travelMode,
                waypoints : options.waypoints,
                unitSystem: options.unitSystem,
                error: options.error,
                callback: function(e) {
                    //start callback
                    if (e.length > 0 && options.start) {
                        options.start(e[e.length - 1]);
                    }

                    //step callback
                    if (e.length > 0 && options.step) {
                        var route = e[e.length - 1];
                        if (route.legs.length > 0) {
                            var steps = route.legs[0].steps;
                            for (var i=0, step; step=steps[i]; i++) {
                                step.step_number = i;
                                options.step(step, (route.legs[0].steps.length - 1));
                            }
                        }
                    }

                    //end callback
                    if (e.length > 0 && options.end) {
                        options.end(e[e.length - 1]);
                    }
                }
            });
        }
        else if (options.route) {
            if (options.route.legs.length > 0) {
                var steps = options.route.legs[0].steps;
                for (var i=0, step; step=steps[i]; i++) {
                    step.step_number = i;
                    options.step(step);
                }
            }
        }
    };

    GMaps.prototype.drawSteppedRoute = function(options) {
        var self = this;

        if (options.origin && options.destination) {
            this.getRoutes({
                origin: options.origin,
                destination: options.destination,
                travelMode: options.travelMode,
                waypoints : options.waypoints,
                error: options.error,
                callback: function(e) {
                    //start callback
                    if (e.length > 0 && options.start) {
                        options.start(e[e.length - 1]);
                    }

                    //step callback
                    if (e.length > 0 && options.step) {
                        var route = e[e.length - 1];
                        if (route.legs.length > 0) {
                            var steps = route.legs[0].steps;
                            for (var i=0, step; step=steps[i]; i++) {
                                step.step_number = i;
                                self.drawPolyline({
                                    path: step.path,
                                    strokeColor: options.strokeColor,
                                    strokeOpacity: options.strokeOpacity,
                                    strokeWeight: options.strokeWeight
                                });
                                options.step(step, (route.legs[0].steps.length - 1));
                            }
                        }
                    }

                    //end callback
                    if (e.length > 0 && options.end) {
                        options.end(e[e.length - 1]);
                    }
                }
            });
        }
        else if (options.route) {
            if (options.route.legs.length > 0) {
                var steps = options.route.legs[0].steps;
                for (var i=0, step; step=steps[i]; i++) {
                    step.step_number = i;
                    self.drawPolyline({
                        path: step.path,
                        strokeColor: options.strokeColor,
                        strokeOpacity: options.strokeOpacity,
                        strokeWeight: options.strokeWeight
                    });
                    options.step(step);
                }
            }
        }
    };

    GMaps.Route = function(options) {
        this.origin = options.origin;
        this.destination = options.destination;
        this.waypoints = options.waypoints;

        this.map = options.map;
        this.route = options.route;
        this.step_count = 0;
        this.steps = this.route.legs[0].steps;
        this.steps_length = this.steps.length;

        this.polyline = this.map.drawPolyline({
            path: new google.maps.MVCArray(),
            strokeColor: options.strokeColor,
            strokeOpacity: options.strokeOpacity,
            strokeWeight: options.strokeWeight
        }).getPath();
    };

    GMaps.Route.prototype.getRoute = function(options) {
        var self = this;

        this.map.getRoutes({
            origin : this.origin,
            destination : this.destination,
            travelMode : options.travelMode,
            waypoints : this.waypoints || [],
            error: options.error,
            callback : function() {
                self.route = e[0];

                if (options.callback) {
                    options.callback.call(self);
                }
            }
        });
    };

    GMaps.Route.prototype.back = function() {
        if (this.step_count > 0) {
            this.step_count--;
            var path = this.route.legs[0].steps[this.step_count].path;

            for (var p in path){
                if (path.hasOwnProperty(p)){
                    this.polyline.pop();
                }
            }
        }
    };

    GMaps.Route.prototype.forward = function() {
        if (this.step_count < this.steps_length) {
            var path = this.route.legs[0].steps[this.step_count].path;

            for (var p in path){
                if (path.hasOwnProperty(p)){
                    this.polyline.push(path[p]);
                }
            }
            this.step_count++;
        }
    };

    GMaps.prototype.checkGeofence = function(lat, lng, fence) {
        return fence.containsLatLng(new google.maps.LatLng(lat, lng));
    };

    GMaps.prototype.checkMarkerGeofence = function(marker, outside_callback) {
        if (marker.fences) {
            for (var i = 0, fence; fence = marker.fences[i]; i++) {
                var pos = marker.getPosition();
                if (!this.checkGeofence(pos.lat(), pos.lng(), fence)) {
                    outside_callback(marker, fence);
                }
            }
        }
    };

    GMaps.prototype.toImage = function(options) {
        var options = options || {},
            static_map_options = {};

        static_map_options['size'] = options['size'] || [this.el.clientWidth, this.el.clientHeight];
        static_map_options['lat'] = this.getCenter().lat();
        static_map_options['lng'] = this.getCenter().lng();

        if (this.markers.length > 0) {
            static_map_options['markers'] = [];

            for (var i = 0; i < this.markers.length; i++) {
                static_map_options['markers'].push({
                    lat: this.markers[i].getPosition().lat(),
                    lng: this.markers[i].getPosition().lng()
                });
            }
        }

        if (this.polylines.length > 0) {
            var polyline = this.polylines[0];

            static_map_options['polyline'] = {};
            static_map_options['polyline']['path'] = google.maps.geometry.encoding.encodePath(polyline.getPath());
            static_map_options['polyline']['strokeColor'] = polyline.strokeColor
            static_map_options['polyline']['strokeOpacity'] = polyline.strokeOpacity
            static_map_options['polyline']['strokeWeight'] = polyline.strokeWeight
        }

        return GMaps.staticMapURL(static_map_options);
    };

    GMaps.staticMapURL = function(options){
        var parameters = [],
            data,
            static_root = 'http://maps.googleapis.com/maps/api/staticmap';

        if (options.url) {
            static_root = options.url;
            delete options.url;
        }

        static_root += '?';

        var markers = options.markers;

        delete options.markers;

        if (!markers && options.marker) {
            markers = [options.marker];
            delete options.marker;
        }

        var styles = options.styles;

        delete options.styles;

        var polyline = options.polyline;
        delete options.polyline;

        /** Map options **/
        if (options.center) {
            parameters.push('center=' + options.center);
            delete options.center;
        }
        else if (options.address) {
            parameters.push('center=' + options.address);
            delete options.address;
        }
        else if (options.lat) {
            parameters.push(['center=', options.lat, ',', options.lng].join(''));
            delete options.lat;
            delete options.lng;
        }
        else if (options.visible) {
            var visible = encodeURI(options.visible.join('|'));
            parameters.push('visible=' + visible);
        }

        var size = options.size;
        if (size) {
            if (size.join) {
                size = size.join('x');
            }
            delete options.size;
        }
        else {
            size = '630x300';
        }
        parameters.push('size=' + size);

        if (!options.zoom && options.zoom !== false) {
            options.zoom = 15;
        }

        var sensor = options.hasOwnProperty('sensor') ? !!options.sensor : true;
        delete options.sensor;
        parameters.push('sensor=' + sensor);

        for (var param in options) {
            if (options.hasOwnProperty(param)) {
                parameters.push(param + '=' + options[param]);
            }
        }

        /** Markers **/
        if (markers) {
            var marker, loc;

            for (var i=0; data=markers[i]; i++) {
                marker = [];

                if (data.size && data.size !== 'normal') {
                    marker.push('size:' + data.size);
                    delete data.size;
                }
                else if (data.icon) {
                    marker.push('icon:' + encodeURI(data.icon));
                    delete data.icon;
                }

                if (data.color) {
                    marker.push('color:' + data.color.replace('#', '0x'));
                    delete data.color;
                }

                if (data.label) {
                    marker.push('label:' + data.label[0].toUpperCase());
                    delete data.label;
                }

                loc = (data.address ? data.address : data.lat + ',' + data.lng);
                delete data.address;
                delete data.lat;
                delete data.lng;

                for(var param in data){
                    if (data.hasOwnProperty(param)) {
                        marker.push(param + ':' + data[param]);
                    }
                }

                if (marker.length || i === 0) {
                    marker.push(loc);
                    marker = marker.join('|');
                    parameters.push('markers=' + encodeURI(marker));
                }
                // New marker without styles
                else {
                    marker = parameters.pop() + encodeURI('|' + loc);
                    parameters.push(marker);
                }
            }
        }

        /** Map Styles **/
        if (styles) {
            for (var i = 0; i < styles.length; i++) {
                var styleRule = [];
                if (styles[i].featureType){
                    styleRule.push('feature:' + styles[i].featureType.toLowerCase());
                }

                if (styles[i].elementType) {
                    styleRule.push('element:' + styles[i].elementType.toLowerCase());
                }

                for (var j = 0; j < styles[i].stylers.length; j++) {
                    for (var p in styles[i].stylers[j]) {
                        var ruleArg = styles[i].stylers[j][p];
                        if (p == 'hue' || p == 'color') {
                            ruleArg = '0x' + ruleArg.substring(1);
                        }
                        styleRule.push(p + ':' + ruleArg);
                    }
                }

                var rule = styleRule.join('|');
                if (rule != '') {
                    parameters.push('style=' + rule);
                }
            }
        }

        /** Polylines **/
        function parseColor(color, opacity) {
            if (color[0] === '#'){
                color = color.replace('#', '0x');

                if (opacity) {
                    opacity = parseFloat(opacity);
                    opacity = Math.min(1, Math.max(opacity, 0));
                    if (opacity === 0) {
                        return '0x00000000';
                    }
                    opacity = (opacity * 255).toString(16);
                    if (opacity.length === 1) {
                        opacity += opacity;
                    }

                    color = color.slice(0,8) + opacity;
                }
            }
            return color;
        }

        if (polyline) {
            data = polyline;
            polyline = [];

            if (data.strokeWeight) {
                polyline.push('weight:' + parseInt(data.strokeWeight, 10));
            }

            if (data.strokeColor) {
                var color = parseColor(data.strokeColor, data.strokeOpacity);
                polyline.push('color:' + color);
            }

            if (data.fillColor) {
                var fillcolor = parseColor(data.fillColor, data.fillOpacity);
                polyline.push('fillcolor:' + fillcolor);
            }

            var path = data.path;
            if (path.join) {
                for (var j=0, pos; pos=path[j]; j++) {
                    polyline.push(pos.join(','));
                }
            }
            else {
                polyline.push('enc:' + path);
            }

            polyline = polyline.join('|');
            parameters.push('path=' + encodeURI(polyline));
        }

        /** Retina support **/
        var dpi = window.devicePixelRatio || 1;
        parameters.push('scale=' + dpi);

        parameters = parameters.join('&');
        return static_root + parameters;
    };

    GMaps.prototype.addMapType = function(mapTypeId, options) {
        if (options.hasOwnProperty("getTileUrl") && typeof(options["getTileUrl"]) == "function") {
            options.tileSize = options.tileSize || new google.maps.Size(256, 256);

            var mapType = new google.maps.ImageMapType(options);

            this.map.mapTypes.set(mapTypeId, mapType);
        }
        else {
            throw "'getTileUrl' function required.";
        }
    };

    GMaps.prototype.addOverlayMapType = function(options) {
        if (options.hasOwnProperty("getTile") && typeof(options["getTile"]) == "function") {
            var overlayMapTypeIndex = options.index;

            delete options.index;

            this.map.overlayMapTypes.insertAt(overlayMapTypeIndex, options);
        }
        else {
            throw "'getTile' function required.";
        }
    };

    GMaps.prototype.removeOverlayMapType = function(overlayMapTypeIndex) {
        this.map.overlayMapTypes.removeAt(overlayMapTypeIndex);
    };

    GMaps.prototype.addStyle = function(options) {
        var styledMapType = new google.maps.StyledMapType(options.styles, { name: options.styledMapName });

        this.map.mapTypes.set(options.mapTypeId, styledMapType);
    };

    GMaps.prototype.setStyle = function(mapTypeId) {
        this.map.setMapTypeId(mapTypeId);
    };

    GMaps.prototype.createPanorama = function(streetview_options) {
        if (!streetview_options.hasOwnProperty('lat') || !streetview_options.hasOwnProperty('lng')) {
            streetview_options.lat = this.getCenter().lat();
            streetview_options.lng = this.getCenter().lng();
        }

        this.panorama = GMaps.createPanorama(streetview_options);

        this.map.setStreetView(this.panorama);

        return this.panorama;
    };

    GMaps.createPanorama = function(options) {
        var el = getElementById(options.el, options.context);

        options.position = new google.maps.LatLng(options.lat, options.lng);

        delete options.el;
        delete options.context;
        delete options.lat;
        delete options.lng;

        var streetview_events = ['closeclick', 'links_changed', 'pano_changed', 'position_changed', 'pov_changed', 'resize', 'visible_changed'],
            streetview_options = extend_object({visible : true}, options);

        for (var i = 0; i < streetview_events.length; i++) {
            delete streetview_options[streetview_events[i]];
        }

        var panorama = new google.maps.StreetViewPanorama(el, streetview_options);

        for (var i = 0; i < streetview_events.length; i++) {
            (function(object, name) {
                if (options[name]) {
                    google.maps.event.addListener(object, name, function(){
                        options[name].apply(this);
                    });
                }
            })(panorama, streetview_events[i]);
        }

        return panorama;
    };

    GMaps.prototype.on = function(event_name, handler) {
        return GMaps.on(event_name, this, handler);
    };

    GMaps.prototype.off = function(event_name) {
        GMaps.off(event_name, this);
    };

    GMaps.custom_events = ['marker_added', 'marker_removed', 'polyline_added', 'polyline_removed', 'polygon_added', 'polygon_removed', 'geolocated', 'geolocation_failed'];

    GMaps.on = function(event_name, object, handler) {
        if (GMaps.custom_events.indexOf(event_name) == -1) {
            if(object instanceof GMaps) object = object.map;
            return google.maps.event.addListener(object, event_name, handler);
        }
        else {
            var registered_event = {
                handler : handler,
                eventName : event_name
            };

            object.registered_events[event_name] = object.registered_events[event_name] || [];
            object.registered_events[event_name].push(registered_event);

            return registered_event;
        }
    };

    GMaps.off = function(event_name, object) {
        if (GMaps.custom_events.indexOf(event_name) == -1) {
            if(object instanceof GMaps) object = object.map;
            google.maps.event.clearListeners(object, event_name);
        }
        else {
            object.registered_events[event_name] = [];
        }
    };

    GMaps.fire = function(event_name, object, scope) {
        if (GMaps.custom_events.indexOf(event_name) == -1) {
            google.maps.event.trigger(object, event_name, Array.prototype.slice.apply(arguments).slice(2));
        }
        else {
            if(event_name in scope.registered_events) {
                var firing_events = scope.registered_events[event_name];

                for(var i = 0; i < firing_events.length; i++) {
                    (function(handler, scope, object) {
                        handler.apply(scope, [object]);
                    })(firing_events[i]['handler'], scope, object);
                }
            }
        }
    };

    GMaps.geolocate = function(options) {
        var complete_callback = options.always || options.complete;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                options.success(position);

                if (complete_callback) {
                    complete_callback();
                }
            }, function(error) {
                options.error(error);

                if (complete_callback) {
                    complete_callback();
                }
            }, options.options);
        }
        else {
            options.not_supported();

            if (complete_callback) {
                complete_callback();
            }
        }
    };

    GMaps.geocode = function(options) {
        this.geocoder = new google.maps.Geocoder();
        var callback = options.callback;
        if (options.hasOwnProperty('lat') && options.hasOwnProperty('lng')) {
            options.latLng = new google.maps.LatLng(options.lat, options.lng);
        }

        delete options.lat;
        delete options.lng;
        delete options.callback;

        this.geocoder.geocode(options, function(results, status) {
            callback(results, status);
        });
    };

//==========================
// Polygon containsLatLng
// https://github.com/tparkin/Google-Maps-Point-in-Polygon
// Poygon getBounds extension - google-maps-extensions
// http://code.google.com/p/google-maps-extensions/source/browse/google.maps.Polygon.getBounds.js
    if (!google.maps.Polygon.prototype.getBounds) {
        google.maps.Polygon.prototype.getBounds = function(latLng) {
            var bounds = new google.maps.LatLngBounds();
            var paths = this.getPaths();
            var path;

            for (var p = 0; p < paths.getLength(); p++) {
                path = paths.getAt(p);
                for (var i = 0; i < path.getLength(); i++) {
                    bounds.extend(path.getAt(i));
                }
            }

            return bounds;
        };
    }

    if (!google.maps.Polygon.prototype.containsLatLng) {
        // Polygon containsLatLng - method to determine if a latLng is within a polygon
        google.maps.Polygon.prototype.containsLatLng = function(latLng) {
            // Exclude points outside of bounds as there is no way they are in the poly
            var bounds = this.getBounds();

            if (bounds !== null && !bounds.contains(latLng)) {
                return false;
            }

            // Raycast point in polygon method
            var inPoly = false;

            var numPaths = this.getPaths().getLength();
            for (var p = 0; p < numPaths; p++) {
                var path = this.getPaths().getAt(p);
                var numPoints = path.getLength();
                var j = numPoints - 1;

                for (var i = 0; i < numPoints; i++) {
                    var vertex1 = path.getAt(i);
                    var vertex2 = path.getAt(j);

                    if (vertex1.lng() < latLng.lng() && vertex2.lng() >= latLng.lng() || vertex2.lng() < latLng.lng() && vertex1.lng() >= latLng.lng()) {
                        if (vertex1.lat() + (latLng.lng() - vertex1.lng()) / (vertex2.lng() - vertex1.lng()) * (vertex2.lat() - vertex1.lat()) < latLng.lat()) {
                            inPoly = !inPoly;
                        }
                    }

                    j = i;
                }
            }

            return inPoly;
        };
    }

    if (!google.maps.Circle.prototype.containsLatLng) {
        google.maps.Circle.prototype.containsLatLng = function(latLng) {
            if (google.maps.geometry) {
                return google.maps.geometry.spherical.computeDistanceBetween(this.getCenter(), latLng) <= this.getRadius();
            }
            else {
                return true;
            }
        };
    }

    google.maps.LatLngBounds.prototype.containsLatLng = function(latLng) {
        return this.contains(latLng);
    };

    google.maps.Marker.prototype.setFences = function(fences) {
        this.fences = fences;
    };

    google.maps.Marker.prototype.addFence = function(fence) {
        this.fences.push(fence);
    };

    google.maps.Marker.prototype.getId = function() {
        return this['__gm_id'];
    };

//==========================
// Array indexOf
// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/indexOf
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
            "use strict";
            if (this == null) {
                throw new TypeError();
            }
            var t = Object(this);
            var len = t.length >>> 0;
            if (len === 0) {
                return -1;
            }
            var n = 0;
            if (arguments.length > 1) {
                n = Number(arguments[1]);
                if (n != n) { // shortcut for verifying if it's NaN
                    n = 0;
                } else if (n != 0 && n != Infinity && n != -Infinity) {
                    n = (n > 0 || -1) * Math.floor(Math.abs(n));
                }
            }
            if (n >= len) {
                return -1;
            }
            var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
            for (; k < len; k++) {
                if (k in t && t[k] === searchElement) {
                    return k;
                }
            }
            return -1;
        }
    }

    return GMaps;
}));

//HTML5SHIV.JS

/**
 * @preserve HTML5 Shiv 3.7.3-pre | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
 */
;(function(window, document) {
    /*jshint evil:true */
    /** version */
    var version = '3.7.3-pre';

    /** Preset options */
    var options = window.html5 || {};

    /** Used to skip problem elements */
    var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;

    /** Not all elements can be cloned in IE **/
    var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;

    /** Detect whether the browser supports default html5 styles */
    var supportsHtml5Styles;

    /** Name of the expando, to work with multiple documents or to re-shiv one document */
    var expando = '_html5shiv';

    /** The id for the the documents expando */
    var expanID = 0;

    /** Cached data for each document */
    var expandoData = {};

    /** Detect whether the browser supports unknown elements */
    var supportsUnknownElements;

    (function() {
        try {
            var a = document.createElement('a');
            a.innerHTML = '<xyz></xyz>';
            //if the hidden property is implemented we can assume, that the browser supports basic HTML5 Styles
            supportsHtml5Styles = ('hidden' in a);

            supportsUnknownElements = a.childNodes.length == 1 || (function() {
                // assign a false positive if unable to shiv
                (document.createElement)('a');
                var frag = document.createDocumentFragment();
                return (
                    typeof frag.cloneNode == 'undefined' ||
                    typeof frag.createDocumentFragment == 'undefined' ||
                    typeof frag.createElement == 'undefined'
                );
            }());
        } catch(e) {
            // assign a false positive if detection fails => unable to shiv
            supportsHtml5Styles = true;
            supportsUnknownElements = true;
        }

    }());

    /*--------------------------------------------------------------------------*/

    /**
     * Creates a style sheet with the given CSS text and adds it to the document.
     * @private
     * @param {Document} ownerDocument The document.
     * @param {String} cssText The CSS text.
     * @returns {StyleSheet} The style element.
     */
    function addStyleSheet(ownerDocument, cssText) {
        var p = ownerDocument.createElement('p'),
            parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;

        p.innerHTML = 'x<style>' + cssText + '</style>';
        return parent.insertBefore(p.lastChild, parent.firstChild);
    }

    /**
     * Returns the value of `html5.elements` as an array.
     * @private
     * @returns {Array} An array of shived element node names.
     */
    function getElements() {
        var elements = html5.elements;
        return typeof elements == 'string' ? elements.split(' ') : elements;
    }

    /**
     * Extends the built-in list of html5 elements
     * @memberOf html5
     * @param {String|Array} newElements whitespace separated list or array of new element names to shiv
     * @param {Document} ownerDocument The context document.
     */
    function addElements(newElements, ownerDocument) {
        var elements = html5.elements;
        if(typeof elements != 'string'){
            elements = elements.join(' ');
        }
        if(typeof newElements != 'string'){
            newElements = newElements.join(' ');
        }
        html5.elements = elements +' '+ newElements;
        shivDocument(ownerDocument);
    }

    /**
     * Returns the data associated to the given document
     * @private
     * @param {Document} ownerDocument The document.
     * @returns {Object} An object of data.
     */
    function getExpandoData(ownerDocument) {
        var data = expandoData[ownerDocument[expando]];
        if (!data) {
            data = {};
            expanID++;
            ownerDocument[expando] = expanID;
            expandoData[expanID] = data;
        }
        return data;
    }

    /**
     * returns a shived element for the given nodeName and document
     * @memberOf html5
     * @param {String} nodeName name of the element
     * @param {Document} ownerDocument The context document.
     * @returns {Object} The shived element.
     */
    function createElement(nodeName, ownerDocument, data){
        if (!ownerDocument) {
            ownerDocument = document;
        }
        if(supportsUnknownElements){
            return ownerDocument.createElement(nodeName);
        }
        if (!data) {
            data = getExpandoData(ownerDocument);
        }
        var node;

        if (data.cache[nodeName]) {
            node = data.cache[nodeName].cloneNode();
        } else if (saveClones.test(nodeName)) {
            node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
        } else {
            node = data.createElem(nodeName);
        }

        // Avoid adding some elements to fragments in IE < 9 because
        // * Attributes like `name` or `type` cannot be set/changed once an element
        //   is inserted into a document/fragment
        // * Link elements with `src` attributes that are inaccessible, as with
        //   a 403 response, will cause the tab/window to crash
        // * Script elements appended to fragments will execute when their `src`
        //   or `text` property is set
        return node.canHaveChildren && !reSkip.test(nodeName) && !node.tagUrn ? data.frag.appendChild(node) : node;
    }

    /**
     * returns a shived DocumentFragment for the given document
     * @memberOf html5
     * @param {Document} ownerDocument The context document.
     * @returns {Object} The shived DocumentFragment.
     */
    function createDocumentFragment(ownerDocument, data){
        if (!ownerDocument) {
            ownerDocument = document;
        }
        if(supportsUnknownElements){
            return ownerDocument.createDocumentFragment();
        }
        data = data || getExpandoData(ownerDocument);
        var clone = data.frag.cloneNode(),
            i = 0,
            elems = getElements(),
            l = elems.length;
        for(;i<l;i++){
            clone.createElement(elems[i]);
        }
        return clone;
    }

    /**
     * Shivs the `createElement` and `createDocumentFragment` methods of the document.
     * @private
     * @param {Document|DocumentFragment} ownerDocument The document.
     * @param {Object} data of the document.
     */
    function shivMethods(ownerDocument, data) {
        if (!data.cache) {
            data.cache = {};
            data.createElem = ownerDocument.createElement;
            data.createFrag = ownerDocument.createDocumentFragment;
            data.frag = data.createFrag();
        }


        ownerDocument.createElement = function(nodeName) {
            //abort shiv
            if (!html5.shivMethods) {
                return data.createElem(nodeName);
            }
            return createElement(nodeName, ownerDocument, data);
        };

        ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +
            'var n=f.cloneNode(),c=n.createElement;' +
            'h.shivMethods&&(' +
            // unroll the `createElement` calls
            getElements().join().replace(/[\w\-:]+/g, function(nodeName) {
                data.createElem(nodeName);
                data.frag.createElement(nodeName);
                return 'c("' + nodeName + '")';
            }) +
            ');return n}'
        )(html5, data.frag);
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Shivs the given document.
     * @memberOf html5
     * @param {Document} ownerDocument The document to shiv.
     * @returns {Document} The shived document.
     */
    function shivDocument(ownerDocument) {
        if (!ownerDocument) {
            ownerDocument = document;
        }
        var data = getExpandoData(ownerDocument);

        if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
            data.hasCSS = !!addStyleSheet(ownerDocument,
                // corrects block display not defined in IE6/7/8/9
                'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}' +
                // adds styling not present in IE6/7/8/9
                'mark{background:#FF0;color:#000}' +
                // hides non-rendered elements
                'template{display:none}'
            );
        }
        if (!supportsUnknownElements) {
            shivMethods(ownerDocument, data);
        }
        return ownerDocument;
    }

    /*--------------------------------------------------------------------------*/

    /**
     * The `html5` object is exposed so that more elements can be shived and
     * existing shiving can be detected on iframes.
     * @type Object
     * @example
     *
     * // options can be changed before the script is included
     * html5 = { 'elements': 'mark section', 'shivCSS': false, 'shivMethods': false };
     */
    var html5 = {

        /**
         * An array or space separated string of node names of the elements to shiv.
         * @memberOf html5
         * @type Array|String
         */
        'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video',

        /**
         * current version of html5shiv
         */
        'version': version,

        /**
         * A flag to indicate that the HTML5 style sheet should be inserted.
         * @memberOf html5
         * @type Boolean
         */
        'shivCSS': (options.shivCSS !== false),

        /**
         * Is equal to true if a browser supports creating unknown/HTML5 elements
         * @memberOf html5
         * @type boolean
         */
        'supportsUnknownElements': supportsUnknownElements,

        /**
         * A flag to indicate that the document's `createElement` and `createDocumentFragment`
         * methods should be overwritten.
         * @memberOf html5
         * @type Boolean
         */
        'shivMethods': (options.shivMethods !== false),

        /**
         * A string to describe the type of `html5` object ("default" or "default print").
         * @memberOf html5
         * @type String
         */
        'type': 'default',

        // shivs the document according to the specified `html5` object options
        'shivDocument': shivDocument,

        //creates a shived element
        createElement: createElement,

        //creates a shived documentFragment
        createDocumentFragment: createDocumentFragment,

        //extends list of elements
        addElements: addElements
    };

    /*--------------------------------------------------------------------------*/

    // expose html5
    window.html5 = html5;

    // shiv the document
    shivDocument(document);

    if(typeof module == 'object' && module.exports){
        module.exports = html5;
    }

}(typeof window !== "undefined" ? window : this, document));

//MODERNIZR.JS
/* Modernizr 2.8.3 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-fontface-backgroundsize-borderimage-borderradius-boxshadow-flexbox-hsla-multiplebgs-opacity-rgba-textshadow-cssanimations-csscolumns-generatedcontent-cssgradients-cssreflections-csstransforms-csstransforms3d-csstransitions-applicationcache-canvas-canvastext-draganddrop-hashchange-history-audio-video-indexeddb-input-inputtypes-localstorage-postmessage-sessionstorage-websockets-websqldatabase-webworkers-geolocation-inlinesvg-smil-svg-svgclippaths-touch-webgl-shiv-cssclasses-addtest-prefixed-teststyles-testprop-testallprops-hasevent-prefixes-domprefixes-load
 */
;



window.Modernizr = (function( window, document, undefined ) {

    var version = '2.8.3',

        Modernizr = {},

        enableClasses = true,

        docElement = document.documentElement,

        mod = 'modernizr',
        modElem = document.createElement(mod),
        mStyle = modElem.style,

        inputElem  = document.createElement('input')  ,

        smile = ':)',

        toString = {}.toString,

        prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),



        omPrefixes = 'Webkit Moz O ms',

        cssomPrefixes = omPrefixes.split(' '),

        domPrefixes = omPrefixes.toLowerCase().split(' '),

        ns = {'svg': 'http://www.w3.org/2000/svg'},

        tests = {},
        inputs = {},
        attrs = {},

        classes = [],

        slice = classes.slice,

        featureName,


        injectElementWithStyles = function( rule, callback, nodes, testnames ) {

            var style, ret, node, docOverflow,
                div = document.createElement('div'),
                body = document.body,
                fakeBody = body || document.createElement('body');

            if ( parseInt(nodes, 10) ) {
                while ( nodes-- ) {
                    node = document.createElement('div');
                    node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
                    div.appendChild(node);
                }
            }

            style = ['&#173;','<style id="s', mod, '">', rule, '</style>'].join('');
            div.id = mod;
            (body ? div : fakeBody).innerHTML += style;
            fakeBody.appendChild(div);
            if ( !body ) {
                fakeBody.style.background = '';
                fakeBody.style.overflow = 'hidden';
                docOverflow = docElement.style.overflow;
                docElement.style.overflow = 'hidden';
                docElement.appendChild(fakeBody);
            }

            ret = callback(div, rule);
            if ( !body ) {
                fakeBody.parentNode.removeChild(fakeBody);
                docElement.style.overflow = docOverflow;
            } else {
                div.parentNode.removeChild(div);
            }

            return !!ret;

        },



        isEventSupported = (function() {

            var TAGNAMES = {
                'select': 'input', 'change': 'input',
                'submit': 'form', 'reset': 'form',
                'error': 'img', 'load': 'img', 'abort': 'img'
            };

            function isEventSupported( eventName, element ) {

                element = element || document.createElement(TAGNAMES[eventName] || 'div');
                eventName = 'on' + eventName;

                var isSupported = eventName in element;

                if ( !isSupported ) {
                    if ( !element.setAttribute ) {
                        element = document.createElement('div');
                    }
                    if ( element.setAttribute && element.removeAttribute ) {
                        element.setAttribute(eventName, '');
                        isSupported = is(element[eventName], 'function');

                        if ( !is(element[eventName], 'undefined') ) {
                            element[eventName] = undefined;
                        }
                        element.removeAttribute(eventName);
                    }
                }

                element = null;
                return isSupported;
            }
            return isEventSupported;
        })(),


        _hasOwnProperty = ({}).hasOwnProperty, hasOwnProp;

    if ( !is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined') ) {
        hasOwnProp = function (object, property) {
            return _hasOwnProperty.call(object, property);
        };
    }
    else {
        hasOwnProp = function (object, property) {
            return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
        };
    }


    if (!Function.prototype.bind) {
        Function.prototype.bind = function bind(that) {

            var target = this;

            if (typeof target != "function") {
                throw new TypeError();
            }

            var args = slice.call(arguments, 1),
                bound = function () {

                    if (this instanceof bound) {

                        var F = function(){};
                        F.prototype = target.prototype;
                        var self = new F();

                        var result = target.apply(
                            self,
                            args.concat(slice.call(arguments))
                        );
                        if (Object(result) === result) {
                            return result;
                        }
                        return self;

                    } else {

                        return target.apply(
                            that,
                            args.concat(slice.call(arguments))
                        );

                    }

                };

            return bound;
        };
    }

    function setCss( str ) {
        mStyle.cssText = str;
    }

    function setCssAll( str1, str2 ) {
        return setCss(prefixes.join(str1 + ';') + ( str2 || '' ));
    }

    function is( obj, type ) {
        return typeof obj === type;
    }

    function contains( str, substr ) {
        return !!~('' + str).indexOf(substr);
    }

    function testProps( props, prefixed ) {
        for ( var i in props ) {
            var prop = props[i];
            if ( !contains(prop, "-") && mStyle[prop] !== undefined ) {
                return prefixed == 'pfx' ? prop : true;
            }
        }
        return false;
    }

    function testDOMProps( props, obj, elem ) {
        for ( var i in props ) {
            var item = obj[props[i]];
            if ( item !== undefined) {

                if (elem === false) return props[i];

                if (is(item, 'function')){
                    return item.bind(elem || obj);
                }

                return item;
            }
        }
        return false;
    }

    function testPropsAll( prop, prefixed, elem ) {

        var ucProp  = prop.charAt(0).toUpperCase() + prop.slice(1),
            props   = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

        if(is(prefixed, "string") || is(prefixed, "undefined")) {
            return testProps(props, prefixed);

        } else {
            props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
            return testDOMProps(props, prefixed, elem);
        }
    }    tests['flexbox'] = function() {
        return testPropsAll('flexWrap');
    };    tests['canvas'] = function() {
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    };

    tests['canvastext'] = function() {
        return !!(Modernizr['canvas'] && is(document.createElement('canvas').getContext('2d').fillText, 'function'));
    };



    tests['webgl'] = function() {
        return !!window.WebGLRenderingContext;
    };


    tests['touch'] = function() {
        var bool;

        if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
            bool = true;
        } else {
            injectElementWithStyles(['@media (',prefixes.join('touch-enabled),('),mod,')','{#modernizr{top:9px;position:absolute}}'].join(''), function( node ) {
                bool = node.offsetTop === 9;
            });
        }

        return bool;
    };



    tests['geolocation'] = function() {
        return 'geolocation' in navigator;
    };


    tests['postmessage'] = function() {
        return !!window.postMessage;
    };


    tests['websqldatabase'] = function() {
        return !!window.openDatabase;
    };

    tests['indexedDB'] = function() {
        return !!testPropsAll("indexedDB", window);
    };

    tests['hashchange'] = function() {
        return isEventSupported('hashchange', window) && (document.documentMode === undefined || document.documentMode > 7);
    };

    tests['history'] = function() {
        return !!(window.history && history.pushState);
    };

    tests['draganddrop'] = function() {
        var div = document.createElement('div');
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
    };

    tests['websockets'] = function() {
        return 'WebSocket' in window || 'MozWebSocket' in window;
    };


    tests['rgba'] = function() {
        setCss('background-color:rgba(150,255,150,.5)');

        return contains(mStyle.backgroundColor, 'rgba');
    };

    tests['hsla'] = function() {
        setCss('background-color:hsla(120,40%,100%,.5)');

        return contains(mStyle.backgroundColor, 'rgba') || contains(mStyle.backgroundColor, 'hsla');
    };

    tests['multiplebgs'] = function() {
        setCss('background:url(https://),url(https://),red url(https://)');

        return (/(url\s*\(.*?){3}/).test(mStyle.background);
    };    tests['backgroundsize'] = function() {
        return testPropsAll('backgroundSize');
    };

    tests['borderimage'] = function() {
        return testPropsAll('borderImage');
    };



    tests['borderradius'] = function() {
        return testPropsAll('borderRadius');
    };

    tests['boxshadow'] = function() {
        return testPropsAll('boxShadow');
    };

    tests['textshadow'] = function() {
        return document.createElement('div').style.textShadow === '';
    };


    tests['opacity'] = function() {
        setCssAll('opacity:.55');

        return (/^0.55$/).test(mStyle.opacity);
    };


    tests['cssanimations'] = function() {
        return testPropsAll('animationName');
    };


    tests['csscolumns'] = function() {
        return testPropsAll('columnCount');
    };


    tests['cssgradients'] = function() {
        var str1 = 'background-image:',
            str2 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));',
            str3 = 'linear-gradient(left top,#9f9, white);';

        setCss(
            (str1 + '-webkit- '.split(' ').join(str2 + str1) +
                prefixes.join(str3 + str1)).slice(0, -str1.length)
        );

        return contains(mStyle.backgroundImage, 'gradient');
    };


    tests['cssreflections'] = function() {
        return testPropsAll('boxReflect');
    };


    tests['csstransforms'] = function() {
        return !!testPropsAll('transform');
    };


    tests['csstransforms3d'] = function() {

        var ret = !!testPropsAll('perspective');

        if ( ret && 'webkitPerspective' in docElement.style ) {

            injectElementWithStyles('@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}', function( node, rule ) {
                ret = node.offsetLeft === 9 && node.offsetHeight === 3;
            });
        }
        return ret;
    };


    tests['csstransitions'] = function() {
        return testPropsAll('transition');
    };



    tests['fontface'] = function() {
        var bool;

        injectElementWithStyles('@font-face {font-family:"font";src:url("https://")}', function( node, rule ) {
            var style = document.getElementById('smodernizr'),
                sheet = style.sheet || style.styleSheet,
                cssText = sheet ? (sheet.cssRules && sheet.cssRules[0] ? sheet.cssRules[0].cssText : sheet.cssText || '') : '';

            bool = /src/i.test(cssText) && cssText.indexOf(rule.split(' ')[0]) === 0;
        });

        return bool;
    };

    tests['generatedcontent'] = function() {
        var bool;

        injectElementWithStyles(['#',mod,'{font:0/0 a}#',mod,':after{content:"',smile,'";visibility:hidden;font:3px/1 a}'].join(''), function( node ) {
            bool = node.offsetHeight >= 3;
        });

        return bool;
    };
    tests['video'] = function() {
        var elem = document.createElement('video'),
            bool = false;

        try {
            if ( bool = !!elem.canPlayType ) {
                bool      = new Boolean(bool);
                bool.ogg  = elem.canPlayType('video/ogg; codecs="theora"')      .replace(/^no$/,'');

                bool.h264 = elem.canPlayType('video/mp4; codecs="avc1.42E01E"') .replace(/^no$/,'');

                bool.webm = elem.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,'');
            }

        } catch(e) { }

        return bool;
    };

    tests['audio'] = function() {
        var elem = document.createElement('audio'),
            bool = false;

        try {
            if ( bool = !!elem.canPlayType ) {
                bool      = new Boolean(bool);
                bool.ogg  = elem.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,'');
                bool.mp3  = elem.canPlayType('audio/mpeg;')               .replace(/^no$/,'');

                bool.wav  = elem.canPlayType('audio/wav; codecs="1"')     .replace(/^no$/,'');
                bool.m4a  = ( elem.canPlayType('audio/x-m4a;')            ||
                    elem.canPlayType('audio/aac;'))             .replace(/^no$/,'');
            }
        } catch(e) { }

        return bool;
    };


    tests['localstorage'] = function() {
        try {
            localStorage.setItem(mod, mod);
            localStorage.removeItem(mod);
            return true;
        } catch(e) {
            return false;
        }
    };

    tests['sessionstorage'] = function() {
        try {
            sessionStorage.setItem(mod, mod);
            sessionStorage.removeItem(mod);
            return true;
        } catch(e) {
            return false;
        }
    };


    tests['webworkers'] = function() {
        return !!window.Worker;
    };


    tests['applicationcache'] = function() {
        return !!window.applicationCache;
    };


    tests['svg'] = function() {
        return !!document.createElementNS && !!document.createElementNS(ns.svg, 'svg').createSVGRect;
    };

    tests['inlinesvg'] = function() {
        var div = document.createElement('div');
        div.innerHTML = '<svg/>';
        return (div.firstChild && div.firstChild.namespaceURI) == ns.svg;
    };

    tests['smil'] = function() {
        return !!document.createElementNS && /SVGAnimate/.test(toString.call(document.createElementNS(ns.svg, 'animate')));
    };


    tests['svgclippaths'] = function() {
        return !!document.createElementNS && /SVGClipPath/.test(toString.call(document.createElementNS(ns.svg, 'clipPath')));
    };

    function webforms() {
        Modernizr['input'] = (function( props ) {
            for ( var i = 0, len = props.length; i < len; i++ ) {
                attrs[ props[i] ] = !!(props[i] in inputElem);
            }
            if (attrs.list){
                attrs.list = !!(document.createElement('datalist') && window.HTMLDataListElement);
            }
            return attrs;
        })('autocomplete autofocus list placeholder max min multiple pattern required step'.split(' '));
        Modernizr['inputtypes'] = (function(props) {

            for ( var i = 0, bool, inputElemType, defaultView, len = props.length; i < len; i++ ) {

                inputElem.setAttribute('type', inputElemType = props[i]);
                bool = inputElem.type !== 'text';

                if ( bool ) {

                    inputElem.value         = smile;
                    inputElem.style.cssText = 'position:absolute;visibility:hidden;';

                    if ( /^range$/.test(inputElemType) && inputElem.style.WebkitAppearance !== undefined ) {

                        docElement.appendChild(inputElem);
                        defaultView = document.defaultView;

                        bool =  defaultView.getComputedStyle &&
                            defaultView.getComputedStyle(inputElem, null).WebkitAppearance !== 'textfield' &&
                            (inputElem.offsetHeight !== 0);

                        docElement.removeChild(inputElem);

                    } else if ( /^(search|tel)$/.test(inputElemType) ){
                    } else if ( /^(url|email)$/.test(inputElemType) ) {
                        bool = inputElem.checkValidity && inputElem.checkValidity() === false;

                    } else {
                        bool = inputElem.value != smile;
                    }
                }

                inputs[ props[i] ] = !!bool;
            }
            return inputs;
        })('search tel url email datetime date month week time datetime-local number range color'.split(' '));
    }
    for ( var feature in tests ) {
        if ( hasOwnProp(tests, feature) ) {
            featureName  = feature.toLowerCase();
            Modernizr[featureName] = tests[feature]();

            classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
        }
    }

    Modernizr.input || webforms();


    Modernizr.addTest = function ( feature, test ) {
        if ( typeof feature == 'object' ) {
            for ( var key in feature ) {
                if ( hasOwnProp( feature, key ) ) {
                    Modernizr.addTest( key, feature[ key ] );
                }
            }
        } else {

            feature = feature.toLowerCase();

            if ( Modernizr[feature] !== undefined ) {
                return Modernizr;
            }

            test = typeof test == 'function' ? test() : test;

            if (typeof enableClasses !== "undefined" && enableClasses) {
                docElement.className += ' ' + (test ? '' : 'no-') + feature;
            }
            Modernizr[feature] = test;

        }

        return Modernizr;
    };


    setCss('');
    modElem = inputElem = null;

    ;(function(window, document) {
        var version = '3.7.0';

        var options = window.html5 || {};

        var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;

        var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;

        var supportsHtml5Styles;

        var expando = '_html5shiv';

        var expanID = 0;

        var expandoData = {};

        var supportsUnknownElements;

        (function() {
            try {
                var a = document.createElement('a');
                a.innerHTML = '<xyz></xyz>';
                supportsHtml5Styles = ('hidden' in a);

                supportsUnknownElements = a.childNodes.length == 1 || (function() {
                    (document.createElement)('a');
                    var frag = document.createDocumentFragment();
                    return (
                        typeof frag.cloneNode == 'undefined' ||
                        typeof frag.createDocumentFragment == 'undefined' ||
                        typeof frag.createElement == 'undefined'
                    );
                }());
            } catch(e) {
                supportsHtml5Styles = true;
                supportsUnknownElements = true;
            }

        }());

        function addStyleSheet(ownerDocument, cssText) {
            var p = ownerDocument.createElement('p'),
                parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;

            p.innerHTML = 'x<style>' + cssText + '</style>';
            return parent.insertBefore(p.lastChild, parent.firstChild);
        }

        function getElements() {
            var elements = html5.elements;
            return typeof elements == 'string' ? elements.split(' ') : elements;
        }

        function getExpandoData(ownerDocument) {
            var data = expandoData[ownerDocument[expando]];
            if (!data) {
                data = {};
                expanID++;
                ownerDocument[expando] = expanID;
                expandoData[expanID] = data;
            }
            return data;
        }

        function createElement(nodeName, ownerDocument, data){
            if (!ownerDocument) {
                ownerDocument = document;
            }
            if(supportsUnknownElements){
                return ownerDocument.createElement(nodeName);
            }
            if (!data) {
                data = getExpandoData(ownerDocument);
            }
            var node;

            if (data.cache[nodeName]) {
                node = data.cache[nodeName].cloneNode();
            } else if (saveClones.test(nodeName)) {
                node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
            } else {
                node = data.createElem(nodeName);
            }

            return node.canHaveChildren && !reSkip.test(nodeName) && !node.tagUrn ? data.frag.appendChild(node) : node;
        }

        function createDocumentFragment(ownerDocument, data){
            if (!ownerDocument) {
                ownerDocument = document;
            }
            if(supportsUnknownElements){
                return ownerDocument.createDocumentFragment();
            }
            data = data || getExpandoData(ownerDocument);
            var clone = data.frag.cloneNode(),
                i = 0,
                elems = getElements(),
                l = elems.length;
            for(;i<l;i++){
                clone.createElement(elems[i]);
            }
            return clone;
        }

        function shivMethods(ownerDocument, data) {
            if (!data.cache) {
                data.cache = {};
                data.createElem = ownerDocument.createElement;
                data.createFrag = ownerDocument.createDocumentFragment;
                data.frag = data.createFrag();
            }


            ownerDocument.createElement = function(nodeName) {
                if (!html5.shivMethods) {
                    return data.createElem(nodeName);
                }
                return createElement(nodeName, ownerDocument, data);
            };

            ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +
                'var n=f.cloneNode(),c=n.createElement;' +
                'h.shivMethods&&(' +
                getElements().join().replace(/[\w\-]+/g, function(nodeName) {
                    data.createElem(nodeName);
                    data.frag.createElement(nodeName);
                    return 'c("' + nodeName + '")';
                }) +
                ');return n}'
            )(html5, data.frag);
        }

        function shivDocument(ownerDocument) {
            if (!ownerDocument) {
                ownerDocument = document;
            }
            var data = getExpandoData(ownerDocument);

            if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
                data.hasCSS = !!addStyleSheet(ownerDocument,
                    'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}' +
                    'mark{background:#FF0;color:#000}' +
                    'template{display:none}'
                );
            }
            if (!supportsUnknownElements) {
                shivMethods(ownerDocument, data);
            }
            return ownerDocument;
        }

        var html5 = {

            'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video',

            'version': version,

            'shivCSS': (options.shivCSS !== false),

            'supportsUnknownElements': supportsUnknownElements,

            'shivMethods': (options.shivMethods !== false),

            'type': 'default',

            'shivDocument': shivDocument,

            createElement: createElement,

            createDocumentFragment: createDocumentFragment
        };

        window.html5 = html5;

        shivDocument(document);

    }(this, document));

    Modernizr._version      = version;

    Modernizr._prefixes     = prefixes;
    Modernizr._domPrefixes  = domPrefixes;
    Modernizr._cssomPrefixes  = cssomPrefixes;


    Modernizr.hasEvent      = isEventSupported;

    Modernizr.testProp      = function(prop){
        return testProps([prop]);
    };

    Modernizr.testAllProps  = testPropsAll;


    Modernizr.testStyles    = injectElementWithStyles;
    Modernizr.prefixed      = function(prop, obj, elem){
        if(!obj) {
            return testPropsAll(prop, 'pfx');
        } else {
            return testPropsAll(prop, obj, elem);
        }
    };


    docElement.className = docElement.className.replace(/(^|\s)no-js(\s|$)/, '$1$2') +

        (enableClasses ? ' js ' + classes.join(' ') : '');

    return Modernizr;

})(this, this.document);
/*yepnope1.5.4|WTFPL*/
(function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}})(this,document);
Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0));};
;

//RESPOND.MIN.JS
/*! Respond.js v1.4.2: min/max-width media query polyfill
 * Copyright 2014 Scott Jehl
 * Licensed under MIT
 * http://j.mp/respondjs */

!function(a){"use strict";a.matchMedia=a.matchMedia||function(a){var b,c=a.documentElement,d=c.firstElementChild||c.firstChild,e=a.createElement("body"),f=a.createElement("div");return f.id="mq-test-1",f.style.cssText="position:absolute;top:-100em",e.style.background="none",e.appendChild(f),function(a){return f.innerHTML='&shy;<style media="'+a+'"> #mq-test-1 { width: 42px; }</style>',c.insertBefore(e,d),b=42===f.offsetWidth,c.removeChild(e),{matches:b,media:a}}}(a.document)}(this),function(a){"use strict";function b(){v(!0)}var c={};a.respond=c,c.update=function(){};var d=[],e=function(){var b=!1;try{b=new a.XMLHttpRequest}catch(c){b=new a.ActiveXObject("Microsoft.XMLHTTP")}return function(){return b}}(),f=function(a,b){var c=e();c&&(c.open("GET",a,!0),c.onreadystatechange=function(){4!==c.readyState||200!==c.status&&304!==c.status||b(c.responseText)},4!==c.readyState&&c.send(null))},g=function(a){return a.replace(c.regex.minmaxwh,"").match(c.regex.other)};if(c.ajax=f,c.queue=d,c.unsupportedmq=g,c.regex={media:/@media[^\{]+\{([^\{\}]*\{[^\}\{]*\})+/gi,keyframes:/@(?:\-(?:o|moz|webkit)\-)?keyframes[^\{]+\{(?:[^\{\}]*\{[^\}\{]*\})+[^\}]*\}/gi,comments:/\/\*[^*]*\*+([^/][^*]*\*+)*\//gi,urls:/(url\()['"]?([^\/\)'"][^:\)'"]+)['"]?(\))/g,findStyles:/@media *([^\{]+)\{([\S\s]+?)$/,only:/(only\s+)?([a-zA-Z]+)\s?/,minw:/\(\s*min\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/,maxw:/\(\s*max\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/,minmaxwh:/\(\s*m(in|ax)\-(height|width)\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/gi,other:/\([^\)]*\)/g},c.mediaQueriesSupported=a.matchMedia&&null!==a.matchMedia("only all")&&a.matchMedia("only all").matches,!c.mediaQueriesSupported){var h,i,j,k=a.document,l=k.documentElement,m=[],n=[],o=[],p={},q=30,r=k.getElementsByTagName("head")[0]||l,s=k.getElementsByTagName("base")[0],t=r.getElementsByTagName("link"),u=function(){var a,b=k.createElement("div"),c=k.body,d=l.style.fontSize,e=c&&c.style.fontSize,f=!1;return b.style.cssText="position:absolute;font-size:1em;width:1em",c||(c=f=k.createElement("body"),c.style.background="none"),l.style.fontSize="100%",c.style.fontSize="100%",c.appendChild(b),f&&l.insertBefore(c,l.firstChild),a=b.offsetWidth,f?l.removeChild(c):c.removeChild(b),l.style.fontSize=d,e&&(c.style.fontSize=e),a=j=parseFloat(a)},v=function(b){var c="clientWidth",d=l[c],e="CSS1Compat"===k.compatMode&&d||k.body[c]||d,f={},g=t[t.length-1],p=(new Date).getTime();if(b&&h&&q>p-h)return a.clearTimeout(i),i=a.setTimeout(v,q),void 0;h=p;for(var s in m)if(m.hasOwnProperty(s)){var w=m[s],x=w.minw,y=w.maxw,z=null===x,A=null===y,B="em";x&&(x=parseFloat(x)*(x.indexOf(B)>-1?j||u():1)),y&&(y=parseFloat(y)*(y.indexOf(B)>-1?j||u():1)),w.hasquery&&(z&&A||!(z||e>=x)||!(A||y>=e))||(f[w.media]||(f[w.media]=[]),f[w.media].push(n[w.rules]))}for(var C in o)o.hasOwnProperty(C)&&o[C]&&o[C].parentNode===r&&r.removeChild(o[C]);o.length=0;for(var D in f)if(f.hasOwnProperty(D)){var E=k.createElement("style"),F=f[D].join("\n");E.type="text/css",E.media=D,r.insertBefore(E,g.nextSibling),E.styleSheet?E.styleSheet.cssText=F:E.appendChild(k.createTextNode(F)),o.push(E)}},w=function(a,b,d){var e=a.replace(c.regex.comments,"").replace(c.regex.keyframes,"").match(c.regex.media),f=e&&e.length||0;b=b.substring(0,b.lastIndexOf("/"));var h=function(a){return a.replace(c.regex.urls,"$1"+b+"$2$3")},i=!f&&d;b.length&&(b+="/"),i&&(f=1);for(var j=0;f>j;j++){var k,l,o,p;i?(k=d,n.push(h(a))):(k=e[j].match(c.regex.findStyles)&&RegExp.$1,n.push(RegExp.$2&&h(RegExp.$2))),o=k.split(","),p=o.length;for(var q=0;p>q;q++)l=o[q],g(l)||m.push({media:l.split("(")[0].match(c.regex.only)&&RegExp.$2||"all",rules:n.length-1,hasquery:l.indexOf("(")>-1,minw:l.match(c.regex.minw)&&parseFloat(RegExp.$1)+(RegExp.$2||""),maxw:l.match(c.regex.maxw)&&parseFloat(RegExp.$1)+(RegExp.$2||"")})}v()},x=function(){if(d.length){var b=d.shift();f(b.href,function(c){w(c,b.href,b.media),p[b.href]=!0,a.setTimeout(function(){x()},0)})}},y=function(){for(var b=0;b<t.length;b++){var c=t[b],e=c.href,f=c.media,g=c.rel&&"stylesheet"===c.rel.toLowerCase();e&&g&&!p[e]&&(c.styleSheet&&c.styleSheet.rawCssText?(w(c.styleSheet.rawCssText,e,f),p[e]=!0):(!/^([a-zA-Z:]*\/\/)/.test(e)&&!s||e.replace(RegExp.$1,"").split("/")[0]===a.location.host)&&("//"===e.substring(0,2)&&(e=a.location.protocol+e),d.push({href:e,media:f})))}x()};y(),c.update=y,c.getEmValue=u,a.addEventListener?a.addEventListener("resize",b,!1):a.attachEvent&&a.attachEvent("onresize",b)}}(this);

//SMOOTHSCROLL.JS
// SmoothScroll v0.9.9
// Licensed under the terms of the MIT license.
// People involved
// - Balazs Galambosi: maintainer (CHANGELOG.txt)
// - Patrick Brunner (patrickb1991@gmail.com)
// - Michael Herf: ssc_pulse Algorithm

function ssc_init() {
    if (!document.body) return;
    var e = document.body;
    var t = document.documentElement;
    var n = window.innerHeight;
    var r = e.scrollHeight;
    ssc_root = document.compatMode.indexOf("CSS") >= 0 ? t : e;
    ssc_activeElement = e;
    ssc_initdone = true;
    if (top != self) {
        ssc_frame = true
    } else if (r > n && (e.offsetHeight <= n || t.offsetHeight <= n)) {
        ssc_root.style.height = "auto";
        if (ssc_root.offsetHeight <= n) {
            var i = document.createElement("div");
            i.style.clear = "both";
            e.appendChild(i)
        }
    }
    if (!ssc_fixedback) {
        e.style.backgroundAttachment = "scroll";
        t.style.backgroundAttachment = "scroll"
    }
    if (ssc_keyboardsupport) {
        ssc_addEvent("keydown", ssc_keydown)
    }
}

function ssc_scrollArray(e, t, n, r) {
    r || (r = 1e3);
    ssc_directionCheck(t, n);
    ssc_que.push({
        x: t,
        y: n,
        lastX: t < 0 ? .99 : -.99,
        lastY: n < 0 ? .99 : -.99,
        start: +(new Date)
    });
    if (ssc_pending) {
        return
    }
    var i = function() {
        var s = +(new Date);
        var o = 0;
        var u = 0;
        for (var a = 0; a < ssc_que.length; a++) {
            var f = ssc_que[a];
            var l = s - f.start;
            var c = l >= ssc_animtime;
            var h = c ? 1 : l / ssc_animtime;
            if (ssc_pulseAlgorithm) {
                h = ssc_pulse(h)
            }
            var p = f.x * h - f.lastX >> 0;
            var d = f.y * h - f.lastY >> 0;
            o += p;
            u += d;
            f.lastX += p;
            f.lastY += d;
            if (c) {
                ssc_que.splice(a, 1);
                a--
            }
        }
        if (t) {
            var v = e.scrollLeft;
            e.scrollLeft += o;
            if (o && e.scrollLeft === v) {
                t = 0
            }
        }
        if (n) {
            var m = e.scrollTop;
            e.scrollTop += u;
            if (u && e.scrollTop === m) {
                n = 0
            }
        }
        if (!t && !n) {
            ssc_que = []
        }
        if (ssc_que.length) {
            setTimeout(i, r / ssc_framerate + 1)
        } else {
            ssc_pending = false
        }
    };
    setTimeout(i, 0);
    ssc_pending = true
}

function ssc_wheel(e) {
    if (!ssc_initdone) {
        ssc_init()
    }
    var t = e.target;
    var n = ssc_overflowingAncestor(t);
    if (!n || e.defaultPrevented || ssc_isNodeName(ssc_activeElement, "embed") || ssc_isNodeName(t, "embed") && /\.pdf/i.test(t.src)) {
        return true
    }
    var r = e.wheelDeltaX || 0;
    var i = e.wheelDeltaY || 0;
    if (!r && !i) {
        i = e.wheelDelta || 0
    }
    if (Math.abs(r) > 1.2) {
        r *= ssc_stepsize / 120
    }
    if (Math.abs(i) > 1.2) {
        i *= ssc_stepsize / 120
    }
    ssc_scrollArray(n, -r, -i);
    e.preventDefault()
}

function ssc_keydown(e) {
    var t = e.target;
    var n = e.ctrlKey || e.altKey || e.metaKey;
    if (/input|textarea|embed/i.test(t.nodeName) || t.isContentEditable || e.defaultPrevented || n) {
        return true
    }
    if (ssc_isNodeName(t, "button") && e.keyCode === ssc_key.spacebar) {
        return true
    }
    var r, i = 0,
        s = 0;
    var o = ssc_overflowingAncestor(ssc_activeElement);
    var u = o.clientHeight;
    if (o == document.body) {
        u = window.innerHeight
    }
    switch (e.keyCode) {
        case ssc_key.up:
            s = -ssc_arrowscroll;
            break;
        case ssc_key.down:
            s = ssc_arrowscroll;
            break;
        case ssc_key.spacebar:
            r = e.shiftKey ? 1 : -1;
            s = -r * u * .9;
            break;
        case ssc_key.pageup:
            s = -u * .9;
            break;
        case ssc_key.pagedown:
            s = u * .9;
            break;
        case ssc_key.home:
            s = -o.scrollTop;
            break;
        case ssc_key.end:
            var a = o.scrollHeight - o.scrollTop - u;
            s = a > 0 ? a + 10 : 0;
            break;
        case ssc_key.left:
            i = -ssc_arrowscroll;
            break;
        case ssc_key.right:
            i = ssc_arrowscroll;
            break;
        default:
            return true
    }
    ssc_scrollArray(o, i, s);
    e.preventDefault()
}

function ssc_mousedown(e) {
    ssc_activeElement = e.target
}

function ssc_setCache(e, t) {
    for (var n = e.length; n--;) ssc_cache[ssc_uniqueID(e[n])] = t;
    return t
}

function ssc_overflowingAncestor(e) {
    var t = [];
    var n = ssc_root.scrollHeight;
    do {
        var r = ssc_cache[ssc_uniqueID(e)];
        if (r) {
            return ssc_setCache(t, r)
        }
        t.push(e);
        if (n === e.scrollHeight) {
            if (!ssc_frame || ssc_root.clientHeight + 10 < n) {
                return ssc_setCache(t, document.body)
            }
        } else if (e.clientHeight + 10 < e.scrollHeight) {
            overflow = getComputedStyle(e, "").getPropertyValue("overflow");
            if (overflow === "scroll" || overflow === "auto") {
                return ssc_setCache(t, e)
            }
        }
    } while (e = e.parentNode)
}

function ssc_addEvent(e, t, n) {
    window.addEventListener(e, t, n || false)
}

function ssc_removeEvent(e, t, n) {
    window.removeEventListener(e, t, n || false)
}

function ssc_isNodeName(e, t) {
    return e.nodeName.toLowerCase() === t.toLowerCase()
}

function ssc_directionCheck(e, t) {
    e = e > 0 ? 1 : -1;
    t = t > 0 ? 1 : -1;
    if (ssc_direction.x !== e || ssc_direction.y !== t) {
        ssc_direction.x = e;
        ssc_direction.y = t;
        ssc_que = []
    }
}

function ssc_pulse_(e) {
    var t, n, r;
    e = e * ssc_pulseScale;
    if (e < 1) {
        t = e - (1 - Math.exp(-e))
    } else {
        n = Math.exp(-1);
        e -= 1;
        r = 1 - Math.exp(-e);
        t = n + r * (1 - n)
    }
    return t * ssc_pulseNormalize
}

function ssc_pulse(e) {
    if (e >= 1) return 1;
    if (e <= 0) return 0;
    if (ssc_pulseNormalize == 1) {
        ssc_pulseNormalize /= ssc_pulse_(1)
    }
    return ssc_pulse_(e)
}

var ssc_framerate = 150;
var ssc_animtime = 500;
var ssc_stepsize = 150;
var ssc_pulseAlgorithm = true;
var ssc_pulseScale = 6;
var ssc_pulseNormalize = 1;
var ssc_keyboardsupport = true;
var ssc_arrowscroll = 50;
var ssc_frame = false;
var ssc_direction = {
    x: 0,
    y: 0
};

var ssc_initdone = false;
var ssc_fixedback = true;
var ssc_root = document.documentElement;
var ssc_activeElement;
var ssc_key = {
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    spacebar: 32,
    pageup: 33,
    pagedown: 34,
    end: 35,
    home: 36
};

var ssc_que = [];
var ssc_pending = false;
var ssc_cache = {};

setInterval(function() {
    ssc_cache = {}
}, 10 * 1e3);

var ssc_uniqueID = function() {
    var e = 0;
    return function(t) {
        return t.ssc_uniqueID || (t.ssc_uniqueID = e++)
    }
}();

var ischrome = /chrome/.test(navigator.userAgent.toLowerCase());

if (ischrome) {
    ssc_addEvent("mousedown", ssc_mousedown);
    ssc_addEvent("mousewheel", ssc_wheel);
    ssc_addEvent("load", ssc_init)
}



$(document).ready(function() {
    $('[data-toggle="popover"]').popover();
});
