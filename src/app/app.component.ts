import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { KeycloakAngularModule } from 'keycloak-angular';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, KeycloakAngularModule, HttpClientModule],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss'
})
export class AppComponent {
	title = 'Lunchplanner';
}
