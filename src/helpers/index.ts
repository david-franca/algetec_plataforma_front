import 'moment/dist/locale/pt-br';

import moment from 'moment';

moment.locale('pt-br');

export function handleStringDate(date: string | null) {
  return date && moment(date).isValid() ? moment(new Date(date)).format('L') : null;
}
