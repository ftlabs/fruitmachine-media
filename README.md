# fruitmachine-media [![Build Status](https://travis-ci.org/ftlabs/fruitmachine-media.svg?branch=master)](https://travis-ci.org/ftlabs/fruitmachine-media)

FruitMachine helper that allows different setup and teardown callbacks to be called based on media queries.

## Example usage

```js
var fm = require('fruitmachine');

fm.define({
  name: 'passionfruit',

  template: function() {
    // Normal fruitmachine template method
  },

  helpers: [
    require('fruitmachine-media')
  ],

  media: {
    '(max-width: 699px), (max-height: 699px)': 'small',
    '(min-width: 700px) and (min-height: 700px)': 'large'
  },

  states: {
    small: {
      setup: function(options, callback) {
        // Run small setup logic
        callback(error);
      },
      teardown: function(options, callback) {
        // Run small teardown logic
        callback(error);
      }
    },
    large: {
      setup: function(options, callback) {
        // Run large setup logic
        callback(error);
      },
      teardown: function(options, callback) {
        // Run large teardown logic
        callback(error);
      }
    }
  }
});
```

## License
Copyright (c) 2014 The Financial Times Limited
Licensed under the MIT license.

## Credits and collaboration

- **Wilson Page** - [@wilsonpage](http://github.com/wilsonpage)
- **Matt Andrews** - [@matthew-andrews](http://github.com/matthew-andrews)
- **Ada Rose Edwards** - [@adaroseedwards](http://github.com/adaroseedwards)

All open source code released by FT Labs is licenced under the MIT licence. We welcome comments, feedback and suggestions. Please feel free to raise an issue or pull request.
