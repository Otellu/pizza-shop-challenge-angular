import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filter-button',
  standalone: true,
  imports: [],
  templateUrl: './filter-button.component.html',
  styleUrl: './filter-button.component.css',
})
export class FilterButtonComponent {
  @Input() text = '';
  @Input() active = false;
  @Input() testId = '';
  @Output() onClick = new EventEmitter<void>();

  handleClick() {
    this.onClick.emit();
  }

  get buttonClasses(): string {
    const baseClasses =
      'px-4 py-2 rounded-full font-semibold border transition-all';
    return this.active
      ? `${baseClasses} bg-green-600 text-white active`
      : `${baseClasses} bg-white text-black border-black`;
  }
}
