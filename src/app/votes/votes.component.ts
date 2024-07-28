import { Component, Input } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { VotePopupComponent } from '../vote-popup/vote-popup.component';
import { Vote } from '../models/restaurant';

@Component({
	selector: 'votes',
	standalone: true,
	imports: [CommonModule, VotePopupComponent, OverlayModule],
	templateUrl: './votes.component.html',
	styleUrl: './votes.component.scss'
})
export class VotesComponent {
	@Input({ required: true }) votes!: Vote[];

	protected voteListOverlayOpen = false;

	public onVoteUserClick(event: Event) {
		// stop propagation so restaurant's detail page won't be opened
		event.stopPropagation();

		this.voteListOverlayOpen = !this.voteListOverlayOpen;
	}
}
