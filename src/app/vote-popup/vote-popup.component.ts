import { Component, Input } from '@angular/core';
import { Vote } from '../models/restaurant';

@Component({
	selector: 'vote-popup',
	standalone: true,
	imports: [],
	templateUrl: './vote-popup.component.html',
	styleUrl: './vote-popup.component.scss'
})
export class VotePopupComponent {
	@Input({required: true}) votes!: Vote[];
}
