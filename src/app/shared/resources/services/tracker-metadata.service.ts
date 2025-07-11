import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NgxDhis2HttpClientService } from '../../modules/ngx-http-client/services/http-client.service';

@Injectable({
  providedIn: 'root',
})
export class TrackerMetadataService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  getProgram(id: string): Observable<any> {
    const api: string =
      'programs/' +
      id +
      '.json?fields=id,name,code,trackedEntityType,' +
      'programTrackedEntityAttributes[mandatory,displayInList,' +
      'trackedEntityAttribute[id,name,valueType,formName,optionSet' +
      '[options[id,name,code]]]],programStages[id,name,description,programStageDataElements[id,compulsory,displayInReports,dataElement[id,name,code,formName,valueType,optionSets[options[id,name,code]]]],programStageSections[id,name,description,dataElements[id,name,code,formName,shortName,valueType,optionSet[options[id,name,code]]]]],programSections[id,name,trackedEntityAttributes' +
      '[id,name,code,shortName,valueType,formName,optionSet' +
      '[options[id,name,code]]]]';
    return this.httpClient.get(api);
  }
}
