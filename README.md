# fruitmachine-media

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
      setup: function() {
        // Run small setup logic
      },
      teardown: function() {
        // Run small teardown logic
      }
    },
    large: {
      setup: function() {
        // Run large setup logic
      },
      teardown: function() {
        // Run large teardown logic
      }
    }
  }
});
```

## Author

- **Wilson Page** - [@wilsonpage](http://github.com/wilsonpage)

## Contributors

- **Matt Andrews** - [@matthew-andrews](http://github.com/matthew-andrews)

## License
Copyright (c) 2014 The Financial Times Limited
Licensed under the MIT license.

## Credits and collaboration

All open source code released by FT Labs is licenced under the MIT licence. We welcome comments, feedback and suggestions. Please feel free to raise an issue or pull request. Enjoy...
