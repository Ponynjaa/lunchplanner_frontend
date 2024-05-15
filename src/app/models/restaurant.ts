export interface Restaurant {
	id: number;
	name: string;
	logourl: string;
	city: string;
	street: string;
	subkitchens: string[];
}

export interface Kitchen {
	description: string;
	subkitchens: string[];
}
