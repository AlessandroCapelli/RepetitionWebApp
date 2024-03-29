import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ITopic } from 'app/shared/model/topic.model';

type EntityResponseType = HttpResponse<ITopic>;
type EntityArrayResponseType = HttpResponse<ITopic[]>;

@Injectable({ providedIn: 'root' })
export class TopicService {
  public resourceUrl = SERVER_API_URL + 'api/topics';

  constructor(protected http: HttpClient) {}

  create(topic: ITopic): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(topic);
    return this.http
      .post<ITopic>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(topic: ITopic): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(topic);
    return this.http
      .put<ITopic>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ITopic>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ITopic[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(topic: ITopic): ITopic {
    const copy: ITopic = Object.assign({}, topic, {
      dateCreated: topic.dateCreated && topic.dateCreated.isValid() ? topic.dateCreated.toJSON() : undefined,
      dateModified: topic.dateModified && topic.dateModified.isValid() ? topic.dateModified.toJSON() : undefined,
      dateDeleted: topic.dateDeleted && topic.dateDeleted.isValid() ? topic.dateDeleted.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateCreated = res.body.dateCreated ? moment(res.body.dateCreated) : undefined;
      res.body.dateModified = res.body.dateModified ? moment(res.body.dateModified) : undefined;
      res.body.dateDeleted = res.body.dateDeleted ? moment(res.body.dateDeleted) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((topic: ITopic) => {
        topic.dateCreated = topic.dateCreated ? moment(topic.dateCreated) : undefined;
        topic.dateModified = topic.dateModified ? moment(topic.dateModified) : undefined;
        topic.dateDeleted = topic.dateDeleted ? moment(topic.dateDeleted) : undefined;
      });
    }
    return res;
  }
}
