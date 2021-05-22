// @flow
import i18n from '../i18n';

export type Location =
  '基隆市'
  | '臺北市'
  | '新北市'
  | '桃園市'
  | '新竹縣'
  | '新竹市'
  | '彰化縣'
  | '雲林縣'
  | '苗栗縣'
  | '宜蘭縣'
  | '臺中市'
  | '彰化縣'
  | '南投縣'
  | '嘉義縣'
  | '嘉義市'
  | '台南市'
  | '臺南市'
  | '高雄市'
  | '屏東縣'
  | '花蓮縣'
  | '連江縣'
  | '澎湖縣'
  | '臺東縣'
  | '金門縣';

export function getLocationName(location: Location, t): string {
  switch (location) {
    case '基隆市':
      return t('txt-keelung');
    case '臺北市':
      return t('txt-taipei');
    case '新北市':
      return t('txt-newTaipeiCity');
    case '新竹縣':
      return t('txt-hsinchuCounty');
    case '新竹市':
      return t('txt-hsinchuCity');
    case '彰化縣':
      return t('txt-changhua');
    case '苗栗縣':
      return t('txt-miaoli');
    case '桃園市':
      return t('txt-taoyuan');
    case '宜蘭縣':
      return t('txt-yilan');
    case '臺中市':
      return t('txt-taichung');
    case '雲林縣':
      return t('txt-yunlin');
    case '南投縣':
      return t('txt-nantou');
    case '嘉義縣':
    case '嘉義市':
      return t('txt-chiayi');
    case '臺南市':
      return t('txt-tainan');
    case '高雄市':
      return t('txt-kaohsiung');
    case '屏東縣':
      return t('txt-pingtung');
    case '花蓮縣':
      return t('txt-hualien');
    case '連江縣':
      return t('txt-lienjiang');
    case '澎湖縣':
      return t('txt-penghu');
    case '臺東縣':
      return t('txt-taitung');
    case '金門縣':
      return t('txt-kinmen');
    default:
      return location;
  }
}