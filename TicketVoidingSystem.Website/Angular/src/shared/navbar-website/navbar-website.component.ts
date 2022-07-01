import { Component, Input } from '@angular/core';
import { MenuItem } from 'src/utility/models/menu-item.model';

@Component({
  selector: 'navbar-website',
  templateUrl: './navbar-website.component.html',
  styleUrls: ['./navbar-website.component.scss']
})
export class NavbarWebsiteComponent {
  @Input() menuItems: MenuItem[];
}
