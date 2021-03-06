/*
 *
 * Sections modules
 *
 * @author Alexey Ostrovsky
 *
 * */

define(["jquery", "modules/module"], function ($, module) {

    function Sections() {
        var _this = this;

        this.sections = [];

        $(function(){
            _this.scanDOM();
        });
    }

    /* наследуем от Module */
    Sections.prototype = module.createInstance();
    Sections.prototype.constructor = Sections;

    Sections.prototype.scanDOM = function () {
        var _this = this;
        $("." + this.getOptions().sectionClass).each(function (index, elem) {
            var section = $(elem);
            var headerElement = section.find("h2:first");

            var sect = {
                num: index + 1,
                id: _this.setSectionId(section, index + 1),
                caption: headerElement.text(),
                sectionElement: section,
                headerElement: headerElement
            };

            _this.addSection(sect);
        });

        return this.getSections();
    };

    Sections.prototype.getSections = function () {
        return this.sections;
    };

    Sections.prototype.addSection = function (sec) {
        return this.sections.push(sec);
    };

    Sections.prototype.getQuantity = function () {
        return this.getSections().length;
    };

    /* если нет ID, добавляем */
    Sections.prototype.setSectionId = function (section, id) {
        var newID = id;
        if (section.attr('id') != undefined) {
            newID = section.attr('id');
        } else {
            section.attr('id', newID);
        }

        return newID;
    };

    return new Sections();
});