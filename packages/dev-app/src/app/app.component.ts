import { Component } from '@angular/core';

import { SessionFacade } from './session/session.facade';

@Component({
  selector: 'ark-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(readonly session: SessionFacade) {}
}
