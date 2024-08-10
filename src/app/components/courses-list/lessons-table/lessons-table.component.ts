import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-lessons-table',
  standalone: true,
  imports: [],
  templateUrl: './lessons-table.component.html',
  styleUrl: './lessons-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LessonsTableComponent {

}
