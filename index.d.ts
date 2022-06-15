declare const getArgs: (options?: {
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
}, allowZero?: boolean) => {};
export { getArgs };
export default getArgs;
