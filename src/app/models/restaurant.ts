export interface Restaurant {
	id: number;
	name: string;
	logourl: string;
	city: string;
	street: string;
	deliveryMethods: DeliveryMethods;
	subkitchens: SubKitchen[];
}

export enum OrderMethod {
	DELIVERY = '1',
	DELIVERY_AND_PICKUP = '2',
	PICKUP = '3'
}

export interface DeliveryMethods {
	orderMethods: OrderMethod;
	delivery: {
		open: number;
		orderAhead: string;
	};
	pickup: {
		open: number;
		orderAhead: string;
	};
}

export interface DeliveryCosts {
	minimumAmount: number;
	costs: {
		from: number;
		to: number;
		costs: number;
	};
	ddf: string;
}

export interface ETA {
	min: number;
	max: number;
}

export interface LieferandoRestaurant extends Restaurant {
	deliveryMethods: DeliveryMethods;
	deliveryCosts: DeliveryCosts
	estimatedDeliveryTime: string;
	distance: number;
	new: boolean;
	open: boolean;
	eta: ETA;
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
