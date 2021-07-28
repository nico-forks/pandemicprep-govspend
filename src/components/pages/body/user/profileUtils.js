/** @format */

import {
	addUser,
	loginUser,
	updateUser,
} from '../../../../api';

export async function registrationHandler({
	firstName,
	lastName,
	email,
	password1,
	password2,
	addressLine1 = '',
	addressLine2 = '',
	city = '',
	state = '',
	zipcode = '',
	country = '',
	phone = null,
}) {
	if (password1.length > 0) {
		const passwordCheck = checkPassword(password1, password2);
		if (!passwordCheck.valid) {
			alert(passwordCheck.message);
			return;
		}
	}
	try {
		const newUser = await addUser({
			isUser: true,
			firstName,
			lastName,
			email,
			password: password1,
			addressLine1,
			addressLine2,
			city,
			state,
			zipcode,
			country,
			phone
		});

		if (newUser.message) {
			alert(newUser.message);
		} else {
			localStorage.setItem('panprepToken', newUser.token);
			return newUser;
		}
	} catch (error) {
		console.error(error);
	}
}

export async function adminRegisterNewUser({
	firstName,
	lastName,
	email,
	password1,
	password2,
	isUser,
	isAdmin,
}) {
	if (password1.length > 0) {
		const passwordCheck = checkPassword(password1, password2);
		if (!passwordCheck.valid) {
			alert(passwordCheck.message);
			return;
		}
	}
	try {
		const newUser = await addUser({
			isUser: true,
			firstName,
			lastName,
			email,
			password: password1,
			isAdmin,
		});

		if (newUser.message) {
			alert(newUser.message);
		} else {
			return newUser;
		}
	} catch (error) {
		console.error(error);
	}
}

export async function loginHandler({ email, password1 }) {
	try {
		const user = await loginUser({
			email,
			password: password1,
		});

		if (user.message) {
			alert(user.message);
		} else {
			localStorage.setItem('panprepToken', user.token);

			return user;
		}
	} catch (error) {
		console.error(error);
	}
}

export async function guestHandler({
	firstName,
	lastName,
	email,
	address1,
	address2,
	city,
	state,
	zipcode,
	country,
	phone,
}) {
	addUser({
		firstName,
		lastName,
		email,
		addressLine1: address1,
		addressLine2: address2,
		city,
		state,
		zipcode,
		country,
		phone,
	})
		.then((result) => {
			if (result.message) {
				alert(result.message);
			} else {
				
				localStorage.setItem('panprepToken', result.token);
				return result;
			}
		})
		.catch((error) => {
			console.error(error);
		});
}

export function updateHandler(editObject, token) {
	if (editObject.password1) {
		const passwordCheck = checkPassword(editObject.password1, editObject.password2);
		if (!passwordCheck.valid) {
			alert(passwordCheck.message);
			return;
		} else {
			editObject.password = editObject.password1;
			delete editObject.password1;
			delete editObject.password2;
		}
	}
	updateUser(editObject, token)
		.then((result) => {
			if (result.message) {
				alert(result.message);
			} else {
				return result;
			}
		})
		.catch((error) => {
			console.error(error);
		});
}

function checkPassword(password1, password2) {
	if (password1 === password2) {
		var password = password1;
	} else {
		return { valid: false, message: 'Passwords must match' };
	}
	if (password.length < 8) {
		return { valid: false, message: '- 1+ numbers\n- 1+ uppercase\n- 8+ characters' };
	}
	const passwordCharacters = password.split('');
	let hasNumber = false;
	let hasUpper = false;
	passwordCharacters.forEach((char) => {
		if (char >= 0 && char <= 10) {
			hasNumber = true;
		}
		if (char >= 'A' && char <= 'Z') {
			hasUpper = true;
		}
	});
	if (hasNumber) {
		return { valid: true, message: 'valid' };
	} else if(!hasNumber) {
		return { valid: false, message: '- 1+ numbers\n- 1+ uppercase\n- 8+ characters' };
	}
	if (hasUpper) {
		return { valid: true, message: 'valid' };
	} else {
		return { valid: false, message: '- 1+ numbers\n- 1+ uppercase\n- 8+ characters' };
	}
}

