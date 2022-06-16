### Simple and fast CLI args parser for Node

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
        requires: ['output'] //dependent parameters
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

#### Example Info/Error:
```bash
> node cli.js --file

[!] The paramater '--file' is not a string.

Usage: myapp.js <command>

--file/-f [required]              Another helpful message   

--output/-o [required]            A helpful message

```

