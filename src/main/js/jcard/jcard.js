var jcard = typeof jcard == 'object' ? jcard : {};

/**
 * @export
 * @enum {string}
 */
jcard.Property = {
	NAME: 'n',
	FORMATTED_NAME: 'fn',
	ORGANIZATION: 'org',
	ADDRESS: 'adr',
	PHONE: 'tel',
	EMAIL: 'email',
	URL: 'url',
	TIMEZONE: 'tz',
	GEOGRAPHY: 'geo',
	REVISION: 'rev',
	NOTE: 'note'
};

/**
 * @export
 * @enum {string}
 */
jcard.Type = {
	WORK: 'work',
	HOME: 'home',
	VOICE: 'voice',
	TEXT: 'text',
	CELL: 'cell',
	VIDEO: 'video'
};

/**
 * @export
 * @enum {string}
 */
jcard.Data = {
	STRING: 'string',
	URI: 'uri',
	UTC_OFFSET: 'utc-offset',
	TEXT: 'text',
	DATE: 'date-and-or-time'
};

/**
 * @export
 * @typedef {Object}
 * @property {string|undefined} first
 * @property {string|undefined} last
 * @property {string|undefined} initial
 * @property {string|undefined} prefix
 * @property {string|undefined} suffix
 */
jcard.Name;

/**
 * @export
 * @typedef {Object}
 * @property {string|undefined} line1
 * @property {string|undefined} line2
 * @property {string|undefined} city
 * @property {string|undefined} state
 * @property {string|undefined} zip
 * @property {string|undefined} country
 * @property {jcard.Type|Array<jcard.Type>|undefined} type
 */
jcard.Address;

/**
 * @export
 * @typedef {Object}
 * @property {string} email
 * @property {jcard.Type|Array<jcard.Type>|undefined} type
 */
jcard.Email;

/**
 * @export
 * @typedef {Object}
 * @property {string} area
 * @property {string} number
 * @property {string|undefined} extension
 * @property {jcard.Type|Array<jcard.Type>|undefined} type
 */
jcard.Phone;

/**
 * @export
 * @typedef {Object}
 * @property {string} name
 * @property {jcard.Type|Array<jcard.Type>|undefined} type
 */
jcard.Oraganization;

/**
 * @export
 * @typedef {Object}
 * @property {number} lat
 * @property {number} lng
 * @property {jcard.Type|Array<jcard.Type>|undefined} type
 */
jcard.Geo;

jcard.Builder = function(){
	this.data = ['vcard', [['version', {}, 'text', '4.0']]];
};

