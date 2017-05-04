# jQuery Character Counter Plugin

This plugin provides the ability to associate a character counter with a text area.

## Install

Install either via Bower:

    bower install jquery-charactercounter-plugin

Or by downloading the `jquery.charactercounter.js` file directly and placing in your chosen location.

## Usage

After including the plugin, use it by initialising it on the textarea(s) you wish to add character counting for.

    <textarea id="example1"></textarea>

    $('#example1').characterCounter();

By default, this will create a new `div` element following the text area which will show the character count for that textbox.

### Providing a minimum and maximum character count

TODO - description of applying a min/max character count to affect validity

<!--
After including the plugin, use it by first adding some data attributes to your textarea and adding an element which will serve as the container for your counter. Your counter element can be anything you like and styled however you like, with other classes and so on. The content will be updated using jQuery's `text()` method.

    <textarea id="example1"
              data-max-chars="200"
              data-counter-element="#example1-counter"></textarea>
    <span id="example1-counter"></span>

Then just initialise the plugin, passing it any appropriate options if you wish to customise the behaviour beyond the defaults. See below for all available options.

    $('#example1').characterCounter();

    $('#example2').characterCounter({
        postCountMessage: "characters left",
        postCountMessageSingular: "character left",
        zeroRemainingMessage: "No characters left",
        overrunPreCountMessage: "Please remove",
        overrunPostCountMessage: "characters",
        overrunPostCountMessageSingular: "character",
        positiveOverruns: true
    });
-->

By default, the classes applied by the plugin will be as follows but you can customise these to any classes you wish (see options below).

| State | Class
| ----- | -----
| Character count element (always applied) | `me-character-counter`
| Valid modifier - i.e. count is within any set minimum and maximums | `me-character-counter_valid`
| Invalid modifier - i.e. count is outside any set minimum and maximums | `me-character-counter_valid`

### Move and customise the character counter

You can use any element on your page as the character counter instead of having the plugin create one for you. Simply create the character counter and provide a selector to the plugin using the `counterElement` option (see below for full details of options and specifying options).

    <span id="example2-count"></span>
    <textarea id="example2"
              data-counter-element="#example2-count"></textarea>
    
    $('#example2').characterCounter();

The element can be anything, the plugin will simply use jQuery's `text()` method to swap out the contents with the appropriate count and message. It will also add/switch out the element's classes according to the validity of the entered text when compared to the counter. You can style the classes however you wish to get the behaviour you're looking for, and you can apply any of your own classes in addition if you wish - the plugin will not touch those.

## Options

These options can be specified to customise the behaviour of the character counter. The default values are also given below.

| Option | Description | Default
| ------ | ----------- | -------
| `elementClass` | Class assigned to the character count element. | `"me-character-counter"`
| `validClass` | Class applied to the character counter (in addition to the `elementClass` value) when it is in a valid state. | `"me-character-counter_valid"`
| `invalidClass` | Class applied to the character counter (in addition to the `elementClass` value) when it is in an invalid state. | `"me-character-counter_invalid"`
| `maxChars` | Maximum allowed characters before being considered invalid. | `Infinity`
| `minChars` | Minimum number of characters allowed before being considered invalid. | `0` 
| `counterElement` | Element to use for the character counter. If `null`, one is created. | `null`
| `positiveOverruns` | Whether or not overruns should be counted positive rather than negative. | `false`
| `newLinesAsTwoChars` | Whether newlines (`\r`, `\n` and `\r\n`) always be counted as two characters. | `true`
| `postCountMessage` | String shown after character count (e.g. "characters left"). | `null`
| `preCountMessage` | String shown before character count (e.g. "you have"). | `null`
| `postCountMessageSingular` | Same as `postCountMessage` but for the singular case. If not provided, `postCountMessage` will be used. | `null`
| `preCountMessageSingular` | Same as `preCountMessage` but for the singular case. If not provided, `preCountMessage` will be used. | `null`
| `zeroRemainingMessage` | Message shown when 0 characters remain (e.g. "No characters left"). If not set, zero is treated just like any other number. | `null`
| `overrunPostCountMessage` | Same as `postCountMessage` but used once the user has ran over the allocated character count. | `null`
| `overrunPreCountMessage` | Same as `preCountMessage` but used once the user has ran over the allocated character count. | `null`
| `overrunPostCountMessageSingular` | Same as `overrunPostCountMessage` but for the singular case. If not provided, `overrunPostCountMessage` will be used. | `null`
| `overrunPreCountMessageSingular` | Same as `overrunPreCountMessage` but for the singular case. If not provided, `overrunPreCountMessage` will be used. | `null`

Options can be specified in one of two ways:

 1. Using an object when initialising the plugin
 2. Via data attributes

 Both approaches may be used together but in the event an option is specified both in the options object and as a data attribute, note that the data attribute will take precedence.

### Specifying options via object

You can provide any of the options shown in the table above in an object which should be passed when initialising the plugin.

    $('#example-opts-obj').characterCounter({
        postCountMessage: "characters left",
        postCountMessageSingular: "character left",
        zeroRemainingMessage: "No characters left",
        overrunPreCountMessage: "Please remove",
        overrunPostCountMessage: "characters",
        overrunPostCountMessageSingular: "character",
        positiveOverruns: true
    });

### Specifying options via data attributes

Options can be provided as data attributes on the textarea being initialised. These should all be in the format `data-{option}` where `{option}` is the option name from the table above, lowercased and with words separated with dashes.

    <textarea id="example-opts-data"
              data-max-chars="200"
              data-counter-element="#counter"
              data-positive-overruns="true></textarea>
