"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const regex = /\s+(?<name>--?[a-zA-Z_0-9]+)(?:(?:=|\s(?!-))(?<value>(?:\{\"(?!.*--).*\})|(?:\[(?!.*--).*\])|[a-z0-9_A-Z\\\/\[\]\:\?\<\>\|\"\'\+\$\#\!\@\%\^\&\*\(\)\{\}\.\,\_\-]+))?/gmi;
const checkType = (value, type) => {
    if (type == "string" && typeof value !== "string") {
        throw new Error("Not a string");
    }
    if (type == "number") {
        value = Number(value);
        if (isNaN(value)) {
            throw new Error("Not a number");
        }
    }
    if (type == "json") {
        if (typeof value == "boolean") {
            throw new Error("");
        }
        value = JSON.parse(value);
    }
    if (type == "boolean") {
        value = !value || /false|0/gi.test(value) ? false : true;
    }
    return value;
};
function getArgs(
/**
 * Optional parameters object
 */
parameters, options) {
    options = options || {};
    const _args = options.args || process.argv.join(' ');
    const params = Array.from(_args.matchAll(regex)).reduce((o, v, i) => {
        var _a, _b, _c, _d, _e;
        return (((_a = v === null || v === void 0 ? void 0 : v.groups) === null || _a === void 0 ? void 0 : _a.name) ? Object.assign(Object.assign({}, o), { [v.groups.name.replace(/\-/g, '').trim()]: (_e = (_c = (_b = v === null || v === void 0 ? void 0 : v.groups) === null || _b === void 0 ? void 0 : _b.value) !== null && _c !== void 0 ? _c : (_d = parameters === null || parameters === void 0 ? void 0 : parameters[v.groups.name]) === null || _d === void 0 ? void 0 : _d.default) !== null && _e !== void 0 ? _e : true }) : o);
    }, {});
    if (parameters) {
        let helpMessage = '\r\n\u001b[0;94m' + (options.usage || `Available options:`) + "\u001b[0m\r\n";
        let showError = false;
        let paramsFound = 0;
        let otherRequired = [];
        for (var parameter in parameters) {
            var parameterSettings = parameters[parameter];
            var isDefault = false;
            var helpMessageHead = `--${parameter}${parameterSettings.alias ? ' | -' + parameterSettings.alias : ''} ${parameterSettings.required ? '\u001b[0;31m[required]\u001b[0m' : ''} ${parameterSettings.default ? '(default ' + parameterSettings.default + ')' : ''}`;
            helpMessage += `\r\n${helpMessageHead}${' '.repeat(50 - helpMessageHead.length + (parameterSettings.required ? 11 : 0))}${parameterSettings.help || ''}\r\n`;
            if (parameterSettings.alias && params[parameterSettings.alias]) {
                params[parameter] = params[parameterSettings.alias];
                delete params[parameterSettings.alias];
            }
            if (parameterSettings.hasOwnProperty('default') && !params[parameter]) {
                params[parameter] = parameterSettings.default;
                isDefault = true;
            }
            if ((parameterSettings.required || otherRequired.includes(parameter)) && !params.hasOwnProperty(parameter)) {
                showError = true;
                continue;
            }
            if (!params[parameter]) {
                continue;
            }
            if (!isDefault) {
                paramsFound++;
            }
            if (parameterSettings.requires) {
                otherRequired = [...otherRequired, ...parameterSettings.requires];
            }
            try {
                params[parameter] = checkType(params[parameter], parameterSettings.type);
            }
            catch (err) {
                console.error(`\r\n\u001b[0;33m[!] The paramater '--${parameter}' is not a ${parameterSettings.type}.`);
                showError = true;
            }
        }
        otherRequired.map((o) => {
            if (!params[o]) {
                showError = true;
                console.error(`\r\n\u001b[0;33m[!] The paramater '--${o}' is also required.\u001b[0m`);
            }
        });
        if (!paramsFound && !options.allowZero) {
            showError = true;
        }
        if (showError) {
            console.info(helpMessage);
            process.exit();
        }
    }
    return params;
}
module.exports = getArgs;
exports.default = getArgs;
