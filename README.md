### Parse ARGS for node

#### Basic usage:
```javascript
import getArgs from 'darg';

const args = getArgs({
    output:{
        help: "A helpful message",
        required: true,
        type: "string", //supported: number/json/any
        alias: "o",
    }
});


//call from cmd: node app.js --output=test.js

output = args.output;

```

#### Get all args:
```javascript
import getArgs from 'darg';

const args = getArgs();

//an object containing all passed args

```