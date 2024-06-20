import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'groupRestaurants',
	standalone: true
})
export class GroupByPipe implements PipeTransform {

	transform(collection: any[]): any[] {
		if (!collection) {
			return [];
		}

		const groupedCollection = collection.reduce((previous, current) => {
			let groupKey;
			if (!current.deliveryMethods.delivery.open && !current.deliveryMethods.pickup.open) {
				groupKey = 'closed';
			} else if (current.deliveryMethods.delivery.orderAhead || current.deliveryMethods.pickup.orderAhead) {
				groupKey = 'opens_soon';
			} else {
				groupKey = 'open';
			}

			if (!previous[groupKey]) {
				previous[groupKey] = [current];
			} else {
				previous[groupKey].push(current);
			}

			return previous;
		}, {});

		const sortedGroups = [
			{ key: 'open', value: groupedCollection['open'] || [] },
			{ key: 'opens_soon', value: groupedCollection['opens_soon'] || [] },
			{ key: 'closed', value: groupedCollection['closed'] || [] }
		];

		return sortedGroups;
	}

}