export const states = [
	'Alabama',
	'Alaska',
	'American Samoa',
	'Arizona',
	'Arkansas',
	'California',
	'Colorado',
	'Connecticut',
	'Delaware',
	'District of Columbia',
	'Federated States of Micronesia',
	'Florida',
	'Georgia',
	'Guam',
	'Hawaii',
	'Idaho',
	'Illinois',
	'Indiana',
	'Iowa',
	'Kansas',
	'Kentucky',
	'Louisiana',
	'Maine',
	'Marshall Islands',
	'Maryland',
	'Massachusetts',
	'Michigan',
	'Minnesota',
	'Mississippi',
	'Missouri',
	'Montana',
	'Nebraska',
	'Nevada',
	'New Hampshire',
	'New Jersey',
	'New Mexico',
	'New York',
	'North Carolina',
	'North Dakota',
	'Northern Mariana Islands',
	'Ohio',
	'Oklahoma',
	'Oregon',
	'Palau',
	'Pennsylvania',
	'Puerto Rico',
	'Rhode Island',
	'South Carolina',
	'South Dakota',
	'Tennessee',
	'Texas',
	'Utah',
	'Vermont',
	'Virgin Island',
	'Virginia',
	'Washington',
	'West Virginia',
	'Wisconsin',
	'Wyoming',
	'None',
];
export const countries = [
	'United States',
	'Afghanistan',
	'Albania',
	'Algeria',
	'American Samoa',
	'Andorra',
	'Angola',
	'Anguilla',
	'Antarctica',
	'Antigua and Barbuda',
	'Argentina',
	'Armenia',
	'Aruba',
	'Australia',
	'Austria',
	'Azerbaijan',
	'Bahamas',
	'Bahrain',
	'Bangladesh',
	'Barbados',
	'Belarus',
	'Belgium',
	'Belize',
	'Benin',
	'Bermuda',
	'Bhutan',
	'Bolivia',
	'Bosnia and Herzegowina',
	'Botswana',
	'Bouvet Island',
	'Brazil',
	'British Indian Ocean Territory',
	'Brunei Darussalam',
	'Bulgaria',
	'Burkina Faso',
	'Burundi',
	'Cambodia',
	'Cameroon',
	'Canada',
	'Cape Verde',
	'Cayman Islands',
	'Central African Republic',
	'Chad',
	'Chile',
	'China',
	'Christmas Island',
	'Cocos (Keeling) Islands',
	'Colombia',
	'Comoros',
	'Congo',
	'Congo, the Democratic Republic of the',
	'Cook Islands',
	'Costa Rica',
	"Cote d'Ivoire",
	'Croatia (Hrvatska)',
	'Cuba',
	'Cyprus',
	'Czech Republic',
	'Denmark',
	'Djibouti',
	'Dominica',
	'Dominican Republic',
	'East Timor',
	'Ecuador',
	'Egypt',
	'El Salvador',
	'Equatorial Guinea',
	'Eritrea',
	'Estonia',
	'Ethiopia',
	'Falkland Islands (Malvinas)',
	'Faroe Islands',
	'Fiji',
	'Finland',
	'France',
	'France Metropolitan',
	'French Guiana',
	'French Polynesia',
	'French Southern Territories',
	'Gabon',
	'Gambia',
	'Georgia',
	'Germany',
	'Ghana',
	'Gibraltar',
	'Greece',
	'Greenland',
	'Grenada',
	'Guadeloupe',
	'Guam',
	'Guatemala',
	'Guinea',
	'Guinea-Bissau',
	'Guyana',
	'Haiti',
	'Heard and Mc Donald Islands',
	'Holy See (Vatican City State)',
	'Honduras',
	'Hong Kong',
	'Hungary',
	'Iceland',
	'India',
	'Indonesia',
	'Iran (Islamic Republic of)',
	'Iraq',
	'Ireland',
	'Israel',
	'Italy',
	'Jamaica',
	'Japan',
	'Jordan',
	'Kazakhstan',
	'Kenya',
	'Kiribati',
	"Korea, Democratic People's Republic of",
	'Korea, Republic of',
	'Kuwait',
	'Kyrgyzstan',
	"Lao, People's Democratic Republic",
	'Latvia',
	'Lebanon',
	'Lesotho',
	'Liberia',
	'Libyan Arab Jamahiriya',
	'Liechtenstein',
	'Lithuania',
	'Luxembourg',
	'Macau',
	'Macedonia, The Former Yugoslav Republic of',
	'Madagascar',
	'Malawi',
	'Malaysia',
	'Maldives',
	'Mali',
	'Malta',
	'Marshall Islands',
	'Martinique',
	'Mauritania',
	'Mauritius',
	'Mayotte',
	'Mexico',
	'Micronesia, Federated States of',
	'Moldova, Republic of',
	'Monaco',
	'Mongolia',
	'Montserrat',
	'Morocco',
	'Mozambique',
	'Myanmar',
	'Namibia',
	'Nauru',
	'Nepal',
	'Netherlands',
	'Netherlands Antilles',
	'New Caledonia',
	'New Zealand',
	'Nicaragua',
	'Niger',
	'Nigeria',
	'Niue',
	'Norfolk Island',
	'Northern Mariana Islands',
	'Norway',
	'Oman',
	'Pakistan',
	'Palau',
	'Panama',
	'Papua New Guinea',
	'Paraguay',
	'Peru',
	'Philippines',
	'Pitcairn',
	'Poland',
	'Portugal',
	'Puerto Rico',
	'Qatar',
	'Reunion',
	'Romania',
	'Russian Federation',
	'Rwanda',
	'Saint Kitts and Nevis',
	'Saint Lucia',
	'Saint Vincent and the Grenadines',
	'Samoa',
	'San Marino',
	'Sao Tome and Principe',
	'Saudi Arabia',
	'Senegal',
	'Seychelles',
	'Sierra Leone',
	'Singapore',
	'Slovakia (Slovak Republic)',
	'Slovenia',
	'Solomon Islands',
	'Somalia',
	'South Africa',
	'South Georgia and the South Sandwich Islands',
	'Spain',
	'Sri Lanka',
	'St. Helena',
	'St. Pierre and Miquelon',
	'Sudan',
	'Suriname',
	'Svalbard and Jan Mayen Islands',
	'Swaziland',
	'Sweden',
	'Switzerland',
	'Syrian Arab Republic',
	'Taiwan, Province of China',
	'Tajikistan',
	'Tanzania, United Republic of',
	'Thailand',
	'Togo',
	'Tokelau',
	'Tonga',
	'Trinidad and Tobago',
	'Tunisia',
	'Turkey',
	'Turkmenistan',
	'Turks and Caicos Islands',
	'Tuvalu',
	'Uganda',
	'Ukraine',
	'United Arab Emirates',
	'United Kingdom',
	'United States',
	'United States Minor Outlying Islands',
	'Uruguay',
	'Uzbekistan',
	'Vanuatu',
	'Venezuela',
	'Vietnam',
	'Virgin Islands (British)',
	'Virgin Islands (U.S.)',
	'Wallis and Futuna Islands',
	'Western Sahara',
	'Yemen',
	'Yugoslavia',
	'Zambia',
	'Zimbabwe',
];
