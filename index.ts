const getArgs = (
	/**
	 * Optional parameters object
	 */
	options?: {
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
	/**
	 * Exit if none of the parameters specified was found.
	 */
	allowZero=false)=>{
	const args = process.argv.join(' ');

	const regex = /\s+(?<name>--?[a-zA-Z_0-9]+)(=(?<value>(?:\{\"(?!.*--).*\})|[a-z0-9_A-Z\\\/\[\]\:\?\<\>\|\"\'\+\$\#\!\@\%\^\&\*\(\)\{\}\.\,\_\-]+))?/gmi;
		
	const params = Array.from(args.matchAll(regex)).reduce((o,v,i)=>(v?.groups?.name ? {
		...o,
		[v.groups.name.replace(/\-/g,'').trim()]: v?.groups?.value ?? options?.[v.groups.name]?.default ?? true
	} : o),{});

	if(options){
		let helpMessage = '';
		let showError = false;
		let paramsFound=0;
		let otherRequired: string[] = [];

		for(var option in options){
			var optionSettings = options[option];

			helpMessage += `\r\n--${option}${optionSettings.alias ? '\\-' + optionSettings.alias : ''} ${optionSettings.required ? 'required': ''} ${optionSettings.default ? '(default ' + optionSettings.default + ')' : ''}                  ${optionSettings.help}`;

			if(optionSettings.alias && params[optionSettings.alias]){
				params[option] = params[optionSettings.alias];
			}

			if((optionSettings.required || otherRequired.includes(option)) && !params[option]){
				showError = true;
				console.error(`The paramater '--${option}' is required.`);
				continue;
			}

			if(!params[option]){
				continue;
			}

			paramsFound++;

			if(optionSettings.requires){
				otherRequired = [...otherRequired, ...optionSettings.requires];
			}

            if(optionSettings.type == "string" && typeof params[option] !== "string"){
                showError = true;
				console.error(`The paramater '--${option}' is not a string.`);
				continue;
            }
            
			if(optionSettings.type == "number"){
				params[option] = Number(params[option]);

				if(isNaN(params[option])){
					showError = true;
					console.error(`The paramater '--${option}' is not a number.`);
					continue;
				}
			}

			if(optionSettings.type == "json"){
				try{
					params[option] = JSON.parse(params[option]);
				}catch(e){
					showError = true;
					console.error(`The paramater '--${option}' is not a valid JSON object.`);
					continue;
				}
				
			}
		}

		if(!paramsFound && !allowZero){
			showError = true;
		}

		if(showError){
			console.info(helpMessage);
			process.exit();
		}
	}
	
	return params;
}

export {getArgs};

export default getArgs;