"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getArgs(
/**
 * Optional parameters object
 */
parameters, options) {
    options = options || {};
    const _args = options.args || process.argv.join(' ');
    const regex = /\s+(?<name>--?[a-zA-Z_0-9]+)(?:(?:=|\s(?!-))(?<value>(?:\{\"(?!.*--).*\})|[a-z0-9_A-Z\\\/\[\]\:\?\<\>\|\"\'\+\$\#\!\@\%\^\&\*\(\)\{\}\.\,\_\-]+))?/gmi;
    const params = Array.from(_args.matchAll(regex)).reduce((o, v, i) => {
        var _a, _b, _c, _d, _e;
        return (((_a = v === null || v === void 0 ? void 0 : v.groups) === null || _a === void 0 ? void 0 : _a.name) ? Object.assign(Object.assign({}, o), { [v.groups.name.replace(/\-/g, '').trim()]: (_e = (_c = (_b = v === null || v === void 0 ? void 0 : v.groups) === null || _b === void 0 ? void 0 : _b.value) !== null && _c !== void 0 ? _c : (_d = parameters === null || parameters === void 0 ? void 0 : parameters[v.groups.name]) === null || _d === void 0 ? void 0 : _d.default) !== null && _e !== void 0 ? _e : true }) : o);
    }, {});
    if (parameters) {
        let helpMessage = options.usage || `\r\nAvailable options:\r\n`;
        let showError = false;
        let paramsFound = 0;
        let otherRequired = [];
        for (var parameter in parameters) {
            var parameterSettings = parameters[parameter];
            helpMessage += `\r\n--${parameter}${parameterSettings.alias ? '\\-' + parameterSettings.alias : ''} ${parameterSettings.required ? '[required]' : ''} ${parameterSettings.default ? '(default ' + parameterSettings.default + ')' : ''}                  ${parameterSettings.help || ''}`;
            if (parameterSettings.alias && params[parameterSettings.alias]) {
                params[parameter] = params[parameterSettings.alias];
            }
            if ((parameterSettings.required || otherRequired.includes(parameter)) && !params[parameter]) {
                showError = true;
                console.error(`\r\nThe paramater '--${parameter}' is required.`);
                continue;
            }
            if (!params[parameter]) {
                continue;
            }
            paramsFound++;
            if (parameterSettings.requires) {
                otherRequired = [...otherRequired, ...parameterSettings.requires];
            }
            if (parameterSettings.type == "string" && typeof params[parameter] !== "string") {
                showError = true;
                console.error(`\r\nThe paramater '--${parameter}' is not a string.`);
                continue;
            }
            if (parameterSettings.type == "number") {
                params[parameter] = Number(params[parameter]);
                if (isNaN(params[parameter])) {
                    showError = true;
                    console.error(`\r\nThe paramater '--${parameter}' is not a number.`);
                    continue;
                }
            }
            if (parameterSettings.type == "json") {
                try {
                    if (typeof params[parameter] == "boolean") {
                        throw new Error("");
                    }
                    params[parameter] = JSON.parse(params[parameter]);
                }
                catch (e) {
                    showError = true;
                    console.error(`\r\nThe paramater '--${parameter}' is not a valid JSON object.`);
                    continue;
                }
            }
        }
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
