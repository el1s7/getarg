declare function getArgs(
/**
 * Optional parameters object
 */
parameters?: {
    [arg: string]: {
        default?: boolean;
        required?: boolean;
        /**
         * Default any
         */
        type?: "string" | "number" | "json" | "boolean" | "any";
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
}, options?: {
    /**
     * Usage header message
     */
    usage?: string;
    /**
     * Specify a different args string (default: process.argv.join(' '))
     */
    args?: string;
    /**
     * Exit if none of the parameters specified was found. (default: true)
     */
    allowZero?: boolean;
}): {
    [arg: string]: any;
};
export default getArgs;
