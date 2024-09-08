export type RestaurantType = 'lieferando' | 'custom';

export interface Restaurant {
	id: string;
	name: string;
	city: string;
	street: string;
	subkitchens: SubKitchen[];
	votes: number | null;
	upvotes: Vote[];
	downvotes: Vote[];
}

export interface Vote {
	id: string,
	userImage: string,
	firstName: string,
	lastName: string
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

export interface CustomRestaurant extends Restaurant {
	delivery: boolean;
	pickup: boolean;
	menu: string;
	logo: string;
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
	logourl: string;
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
