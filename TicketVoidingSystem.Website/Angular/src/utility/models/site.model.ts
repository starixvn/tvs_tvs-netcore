export class SiteModel {
  siteId: string;
  siteName: string;
  groupName?: string;
  hidden?: boolean;
}

export class GroupSiteModel {
  groupName: string;
  groupId: string;
  sites: SiteModel[];
}