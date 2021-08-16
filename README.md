# fruitmachine-media [![Build Status](https://api.travis-ci.com/ftlabs/fruitmachine-media.svg)](https://travis-ci.com/ftlabs/fruitmachine-media)

FruitMachine helper that allows different setup and teardown callbacks to be called based on media queries.  If asychronous logic is needed to be run within a `teardown` or `setup` callback, return a promise.

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
      setup: function(options) {
        // Run small setup logic
      },
      teardown: function(options) {
        // Run small teardown logic
      }
    },
    large: {
      setup: function(options) {
        // Run large setup logic

        // If asychronous logic needs to be run:-
        //
        // var promise = new Promise();
        // doAsyncStuff(function() {
        //   promise.resolve();
        // });
        // return promise;
      },
      teardown: function(options) {
        // Run large teardown logic
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
