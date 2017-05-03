(function ($) {
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
        var charsUsed = this.countCharactersUsed();
        var charsRemaining = this.options.maxChars - charsUsed;

        var valid = charsRemaining >= 0 && charsUsed >= this.options.minChars;
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
        return this.each(function () {
            var $this = $(this);

            // Check and set the character counter instance
            var cr = $this.data("markembling.characterCounter");
            if (!cr) {
                var options = typeof opt == 'object' && opt;
                cr = new CharacterCounter(this, options);
                $this.data("markembling.characterCounter", cr);
            }

            // Invoke the action, if any
            if (typeof opt == "string") {
                cr[opt]();
            }
        });
    };
}(jQuery));
