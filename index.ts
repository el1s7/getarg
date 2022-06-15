function getArgs (
	/**
	 * Optional parameters object
	 */
	parameters?: {
		[arg: string]:{
			default?: boolean,

			required?: boolean,

			/**
			 * Default any
			 */
			type?: "string" | "number" | "json" | "any",

			/**
			 * Help message
			 */
			help?: string,

			/**
			 * Alias name, can be a one letter 
			 */
			 alias?: string

			 /**
			  * Requires other parameters?
			  */
			 requires?: string[]
		}
	}, 
	options?: {
		/**
		 * Usage header message
		 */
		usage?: string,

    	/**
    	 * Specify a different args string (default: process.argv.join(' '))
    	 */
    	args?: string,

		/**
		 * Exit if none of the parameters specified was found. (default: true)
		 */
		allowZero?: boolean
	}
	
): {[arg: string]: any} {
	options = options || {};

	const _args = options.args || process.argv.join(' ');

	const regex = /\s+(?<name>--?[a-zA-Z_0-9]+)(?:(?:=|\s(?!-))(?<value>(?:\{\"(?!.*--).*\})|[a-z0-9_A-Z\\\/\[\]\:\?\<\>\|\"\'\+\$\#\!\@\%\^\&\*\(\)\{\}\.\,\_\-]+))?/gmi;
		
	const params = Array.from(_args.matchAll(regex)).reduce((o,v,i)=>(v?.groups?.name ? {
		...o,
		[v.groups.name.replace(/\-/g,'').trim()]: v?.groups?.value ?? parameters?.[v.groups.name]?.default ?? true
	} : o),{});

	if(parameters){
		let helpMessage = options.usage || `\r\nAvailable options:\r\n`;
		let showError = false;
		let paramsFound=0;
		let otherRequired: string[] = [];

		for(var parameter in parameters){
			var parameterSettings = parameters[parameter];

			helpMessage += `\r\n--${parameter}${parameterSettings.alias ? '\\-' + parameterSettings.alias : ''} ${parameterSettings.required ? '[required]': ''} ${parameterSettings.default ? '(default ' + parameterSettings.default + ')' : ''}                  ${parameterSettings.help || ''}`;

			if(parameterSettings.alias && params[parameterSettings.alias]){
				params[parameter] = params[parameterSettings.alias];
			}

			if((parameterSettings.required || otherRequired.includes(parameter)) && !params[parameter]){
				showError = true;
				console.error(`\r\nThe paramater '--${parameter}' is required.`);
				continue;
			}

			if(!params[parameter]){
				continue;
			}

			paramsFound++;

			if(parameterSettings.requires){
				otherRequired = [...otherRequired, ...parameterSettings.requires];
			}

            if(parameterSettings.type == "string" && typeof params[parameter] !== "string"){
                showError = true;
				console.error(`\r\nThe paramater '--${parameter}' is not a string.`);
				continue;
            }
            
			if(parameterSettings.type == "number"){
				params[parameter] = Number(params[parameter]);

				if(isNaN(params[parameter])){
					showError = true;
					console.error(`\r\nThe paramater '--${parameter}' is not a number.`);
					continue;
				}
			}

			if(parameterSettings.type == "json"){
				try{
					if(typeof params[parameter] == "boolean"){
						throw new Error("");
					}
					params[parameter] = JSON.parse(params[parameter]);
				}catch(e){
					showError = true;
					console.error(`\r\nThe paramater '--${parameter}' is not a valid JSON object.`);
					continue;
				}
				
			}
		}

		if(!paramsFound && !options.allowZero){
			showError = true;
		}

		if(showError){
			console.info(helpMessage);
			process.exit();
		}
	}
	
	return params;
}

module.exports = getArgs;
export default getArgs;
