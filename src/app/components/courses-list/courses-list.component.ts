import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-courses-list',
  standalone: true,
  imports: [],
  templateUrl: './courses-list.component.html',
  styleUrl: './courses-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoursesListComponent {

}
