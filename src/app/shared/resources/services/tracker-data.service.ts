import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgxDhis2HttpClientService } from '../../modules/ngx-http-client/services/http-client.service';

@Injectable({
  providedIn: 'root',
})
export class TrackerDataService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  searchTrackedEntities(
    programId: string,
    orgUnit?: string,
    fields?: string,
    pagination?: {
      paging: boolean;
      totalPages?: boolean;
      page?: number;
      pageSize?: number;
    },
    parameters?: any,
    status?: string,
    returnAsIs?: boolean
  ): Observable<any> {
    let searchingParams: any[] =
      parameters &&
      Object.keys(parameters)?.length > 0 &&
      Object.keys(parameters)
        .map((key) => {
          if (
            parameters[key]?.id &&
            parameters[key]?.searchText &&
            parameters[key]?.searchText?.length > 0
          ) {
            return (
              'filter=' +
              parameters[key]?.id +
              ':' +
              (!parameters[key]?.comparison
                ? 'ilike'
                : parameters[key]?.comparison) +
              ':' +
              parameters[key]?.searchText
            );
          } else if (parameters[key]) {
            return key + '=' + parameters[key];
          } else {
            return null;
          }
        })
        ?.filter((item: any) => item);
    return this.httpClient
      .get(
        `tracker/trackedEntities.json?paging=${
          pagination?.paging
        }&fields=${fields}&order=createdAt:desc&program=${programId}${
          orgUnit ? '&orgUnitMode=DESCENDANTS&orgUnit=' + orgUnit : ''
        }${
          searchingParams?.length > 0 ? '&' + searchingParams?.join('&') : ''
        }${
          pagination?.page
            ? '&page=' +
              pagination?.page +
              '&pageSize=' +
              pagination?.pageSize +
              '&totalPages=' +
              pagination?.totalPages
            : ''
        }`
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  loadTrackedEntityDetails(id: string, programId?: string): Observable<any> {
    return this.httpClient
      .get(`tracker/trackedEntities/${id}.json?fields=*`)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
}
