export interface Restaurant {
	id: number;
	name: string;
	logourl: string;
	city: string;
	street: string;
	subkitchens: string[];
}

export interface Kitchen {
	id: number;
	description: string;
	subkitchens: Kitchen[];
}
