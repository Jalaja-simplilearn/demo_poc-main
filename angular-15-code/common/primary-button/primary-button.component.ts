import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-primary-button',
  templateUrl: './primary-button.component.html',
})
export class PrimaryButtonComponent {
  @Input() label: string = '';
  @Output() onClick = new EventEmitter<void>();
}