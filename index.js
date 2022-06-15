"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArgs = void 0;
const getArgs = (
/**
 * Optional parameters object
 */
options, 
/**
 * Exit if none of the parameters specified was found.
 */
allowZero = false) => {
    const args = process.argv.join(' ');
    const regex = /\s+(?<name>--?[a-zA-Z_0-9]+)(=(?<value>(?:\{\"(?!.*--).*\})|[a-z0-9_A-Z\\\/\[\]\:\?\<\>\|\"\'\+\$\#\!\@\%\^\&\*\(\)\{\}\.\,\_\-]+))?/gmi;
    const params = Array.from(args.matchAll(regex)).reduce((o, v, i) => {
        var _a, _b, _c, _d, _e;
        return (((_a = v === null || v === void 0 ? void 0 : v.groups) === null || _a === void 0 ? void 0 : _a.name) ? Object.assign(Object.assign({}, o), { [v.groups.name.replace(/\-/g, '').trim()]: (_e = (_c = (_b = v === null || v === void 0 ? void 0 : v.groups) === null || _b === void 0 ? void 0 : _b.value) !== null && _c !== void 0 ? _c : (_d = options === null || options === void 0 ? void 0 : options[v.groups.name]) === null || _d === void 0 ? void 0 : _d.default) !== null && _e !== void 0 ? _e : true }) : o);
    }, {});
    if (options) {
        let helpMessage = '';
        let showError = false;
        let paramsFound = 0;
        let otherRequired = [];
        for (var option in options) {
            var optionSettings = options[option];
            helpMessage += `\r\n--${option}${optionSettings.alias ? '\\-' + optionSettings.alias : ''} ${optionSettings.required ? 'required' : ''} ${optionSettings.default ? '(default ' + optionSettings.default + ')' : ''}                  ${optionSettings.help}`;
            if (optionSettings.alias && params[optionSettings.alias]) {
                params[option] = params[optionSettings.alias];
            }
            if ((optionSettings.required || otherRequired.includes(option)) && !params[option]) {
                showError = true;
                console.error(`The paramater '--${option}' is required.`);
                continue;
            }
            if (!params[option]) {
                continue;
            }
            paramsFound++;
            if (optionSettings.requires) {
                otherRequired = [...otherRequired, ...optionSettings.requires];
            }
            if (optionSettings.type == "string" && typeof params[option] !== "string") {
                showError = true;
                console.error(`The paramater '--${option}' is not a string.`);
                continue;
            }
            if (optionSettings.type == "number") {
                params[option] = Number(params[option]);
                if (isNaN(params[option])) {
                    showError = true;
                    console.error(`The paramater '--${option}' is not a number.`);
                    continue;
                }
            }
            if (optionSettings.type == "json") {
                try {
                    params[option] = JSON.parse(params[option]);
                }
                catch (e) {
                    showError = true;
                    console.error(`The paramater '--${option}' is not a valid JSON object.`);
                    continue;
                }
            }
        }
        if (!paramsFound && !allowZero) {
            showError = true;
        }
        if (showError) {
            console.info(helpMessage);
            process.exit();
        }
    }
    return params;
};
exports.getArgs = getArgs;
exports.default = getArgs;