jcard.Builder.prototype = {
	/** @private
	 * @member {Array<string>}
	 */
	nameValue: null,
	/** @private
	 * @member {string}
	 */
	orgValue: null,
	/** @private
	 * @member {Array}
	 */
	data: null,
	/** @export
	 *  @param {jcard.Name} name
	 *  @return {Array}
	 */ 
	name: function(name){
		var values = [], prefix = [], suffix = [];
		values.push(name.last || '');
		values.push(name.first || '');
		values.push(name.initial || '');
		values.push(name.prefix || '');
		values.push(name.suffix || '');
		return this.prop(jcard.Property.NAME, {}, jcard.Data.TEXT, [values]);
	},
	/** @export
	 *  @param {jcard.Address} name
	 *  @return {Array}
	 */ 
	address: function(address){
		var line1 = address.line1 || '',
			line2 = address.line2 || '',
			city = address.city || '',
			state = address.state || '',
			zip = address.zip || '',
			country = address.country || '',
			values = [],
			label = line1,
			params = this.params(address.type);
		values.push(line1);
		values.push(city);
		values.push(line2);
		values.push(state);
		values.push(zip);
		values.push(country);
		if (line2) label += ('\\n' + line2);
		label += ('\\n' + city + '\\, ' + state + ' ' + zip);
		if (country) label += ('\\n' + country);
		params.label = label;
		return this.prop(jcard.Property.ADDRESS, params, jcard.Data.TEXT, [values]);
	},
	/** @export
	 *  @param {jcard.Email} email
	 *  @return {Array}
	 */ 
	email: function(email){
		return this.prop(jcard.Property.EMAIL, this.params(email.type), jcard.Data.TEXT, [email.email]);
	},
	/** @export
	 *  @param {jcard.Phone} phone
	 *  @return {Array}
	 */ 
	phone: function(phone){
		var number = '+1-' + phone.area + '-' + phone.number;
		number += phone.extension ? (',' + phone.extension) : '';
		return this.prop(jcard.Property.PHONE, this.params(phone.type), jcard.Data.URI, [number]);
	},
	/** @export
	 *  @param {jcard.Url} url
	 *  @return {Array}
	 */ 
	url: function(url){
		return this.prop(jcard.Property.URL, this.params(url.type), jcard.Data.URI, [url.url]);
	},
	/** @export
	 *  @param {jcard.Organization} oraganization
	 *  @return {Array}
	 */ 
	organization: function(organization){
		return this.prop(jcard.Property.ORGANIZATION, this.params(organization.type), jcard.Data.TEXT, [organization.name]);
	},
	/** @export
	 *  @param {string} timezone
	 *  @return {Array}
	 */ 
	timezone: function(timezone){
		return this.prop(jcard.Property.TIMEZONE, {}, jcard.Data.UTC_OFFSET, [timezone]);
	},
	/** @export
	 *  @param {jcard.Geo} geo
	 *  @return {Array}
	 */ 
	geography: function(geo){
		return this.prop(jcard.Property.GEOGRAPHY, this.params(geo.type), jcard.Data.URI, ['geo:' + geo.lat + ',' + geo.lng]);
	},
	/** @export
	 *  @param {string} note
	 *  @return {Array}
	 */ 
	note: function(note){
		return this.prop(jcard.Property.NOTE, {}, jcard.Data.TEXT, [note]);
	},
	/** @export
	 *  @param {Object} date
	 *  @return {Array}
	 */ 
	revision: function(date){
		var rev = date.toISOString(), z = rev.substr(rev.length - 1);
		rev = rev.replace(/-|:/g, '');
		rev = rev.substr(0, rev.indexOf('.')) + z;
		return this.prop(jcard.Property.REVISION, {}, jcard.Data.DATE, [rev]);
	},
	/** @export
	 *  @param {Array} prop
	 */ 
	add: function(prop){
		if (!this.nameValue && prop[0] == jcard.Property.NAME){
			var values = [];
			for (var i = 2; i < prop.length; i++){
				values.push(prop[i]);
			}
			this.nameValue = values;
		}
		if (!this.orgValue && prop[0] == jcard.Property.ORGANIZATION){
			this.orgValue = prop[3];
		}
		this.data[1].push(prop);
	},
	/** @export
	 *  @return {Array}
	 */
	jcard: function(){
		this.checkForFormattedName();
		return this.data;
	},
	/** @export
	 *  @return {string}
	 */
	json: function(){
		return JSON.stringify(this.jcard());
	},
	/** @private */
	checkForFormattedName: function(){
		var data = this.data[1], formattedName;
		for (var i = 0; i < data.length; i++){
			var prop = data[i];
			if (prop[0] == jcard.Property.FORMATTED_NAME){
				formattedName = prop;
			}
		}
		if (!formattedName) {
			this.formattedName();
		}
	},
	/** @private */
	formattedName: function(){
		var name = this.nameValue ? this.nameValue[1] : null, formattedName = '';
		if (name){
			var first = name[1], 
				last = name[0], 
				initial = name[2], 
				prefix = name[3], 
				suffix = name[4];
			formattedName += (prefix || ''); 
			formattedName += (' '  + (first || ''));
			formattedName += (' '  + (initial || ''));
			formattedName += (' '  + (last || ''));
			formattedName += (suffix ? (', ' + suffix) : '');
		}else {
			formattedName = this.orgValue || '';
		}
		formattedName = formattedName.trim().replace(/  /, ' ');
		if (formattedName){
			var prop = this.prop(jcard.Property.FORMATTED_NAME, {}, jcard.Data.TEXT, [formattedName]);
			this.add(prop);
		}
	},
	/** @private
	 *  @param {stringArray<string>} prop
	 *  @return {{Object<string, string>}|{Object<string, Array<string>}}
	 */
	params: function(type){
		if (type){
			return {type: type};			
		}
		return {};
	},
	/** @private
	 *  @param {string} prop
	 *  @param {{Object<string, string>}|{Object<string, Array<string>}} params
	 *  @param {string} dataType
	 *  @param {Array<string>}} values
	 *  @return {Array}
	 */ 
	prop: function(prop, params, dataType, values){
		var prop = [prop, params, dataType];
		for (var i = 0; i < values.length; i++){
			prop.push(values[i]);			
		}
		return prop;
	}	
};