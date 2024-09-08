import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GroupService } from '../../services/group.service';
import { InvitationInfos } from '../../models/group';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-invitation',
	standalone: true,
	imports: [MatButtonModule, MatProgressSpinnerModule, RouterModule],
	templateUrl: './invitation.component.html',
	styleUrl: './invitation.component.scss'
})
export class InvitationComponent implements OnInit, OnDestroy {
	private sub!: Subscription;
	code!: string;
	invitationInfos?: InvitationInfos;
	loading = true;

	constructor (private route: ActivatedRoute, private groupService: GroupService, private router: Router, private snackBar: MatSnackBar) { }

	ngOnInit() {
		this.sub = this.route.params.subscribe(params => {
			this.code = params['code'];
			this.getInvitationDetails();
		});
	}

	getInvitationDetails() {
		this.groupService.getInvitationInfos(this.code).subscribe({
			next: (response) => {
				this.invitationInfos = response;
				this.loading = false;
			},
			error: (error) => {
				this.loading = false;
			}
		});
	}

	joinGroup() {
		this.groupService.joinGroup(this.code).subscribe({
			next: (response) => {
				this.router.navigate(['/']);
			},
			error: (response) => {
				if (response.error.code === '23505') {
					this.router.navigate(['/']);
					return;
				}

				// TODO: use custom component at some point...
				this.snackBar.open('Invitation is expired.', 'Close', { duration: 5000 });
			}
		});
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}
}
