define([
    "jquery",
    "modules/module",
    "modules/utils",
    "modules/browser",
    "modules/sections",
    "modules/headerFooter",
    "text!templates/nav.inc.html",
    "text!templates/navActionItem.inc.html"], function ($, module, utils, browser, sections, headerFooter, navTemplate,menuItemTemplate) {

    function InnerNavigation() {
        var _this = this;

        this.options.modulesOptions.innerNavigation = {
            NAV_UL_CLASS: 'source_main_nav_ul',
            NAV_LI_CLASS: 'source_main_nav_li',
            NAV_LINK_CLASS: 'source_main_nav_a',
            MENU__I_CLASS: 'source_main_nav_i',
            MENU_SCROLL_MOD_CLASS: '__menuScroll',
            MAIN_NAV_AC: 'source_main_nav_ac',
            MAIN_NAV_AC_TX: 'source_main_nav_ac_tx',
            RESERVED_HEIGHT: 250 // (185 + 15 + 50) px
        };

        this.menuItemTemplate = $(menuItemTemplate);
        this.container = $(navTemplate);
        $("." + _this.options.headerClass).after(this.container);

        $(function () {
            _this.injectNavigation();
            _this.calcMenuHeight();
            _this.bindEvents();
        });
    }

    InnerNavigation.prototype = module.createInstance();
    InnerNavigation.prototype.constructor = InnerNavigation;

    InnerNavigation.prototype.addMenuItem = function (text, onCallback, offCallback) {
        var newItem = this.menuItemTemplate.clone();

        newItem.find(".source_slider_frame").click(function (e) {
            e.preventDefault();

            var isEnabled = $(this).hasClass("source_slider_frame__on");
            isEnabled = !Boolean(isEnabled);

            $(this).toggleClass("source_slider_frame__on");

            if (isEnabled) {
                onCallback();
            } else {
                offCallback();
            }
        });

        newItem.find('.' + this.options.modulesOptions.innerNavigation.MAIN_NAV_AC_TX).text(text);
        $('.' + this.options.modulesOptions.innerNavigation.MAIN_NAV_AC).append(newItem);

        // recalculate height after adding new action to menu
        $(window).trigger('resize');
    };

    InnerNavigation.prototype.bindEvents = function () {
        var _this = this;

        $(window).on('resize',function () {
            _this.addMenuScrolling();
        }).trigger('resize');

        this.bindClicks();
    };

    InnerNavigation.prototype.bindClicks = function () {
        this.container.on('click', '.' + this.options.modulesOptions.innerNavigation.NAV_LINK_CLASS, function (e) {
            e.preventDefault();

            var href = $(this).attr('href');

            if ($.browser.msie && parseInt($.browser.version) === 7) {
                href = href.split('#');
                href = href[href.length - 1];
            }

            window.location.hash = href;

            var navHash = utils.parseNavHash(href);

            if (navHash != '') {
                utils.scrollToSection($(navHash));
            }
        });
    };

    InnerNavigation.prototype.calcMenuHeight = function () {
        var h = 0;

        this.container.find('.' + this.options.modulesOptions.innerNavigation.MENU__I_CLASS).each(function () {
            h += $(this).height();
        });

        return h;
    };

    InnerNavigation.prototype.injectNavigation = function () {
        var appendString = '';
        for (var i = 0; i < sections.getQuantity(); i++) {
            appendString +=
                    '<li class="' + this.options.modulesOptions.innerNavigation.NAV_LI_CLASS + '">' +
                            '<a href="#' + (sections.getSections()[i].id) + this.options.modulesOptions.innerNavigationTmp.hashSymb + '"  class="' + this.options.modulesOptions.innerNavigation.NAV_LINK_CLASS + '">' +
                            sections.getSections()[i].num + '. ' + sections.getSections()[i].caption + '</a></li>';
        }

        $('.' + this.options.modulesOptions.innerNavigation.NAV_UL_CLASS).append(appendString);
    };

    InnerNavigation.prototype.addMenuScrolling = function () {

        if (this.calcMenuHeight() + this.options.modulesOptions.innerNavigation.RESERVED_HEIGHT > $(window).height()) {
            this.container.addClass(this.options.modulesOptions.innerNavigation.MENU_SCROLL_MOD_CLASS);
        } else {
            this.container.removeClass(this.options.modulesOptions.innerNavigation.MENU_SCROLL_MOD_CLASS);
        }
    };

    return new InnerNavigation();

});