# jQuery Character Counter Plugin

This jQuery plugin provides the ability to associate a character counter with a text area and includes the ability to customise the style and wording of the counter, along with rules for validity.

## Install

### Package Managers

You can install the plugin using NPM or Bower.

    npm install jquery-charactercounter-plugin
    bower install jquery-charactercounter-plugin

### Manually

If you'd prefer to install manually, download and include the `jquery.charactercounter.js` file in your project.

    <script src="jquery.charactercounter.js"></script>

Ensure jQuery is also available and included before the plugin JS file.

## Usage

After including the plugin, use it by initialising it on the textarea(s) you wish to add character counting for.

    <textarea id="example1"></textarea>

    $('#example1').characterCounter();

The plugin can also be initialised on any number of textareas in one go.

    <textarea class="counted"></textarea>
    <textarea class="counted"></textarea>
    <textarea class="counted"></textarea>

    $('.counted').characterCounter();

By default, the plugin will create a new `div` element itself immediately following the textarea which will show the character count for that input.

### Providing a minimum and maximum character count

The plugin supports the idea of having a minimum and/or maximum character count which the user ought to provide. These can be provided using the `minChars` and `maxChars` options.

    <!-- Twitter-style 140 character limit -->
    <textarea id="example-twitter" data-max-chars="140"></textarea>

    <!-- Minimum and maximum limits (from 200 to 600 chars) -->
    <textarea id="example-minmax"
              data-min-chars="200"
              data-max-chars="600"></textarea>
    
    <!-- At least 200 chars -->
    <textarea id="example-minimum" data-min-chars="200"></textarea>

By default, the minimum is zero and the maximum is infinite, so it will never fall outside the valid state.

### Adding text to the counter

You can add text to the counter, both before the number and after.

    $('#example-text').characterCounter({
        maxChars: 200,
        postCountMessage: "characters left",
        postCountMessageSingular: "character left",
        zeroRemainingMessage: "No characters left",
        overrunPreCountMessage: "Please remove",
        overrunPostCountMessage: "characters",
        overrunPostCountMessageSingular: "character",
        positiveOverruns: true
    });

This example will give the following behaviour:

 - "200 characters left" when empty
 - "150 characters left" when filled below the maximum
 - "No characters left" when exactly 200 characters have been entered
 - "Please remove 15 characters" when filled with 215 characters
 - In both the valid and invalid states, singular options have been given to prevent messages like "1 characters left"

See the options section below for full details on what options are available, specifying options via object and data attributes, and default option values.

### Customize the character counter element

#### Styling

The plugin applies some classes which you're able to target in your CSS to make the counter look how you wish. By default, the classes applied by the plugin will be as shown in this table but you can customise these to any class names you wish (see options section below).

| State | Class
| ----- | -----
| Character count element (always applied) | `me-character-counter`
| Valid modifier - i.e. count is within any set minimum and maximums | `me-character-counter_valid`
| Invalid modifier - i.e. count is outside any set minimum and maximums | `me-character-counter_invalid`

The plugin will not add any styling of its own, and simply swaps out the classes depending on its state. Style however you like.

#### Use a different element

You can use any element on your page as the character counter instead of having the plugin create one for you. Simply create the character counter and provide a selector to the plugin using the `counterElement` option (see below for full details of options and specifying options).

    <!-- This could be anywhere on the page; it doesn't have to be nearby -->
    <span id="example2-count"></span>
    <textarea id="example2"
              data-counter-element="#example2-count"></textarea>

The element can be anything, the plugin will simply use jQuery's `text()` method to swap out the contents with the appropriate count and message. It will also add/switch out the element's classes according to the validity of the length of the entered text however you can apply any of your own classes to your counter element in addition if you wish - the plugin will not interfere with those.

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

### Specifying options

Options can be specified in one of two ways:

 1. Using an object when initialising the plugin
 2. Via data attributes

 Both approaches may be used together but in the event an option is specified both in the options object and as a data attribute, note that the data attribute will take precedence.

#### Via object

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

#### Via data attributes

Options can be provided as data attributes on the textarea being initialised. These should all be in the format `data-{option}` where `{option}` is the option name from the table above, lowercased and with words separated with dashes.

    <textarea id="example-opts-data"
              data-max-chars="200"
              data-counter-element="#counter"
              data-positive-overruns="true></textarea>

## Methods

These methods can be called via the jQuery plugin. These are useful if, for example, you need to obtain the current state of the counter from your own code.

| Function | Description | Arguments
| ------ | ----------- | -------
| `isValid` | Determines whether or not the counter is in the 'valid' state. | `(none)`
| `getOption` | Provides the means to retrieve option values from the counter. | `option` (`string`) - The required option.

### Calling methods

Methods can be called by passing them in as the first argument to the `characterCounter` function. Method arguments can be provided as subsequent arguments.

    var ... = $('#example-text').characterCounter('isValid');
    var ... = $('#example-text').characterCounter('getOption', 'maxChars');

Note that when methods are called, the return value from the method (if any) will be given and further calls to the plugin or jQuery may not be chained.
