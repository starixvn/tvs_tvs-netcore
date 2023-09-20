import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { CommonService } from '../../../utility/services/common.service';
import { MenuName } from './menu-bar.constant';
import { MenuItem } from './menu-bar.model';

@Component({
  selector: 'menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss']
})
export class MenuBarComponent implements OnInit {
  menuItems: MenuItem[] = [];
  username: string;
  isBlock: boolean;
  rootUrl = '/';
  oldSiteAbsoluteUrl = 'https://';


  constructor(private readonly commonService: CommonService) { }

  async ngOnInit(): Promise<void> {
    this.isBlock = true;
    this.rootUrl = document.body.getAttribute('root-url');
    this.oldSiteAbsoluteUrl = this.getOldSiteAbsoluteUrl(document.body.getAttribute('old-site-root-url'));
    const model = await this.commonService.getNapUserInfo();
    this.replaceRootUrl(model.menuItem);
    this.username = model.userName;
    this.menuItems = _.orderBy(_.uniqBy(model.menuItem.filter(x => x.parentId <= 0), x => x.id), ['displayOrder'], ['asc']);
    this.menuItems.forEach(t => {
      t.items = model.menuItem.filter(z => z.parentId === t.id);
      t.items = _.orderBy(_.uniqBy(t.items, x => x.id), ['displayOrder'], ['asc']);
    });
    this.isBlock = false;
  }

  private replaceRootUrl(menuItems: MenuItem[]): void {
    menuItems.forEach(menu => {
      if (this.isNewSite(menu.name)) {
        menu.url = this.rootUrl + menu.url.substring(1);
      } else {
        menu.url = `${this.oldSiteAbsoluteUrl}${menu.url.substring(1)}`;
      }
    });
  }

  private getOldSiteAbsoluteUrl(oldSiteRootUrl: string): string {
    if (oldSiteRootUrl.startsWith('/')) {
      return `${window.location.origin}${oldSiteRootUrl}`;
    }

    return oldSiteRootUrl;
  }

  private isNewSite(menuName: string): boolean {
    return menuName === MenuName.AB_EXCEPTION_LIST 
    || menuName === MenuName.MARK_UNMARK_TICKETS
    || menuName === MenuName.TICKET_LISTING
    || menuName === MenuName.VOID_SINGLE_BET
    || menuName === MenuName.MANAGE_REQUEST
    || menuName === MenuName.ADD_REQUEST
    || menuName === MenuName.UPLOAD_BATCH_MESSAGE;
  }
}
