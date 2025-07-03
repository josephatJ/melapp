import { HttpConfig } from '../models/http-config.model';
import { HTTP_CONFIG } from '../constants/http.constant';

export function getSanitizedHttpConfig(httpConfig: any) {
  return { ...HTTP_CONFIG, ...(httpConfig || {}) };
}
