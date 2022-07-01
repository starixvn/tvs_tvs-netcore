import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { MenuItem } from '../../../utility/models/menu-item.model';
import { CommonService } from '../../../utility/services/common.service';

@Component({
  selector: 'menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss']
})
export class MenuBarComponent implements OnInit {
  menuItems: MenuItem[] = [];
  username: string;
  isBlock: boolean;

  constructor(private readonly commonService: CommonService) { }

  async ngOnInit(): Promise<void> {
    this.isBlock = true;
    const model = await this.commonService.getUserInfo();
    this.username = model.userName;
    this.menuItems = _.orderBy(_.uniqBy(model.menuItem.filter(x => x.parentId <= 0), x => x.id), ['displayOrder'], ['asc']);
    this.menuItems.forEach(t => {
      t.items = model.menuItem.filter(z => z.parentId === t.id);
      t.items = _.orderBy(_.uniqBy(t.items, x => x.id), ['displayOrder'], ['asc']);
    });
    this.isBlock = false;
  }
}
