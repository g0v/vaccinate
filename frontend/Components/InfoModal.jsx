/* eslint-disable linebreak-style */
// @flow
import * as React from 'react';

export default function InfoModal(): React.Node {
  const [news, setRows] = React.useState({ text: '獲取資料中...', buttons: [] });
  const apiURL = process.env.API_URL || '';
  React.useEffect(() => {
    const url = '/popup_news';
    fetch(apiURL + url).then((data) => data.json()).then((res) => setRows(res));
  }, []); // Empty list makes this useEffect similar to componentDidMount();

  return (
    <div className="modal fade" id="InfoModal" tabIndex="-1" aria-labelledby="InfoModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>
          <div className="modal-body text-center p-4">
            <h5>這是個整理1922以外的預約方式的網站</h5>
            <p>{news.text}</p>
            <div className="d-grid">
              {
                news.buttons.map(
                  (button) => (
                    <a role="button" className="btn btn-outline-primary mb-2" href={button.words} target="_blank" rel="noreferrer">{button.title}</a>
                  ),
                )
              }
              <button type="button" className="btn btn-primary mb-2" data-bs-dismiss="modal" aria-label="Close">進入本網站 開始找疫苗</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
