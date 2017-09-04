/*
 * jQuery Character Counter plugin
 * 
 * @author Mark Embling
 * 
 * Copyright © Mark Embling 2017
 * Released under the MIT license
 * https://github.com/markembling/jquery-charactercounter-plugin/blob/master/LICENSE
 */

;(function ($) {

    var CharacterCounter = function (element, options) {
        this.options = null;
        this.$inputElement = null;
        this.$counterElement = null;

        this.init(element, options);
    }

    CharacterCounter.DEFAULTS = {
        elementClass: "me-character-counter",
        validClass: "me-character-counter_valid",
        invalidClass: "me-character-counter_invalid",
        maxChars: Infinity,                 // Maximum allowed characters
        minChars: 0,                        // Minimum allowed characters
        counterElement: null,               // Element to use for counter. If null, creates one.
        positiveOverruns: false,            // if true, overruns will be positive not negative
        newLinesAsTwoChars: true,           // Specifically count newlines as two characters rather than
                                            // relying on the browser's count.
        postCountMessage: null,             // string shown after count (e.g. "characters left")
        preCountMessage: null,              // string shown before count (e.g. "you have")
        postCountMessageSingular: null,     // as postCountMessage, for single case
        preCountMessageSingular: null,      // as preCountMessage, for single case
        zeroRemainingMessage: null,         // message shown when 0 chars remain
        overrunPostCountMessage: null,      // as postCountMessage, when text overruns allowed count
        overrunPreCountMessage: null,       // as preCountMessage, when text overruns allowed count
        overrunPostCountMessageSingular: null,      
        overrunPreCountMessageSingular: null 
    };

    CharacterCounter.prototype.init = function (element, options) {
        this.$inputElement = $(element);
        this.options = $.extend({}, CharacterCounter.DEFAULTS, options, this.getDataOptions());

        // Set up counter element
        if (this.options.counterElement === null) {
            this.$counterElement = $(document.createElement('div'));
            this.$inputElement.after(this.$counterElement);
        } else {
            this.$counterElement = $(this.options.counterElement);
        }
        this.$counterElement.addClass(this.options.elementClass);
        this._onInput();

        // Event handlers
        var bindTo = this.getEventNames().join(' ');
        this.$inputElement.bind(bindTo, $.proxy(this._onInput, this));
    };

    CharacterCounter.prototype.getEventNames = function() {
        var eventNames = ["change", "keyup"];
        if ('oninput' in document.createElement('input'))
            eventNames.push("input");
        return eventNames;
    };

    CharacterCounter.prototype.getDataOptions = function() {
        var keys = Object.keys(CharacterCounter.DEFAULTS);
        var dataOptions = {};
        for (var i = 0; i < keys.length; i++) {
            var dataVal = this.$inputElement.data(keys[i]);
            if (typeof dataVal !== "undefined") {
                dataOptions[keys[i]] = dataVal;
            }
        }
        return dataOptions;
    };

    /**
     * Determine if the character counter is in a valid state (i.e. the number of characters entered
     * is within the min/max specified for this counter.
     * @returns {boolean}
     */
    CharacterCounter.prototype.isValid = function () {
        var charsUsed = this.countCharactersUsed();
        var charsRemaining = this.options.maxChars - charsUsed;
        return charsRemaining >= 0 && charsUsed >= this.options.minChars;
    };

    /**
     * Get the value for the named option.
     * @param {string} option - Option name
     * @returns The option value
     */
    CharacterCounter.prototype.getOption = function (option) {
        return this.options[option];
    };

    CharacterCounter.prototype.countCharactersUsed = function () {
        var text = this.$inputElement.val();
        var charsUsed = text.length;

        // Find all newlines. We need to count them and add that number to the 
        // total, as all newlines should always be counted as two characters
        // owing to the fact they must be transmitted as \r\n according to the
        // HTTP spec. Solution from http://stackoverflow.com/a/17462078/6844
        var newLines = text.match(/(\r\n|\n|\r)/g);
        var newLineAddition = 0;
        if (newLines != null) {
            newLineAddition = newLines.length;
        }

        return charsUsed + newLineAddition;
    };

    CharacterCounter.prototype._onInput = function () {
        var valid = this.isValid();
        var charsUsed = this.countCharactersUsed();
        var charsRemaining = this.options.maxChars - charsUsed;

        var message = this.calculateMessage(charsUsed, charsRemaining);

        this.setText(message);
        this.setValidityClass(valid);
    };

    CharacterCounter.prototype.calculateMessage = function(used, remaining) {
        var preMessage = "";
        var postMessage = "";

        // Zero characters remaining
        if (remaining === 0 && this.options.zeroRemainingMessage !== null) {
            return this.options.zeroRemainingMessage;
        }

        // Before the remaining count
        if (remaining >= 0 && this.options.preCountMessage !== null) {
            preMessage = this.options.preCountMessage;
            if (remaining === 1 && this.options.preCountMessageSingular !== null) {
                preMessage = this.options.preCountMessageSingular;
            } 
        } else if (remaining < 0 && this.options.overrunPreCountMessage !== null) {
            preMessage = this.options.overrunPreCountMessage;
            if (remaining === -1 && this.options.overrunPreCountMessageSingular !== null) {
                preMessage = this.options.overrunPreCountMessageSingular;
            }
        }
        
        // After the remaining count
        if (remaining >= 0 && this.options.postCountMessage !== null) {
            postMessage = this.options.postCountMessage;
            if (remaining === 1 && this.options.postCountMessageSingular !== null) {
                postMessage = this.options.postCountMessageSingular;
            }
        } else if (remaining < 0 && this.options.overrunPostCountMessage !== null) {
            postMessage = this.options.overrunPostCountMessage;
            if (remaining === -1 && this.options.overrunPostCountMessageSingular !== null) {
                postMessage = this.options.overrunPostCountMessageSingular;
            }
        }

        // Flip negative to positive if needed
        if (remaining < 0 && this.options.positiveOverruns) remaining *= -1;
        if (preMessage.length > 0) preMessage += " ";
        if (postMessage.length > 0) postMessage = " " + postMessage;

        return preMessage + remaining + postMessage;
    };

    CharacterCounter.prototype.setText = function(message) {
        this.$counterElement.text(message);
    };

    CharacterCounter.prototype.setValidityClass = function(valid) {
        if (valid) {
            this.$counterElement.addClass(this.options.validClass)
                                .removeClass(this.options.invalidClass);
        } else {
            this.$counterElement.addClass(this.options.invalidClass)
                                .removeClass(this.options.validClass);
        }
    };


    //
    // jQuery plugin
    //

    $.fn.characterCounter = function (opt) {
        /**
         * Initialises a character counter for the given element if one is not already
         * assigned, then returns the counter.
         * @param {object} element - DOM element
         * @returns {CharacterCounter} The character counter associated with the element
         */
        function initCharacterCounterForElement(element) {
            var $element = $(element);
            var cr = $element.data("markembling.characterCounter");
            if (!cr) {
                var options = typeof opt == 'object' && opt;
                cr = new CharacterCounter($element, options);
                $element.data("markembling.characterCounter", cr);
            }
            return cr;
        };

        // If the first argument is a string, then this is a function call.
        // Ensure the character counter is initialised, and then call the function (if available),
        // returning the result.
        if (typeof arguments[0] == "string") {
            var funcName = arguments[0];
            var funcArgs = Array.prototype.slice.call(arguments, 1);
            var returnValue;

            this.each(function() {
                var cr = initCharacterCounterForElement(this);
                if (typeof cr[funcName] === "function") {
                    returnValue = cr[funcName](funcArgs);
                } else {
                    throw new Error("No function named " + funcName + " exists.");
                }
            });

            return returnValue !== undefined ? returnValue : this;
        }

        // If this is not a function call, just initialise the character counter and return the
        // result of this.each, in typical jQuery plugin fashion.
        return this.each(function () {
            initCharacterCounterForElement(this);
        });
    };
}(jQuery));
