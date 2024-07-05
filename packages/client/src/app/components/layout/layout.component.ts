import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { fromEvent } from 'rxjs';
import { AuthenticationService } from '../../core/services/authentication/authentication.service';
import { UserModalComponent } from '../user-modal/user-modal.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  @Input() public showFooter = true;

  public loggedInUser = this.authenticationService.getUser();

  public headers = [
    { label: 'Jobs', link: '/dashboard', icon: 'home' },
    { label: 'Applied', link: '/applied', icon: 'school' },
  ];

  public menuOpen = signal(false);

  public constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly matDialog: MatDialog,
  ) {
    fromEvent(document, 'click')
      .pipe(takeUntilDestroyed())
      .subscribe((event) => {
        if (
          event.target &&
          this.menuOpen() &&
          (event.target as HTMLElement).parentElement?.id !== 'header_menu'
        ) {
          this.menuOpen.set(false);
        }
      });
  }

  public toggleMenu(evt: Event): void {
    evt.stopPropagation();
    this.menuOpen.update((state) => !state);
  }

  public openUserMenu(): void {
    this.matDialog.open(UserModalComponent);
  }

  public logout(): void {
    this.authenticationService.removeUser();
  }
}
