export interface Restaurant {
	id: number;
	name: string;
	logourl: string;
	city: string;
	street: string;
	subkitchens: SubKitchen[];
}

export interface Kitchen {
	id: number;
	description: string;
	subkitchens: SubKitchen[];
}

export interface SubKitchen {
	id: number;
	description: string;
}
