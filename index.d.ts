export declare function getArgs(
/**
 * Optional parameters object
 */
options?: {
    [arg: string]: {
        default?: boolean;
        required?: boolean;
        /**
         * Default any
         */
        type?: "string" | "number" | "json" | "any";
        /**
         * Help message
         */
        help?: string;
        /**
         * Alias name, can be a one letter
         */
        alias?: string;
        /**
         * Requires other parameters?
         */
        requires?: string[];
    };
}, 
/**
 * Specify a different args string (default: process.argv.join(' '))
 */
args?: string, 
/**
 * Exit if none of the parameters specified was found.
 */
allowZero?: boolean): {
    [arg: string]: any;
};
export default getArgs;
