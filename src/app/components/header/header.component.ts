import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {

  // constructor(private router: Router) {}

  // public _onClick(): void {
  //   this.router.navigate(["/report"]);
  // }
}
