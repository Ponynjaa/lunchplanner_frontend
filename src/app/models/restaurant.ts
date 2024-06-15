export interface Restaurant {
	id: number;
	name: string;
	logourl: string;
	city: string;
	street: string;
	subkitchens: SubKitchen[];
}

export interface LieferandoRestaurant extends Restaurant {
	deliveryMethods: {
		orderMethods: string;
		delivery: {
			open: boolean;
			orderAhead: boolean;
		};
		pickup: {
			open: boolean;
			orderAhead: boolean;
		};
	};
	deliveryCosts: {
		minimumAmount: number;
		costs: {
			from: number;
			to: number;
			costs: number;
		};
		ddf: string;
	};
	estimatedDeliveryTime: string;
	new: boolean;
	open: boolean;
	eta: {
		min: number;
		max: number;
	};
	ratingCount: number;
	rating: string;
}

export interface Kitchen {
	id: number;
	description_de: string;
	description_en: string;
	subkitchens: SubKitchen[];
}

export interface SubKitchen {
	id: number;
	description_de: string;
	description_en: string;
}
