
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as _ from 'lodash';
import { CommonService } from '../../../utility/services/common.service';
import { MenuItem } from './menu-bar.model';

@Component({
  standalone: true,
  selector: 'menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss'],
  imports: [FormsModule]
})
export class MenuBarComponent implements OnInit {
  menuItems: MenuItem[] = [];
  username: string;
  isBlock: boolean;
  rootUrl = '/';
  private readonly commonService = inject(CommonService);

  async ngOnInit(): Promise<void> {
    this.isBlock = true;
    this.rootUrl = document.body.getAttribute('root-url');
    const model = await this.commonService.getNapUserInfo();
    if (model) {
      this.username = model.userName;
      this.menuItems = _.orderBy(_.uniqBy(model.menuItem.filter(x => x.parentId <= 0), x => x.id), ['displayOrder'], ['asc']);
      this.menuItems.forEach(t => {
        t.items = model.menuItem.filter(z => z.parentId === t.id);
        t.items = _.orderBy(_.uniqBy(t.items, x => x.id), ['displayOrder'], ['asc']);
      });
      this.isBlock = false;
    }
  }
}
