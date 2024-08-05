import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-secondary-button',
  templateUrl: './secondary-button.component.html',
})
export class SecondaryButtonComponent {
  @Input() label: string = '';
  @Output() onClick = new EventEmitter<void>();
}