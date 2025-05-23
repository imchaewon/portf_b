(function() {
    /**
     * animateInViewport
     *
     * @description           Trigger animation as user scrolls down the page
     *
     * [data-animation]: Type of the animation. References are available in ../scss/_animation.scss
     * [data-animation-delay]: Delay before start of the animation. 100 to 2000, in miliseconds
     * [data-animation-duration]: Duration of the animation. 100 to 2000, in miliseconds
     */
    (function animateInViewport(targetElements) {
        
        "use strict";

        // elements to animate
        var targets = [];

        // default configuration
        var defaults = {
            offset: 200,
            classes: {
                isInit: "is-init",
                isAnimated: "is-animated"
            }
        };

        // store target elements and their settings into `targets` variable
        targets = prepare();

        // re-calculate position when user resizes window
        window.addEventListener("resize", prepare);

        // on resources loaded,
        window.addEventListener("load", function() {

            // disable the whole function on mobile devices and ie8-
            if (isException()) {
                destroyPreloadLayer(); // destroy preloader
            } else {
                setTimeout(startAnimation, 200); // show throbber explicitely for 0.2s then start the animation
            }
            
        });

        // Map target elements and store their settings into an array
        // @return {Array}    Array containing target elements and their settings
        function prepare() {
            var arr = [];
            var i = 0;
            var len = targetElements.length;
            var item, offset;

            for (; i < len; i++) {
                item = {};

                item.node = targetElements[i];
                offset = item.node.hasAttribute("data-animation-offset") ? parseInt(item.node.getAttribute("data-animation-offset")) : defaults.offset;
                item.position = getOffsetY(item.node) + offset;

                arr.push(item);                
            }

            function getOffsetY(el) {
                var y = 0;

                do {
                    if (!isNaN(el.offsetTop)) {
                        y += el.offsetTop;
                    }
                    el = el.offsetParent;
                } while(el);

                return y;
            }

            return arr;
        }

        // Check user agent and if necessary, exit the plugin
        // @return {Boolean}    Whether user agent is an exception
        function isException() {
            var check = false;

            // IE 9-
            if (document.documentMode < 10) check = true;

            // Mobile devices
            (function(agent) {
                if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(agent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(agent.substr(0, 4))) {
                    check = true;
                }
            })(navigator.userAgent || navigator.vendor || window.opera);

            return check;
        }

        // Run animation on page load
        // @return {undefined}
        function startAnimation() {
            targets.forEach(function(target) {
                target.node.classList.add(defaults.classes.isInit);
            });

            destroyPreloadLayer(); // hide throbber
            animateOnScroll(); // trigger animation on currently visible elements

            window.addEventListener("scroll", animateOnScroll); // watch scroll event and trigger animation
        }

        // Hide "loading" throbber layer
        // @return {undefined}
        function destroyPreloadLayer() {
            var layer = document.getElementById("preload");
            var opacity = 1;
            var interval = 1 / 8;

            function animate() {
                opacity -= interval;

                if (opacity > 0) {
                    layer.style.opacity = opacity;
                    window.requestAnimationFrame(animate);
                } else {
                    layer.removeAttribute("style");
                    document.body.classList.add("ready"); // hide throbber behind the main content
                }
            }

            animate();
        }

        // Trigger animation while scrolling
        // @return {undefined}
        function animateOnScroll() {
            var scrollY = window.pageYOffset + window.innerHeight;
            var i = targets.length;

            while (i--) {
                triggerAnimation(targets[i], scrollY);
            }

            function triggerAnimation(target) {
                if (target.node.classList.contains(defaults.classes.isAnimated)) {
                    return;
                } else if (scrollY > target.position) {
                    console.log(target, scrollY);
                    target.node.classList.add(defaults.classes.isAnimated);
                }
            }
        }

    })(document.querySelectorAll("[data-animation]"));

    /**
     * rAF.js
     * requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
     * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
     * http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
     */
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];

    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                    || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(
                function() {
                    callback(currTime + timeToCall);
                },
                timeToCall
            );
            lastTime = currTime + timeToCall;
            return id;
        };       
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
    // end of rAF.js


})();