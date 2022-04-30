import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './CswpAppolloViewerWebPart.module.scss';
import * as strings from 'CswpAppolloViewerWebPartStrings';

import { IMission } from '../../models';
import { MissionServices } from '../../services';

export interface ICswpAppolloViewerWebPartProps {
  description: string;
  selectedMission: string;
}

export default class CswpAppolloViewerWebPart extends BaseClientSideWebPart<ICswpAppolloViewerWebPartProps> {
  private selectedMission: IMission;
  private missionDetailElement: HTMLElement;

  protected onInit(): Promise<void> {
    return new Promise<void>(
      (resolve: () => void, reject: (error: any) => void): void => {
        this.selectedMission = this._getSelectedMission();
        resolve();
      }
    );
  }

  public render(): void {
    this.domElement.innerHTML = `
    <section class="${styles.cswpAppolloViewer}">
      <div class="${styles.container}">
            <div class="ms-Grid-row ${styles.row}">
              <div class="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1">
                <p class="ms-font-xl">Apollo Mission Viewer</p>
                <p class="ms-font-s ms-fontWeight-light">${escape(
                  this.properties.description
                )}</p>
                <div class='apolloMissionDetails'></div>
              </div>
            </div>
          </div>
    </section>`;

    this.missionDetailElement = this.domElement.getElementsByClassName(
      'apolloMissionDetails'
    )[0] as HTMLElement;

    if (this.selectedMission) {
      this._renderMissionDetails(
        this.missionDetailElement,
        this.selectedMission
      );
    } else {
      this.missionDetailElement.innerHTML = '';
    }
  }

  private _getSelectedMission(): IMission {
    //   determine the mission ID, defaulting to Apollo 11 or selecting a new mission
    const selectedMissionId: string = this.properties.selectedMission
      ? this.properties.selectedMission
      : 'AS-506';

    // get the specified mission
    return MissionServices.getMission(selectedMissionId);
  }

  private _renderMissionDetails(element: HTMLElement, mission: IMission): void {
    element.innerHTML = `
      <p class="ms-font-m">
        <span class="ms-fontWeight-semibold">Mission: </span>
        ${escape(mission.name)}
      </p>
      <p class="ms-font-m">
        <span class="ms-fontWeight-semibold">Duration: </span>
        ${escape(this._getMissionTimeline(mission))}
      </p>
      <a href="${mission.wiki_href}" target="_blank" class="${styles.button}">
        <span class="${styles.label}">Learn more about ${escape(
      mission.name
    )} on Wikipedia &raquo;</span>
      </a>`;
  }

  private _getMissionTimeline(mission: IMission): string {
    let missionDate =
      mission.end_date !== ''
        ? `${mission.launch_date.toString()} - ${mission.end_date.toString()}`
        : `${mission.launch_date.toString()}`;
    return missionDate;
  }

  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) {
      // running in Teams
      return this.context.isServedFromLocalhost
        ? strings.AppLocalEnvironmentTeams
        : strings.AppTeamsTabEnvironment;
    }

    return this.context.isServedFromLocalhost
      ? strings.AppLocalEnvironmentSharePoint
      : strings.AppSharePointEnvironment;
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
