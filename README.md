### Parse CLI args for node

### Install
`npm i getarg`

#### Basic usage:
```javascript
import getArgs from 'getarg';

//Run without any options to get an object of all args supplied at runtime
const args = getArgs({
    file:{
        required: true,
        type: "string",
        help: "A helpful message",
        requires: ['output']
        alias: "f"
    }
    output:{
        help: "Another helpful message",
        required: true,
        type: "string", //supported: number/json/any
        alias: "o",
    }
},{
    usage: "Usage: myapp.js <command>" //customize help header
});

console.log(args);
```

#### Example Run
```bash
> node cli.js -f ./file.js --output=./out.js

{
    file: "./file.js",
    output: "./out.js"
}

```

#### Example Help:
```bash
> node cli.js

The paramater '--file' is required.

The paramater '--output' is required.

Usage: myapp.js <command>


--file/-f [required]            Another helpful message   

--output/-o [required]            A helpful message

```

